import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { UserRole } from "./types/auth/role_type";
import { decodeJwtPayload } from "./storage/jwt_decoder";

// 1) next-intl middleware
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
});

// 2) Role mapping
const roleRoot: Record<UserRole, "brand" | "influencer" | "agency"> = {
  client: "brand",
  influencer: "influencer",
  agency: "agency",
};

type Locale = (typeof routing.locales)[number];
const isLocale = (v: string): v is Locale =>
  (routing.locales as readonly string[]).includes(v);

function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split("/")[1] ?? "";
  return isLocale(seg) ? seg : routing.defaultLocale;
}

function isExpired(exp?: number) {
  if (!exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return exp <= now;
}

// 3) Combined middleware
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /**
   * Safety guard (extra, even though matcher excludes these)
   * Prevent locale prefixing on Next.js assets + services + public files.
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/service") ||
    pathname.startsWith("/trpc") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Siam header logic
  const currentPath = pathname;

  // Run next-intl first (it may redirect / rewrite)
  const intlRes = intlMiddleware(req);

  // Attach header to response (keep Siam behavior)
  intlRes.headers.set("x-current-path", currentPath);

  // ---- Your auth/role guard logic ----
  const locale = getLocaleFromPath(pathname);

  const token = req.cookies.get("access_token")?.value || "";
  const payload = token ? decodeJwtPayload(token) : null;

  const isAuthed = Boolean(token && payload && !isExpired(payload.exp));
  const isVerified = Boolean(payload?.isVerified);
  const role = payload?.role;

  const LOGIN = `/${locale}/login`;

  const protectedRoots = [
    `/${locale}/brand`,
    `/${locale}/influencer`,
    `/${locale}/agency`,
  ];
  const isProtectedArea = protectedRoots.some((p) => pathname.startsWith(p));

  const isAuthPage =
    pathname.startsWith(`/${locale}/login`) ||
    pathname.startsWith(`/${locale}/signup`);

  // A) No token -> block protected areas
  if (!isAuthed && isProtectedArea) {
    const res = NextResponse.redirect(new URL(LOGIN, req.url));
    res.headers.set("x-current-path", currentPath);
    return res;
  }

  // If token exists but role missing -> go login
  if (isAuthed && !role) {
    const res = NextResponse.redirect(new URL(LOGIN, req.url));
    res.headers.set("x-current-path", currentPath);
    return res;
  }

  const root = role ? roleRoot[role] : null;
  const DASHBOARD = root ? `/${locale}/${root}/dashboard` : LOGIN;
  const UNVERIFIED = root ? `/${locale}/brand/unverified` : LOGIN;
  const ACCOUNT_SETTINGS = root
    ? `/${locale}/${root}/account-settings`
    : LOGIN;

  // B) Unverified -> allow only /unverified and /account-settings (+ nested)
  if (isAuthed && root && !isVerified) {
    const isAllowed =
      pathname === UNVERIFIED || pathname.startsWith(ACCOUNT_SETTINGS);

    if (!isAllowed) {
      const res = NextResponse.redirect(new URL(UNVERIFIED, req.url));
      res.headers.set("x-current-path", currentPath);
      return res;
    }

    return intlRes;
  }

  // C) Verified -> block login/signup
  if (isAuthed && isVerified && isAuthPage) {
    const res = NextResponse.redirect(new URL(DASHBOARD, req.url));
    res.headers.set("x-current-path", currentPath);
    return res;
  }

  // D) Role route enforcement
  if (isAuthed && root) {
    const correctRootPrefix = `/${locale}/${root}`;
    if (isProtectedArea && !pathname.startsWith(correctRootPrefix)) {
      const res = NextResponse.redirect(new URL(DASHBOARD, req.url));
      res.headers.set("x-current-path", currentPath);
      return res;
    }
  }

  // E) Verified user shouldn't stay on /unverified
  if (isAuthed && isVerified && root && pathname === UNVERIFIED) {
    const res = NextResponse.redirect(new URL(DASHBOARD, req.url));
    res.headers.set("x-current-path", currentPath);
    return res;
  }

  return intlRes;
}

export const config = {
  matcher: [
    // Exclude Next.js internals + services + any file with extension
    "/((?!service|trpc|_next|_vercel|.*\\..*).*)",
  ],
};

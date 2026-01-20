// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { decodeJwtPayload, UserRole } from "@/helpers/helper";

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
});

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

export default function middleware(req: NextRequest) {
  const intlRes = intlMiddleware(req);

  const { pathname } = req.nextUrl;
  const locale = getLocaleFromPath(pathname);

  const token = req.cookies.get("access_token")?.value || "";
  const payload = token ? decodeJwtPayload(token) : null;

  const isAuthed = Boolean(token && payload && !isExpired(payload.exp));
  const isVerified = Boolean(payload?.isVerified);
  const role = payload?.role;

  const LOGIN = `/${locale}/login`;

  // Protected roots:
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
    return NextResponse.redirect(new URL(LOGIN, req.url));
  }

  // If token exists but role missing -> go login
  if (isAuthed && !role) {
    return NextResponse.redirect(new URL(LOGIN, req.url));
  }

  // Compute role paths
  const root = role ? roleRoot[role] : null;
  const DASHBOARD = root ? `/${locale}/${root}/dashboard` : LOGIN;
  const UNVERIFIED = root ? `/${locale}/${root}/unverified` : LOGIN;

  // allow these pages even when unverified
  const ACCOUNT_SETTINGS = root ? `/${locale}/${root}/account-settings` : LOGIN;

  // B) Unverified -> allow only /unverified and /account-settings (+ nested)
  if (isAuthed && root && !isVerified) {
    const isAllowed =
      pathname === UNVERIFIED || pathname.startsWith(ACCOUNT_SETTINGS);

    if (!isAllowed) {
      return NextResponse.redirect(new URL(UNVERIFIED, req.url));
    }

    return intlRes;
  }

  // C) Verified -> block login/signup
  if (isAuthed && isVerified && isAuthPage) {
    return NextResponse.redirect(new URL(DASHBOARD, req.url));
  }

  // D) Role route enforcement (agency token can't open /brand/* etc.)
  if (isAuthed && root) {
    const correctRootPrefix = `/${locale}/${root}`;
    if (isProtectedArea && !pathname.startsWith(correctRootPrefix)) {
      return NextResponse.redirect(new URL(DASHBOARD, req.url));
    }
  }

  // E) Verified user shouldn't stay on /unverified
  if (isAuthed && isVerified && root && pathname === UNVERIFIED) {
    return NextResponse.redirect(new URL(DASHBOARD, req.url));
  }

  return intlRes;
}

// export const config = {
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// // Combined middleware
// export default async function middleware(request: NextRequest) {
//   // 1️⃣ Run your custom header logic
//   const headers = new Headers(request.headers);
//   headers.set("x-current-path", request.nextUrl.pathname);

//   // 2️⃣ Run the next-intl middleware
//   const response = await intlMiddleware(request);

//   // 3️⃣ Merge the headers into the response
//   response.headers.set("x-current-path", request.nextUrl.pathname);

//   return response;
// }

// // Combined matcher: covers both your original paths and next-intl
// export const config = {
//   matcher:
//     "/((?!api|trpc|_next|_vercel|_next/static|_next/image|favicon.ico|.*\\..*).*)",
// };

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

function getLocaleFromPath(pathname: string) {
  const seg = pathname.split("/")[1];
  return routing.locales.includes(seg as any) ? seg : routing.defaultLocale;
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
  const protectedRoots = [`/${locale}/brand`, `/${locale}/influencer`, `/${locale}/agency`];
  const isProtectedArea = protectedRoots.some((p) => pathname.startsWith(p));

  const isAuthPage =
    pathname.startsWith(`/${locale}/login`) || pathname.startsWith(`/${locale}/signup`);

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

  // B) Unverified -> force /{root}/unverified
  if (isAuthed && !isVerified) {
    if (pathname !== UNVERIFIED) {
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

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

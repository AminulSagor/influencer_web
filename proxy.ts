// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// export default createMiddleware({
//   locales: routing.locales,
//   defaultLocale: routing.defaultLocale,
// });

// export const config = {
//   // Match all pathnames except for
//   // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
//   // - … the ones containing a dot (e.g. `favicon.ico`)
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
});

// Combined middleware
export default async function middleware(request: NextRequest) {
  // 1️⃣ Run your custom header logic
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);

  // 2️⃣ Run the next-intl middleware
  const response = await intlMiddleware(request);

  // 3️⃣ Merge the headers into the response
  response.headers.set("x-current-path", request.nextUrl.pathname);

  return response;
}

// Combined matcher: covers both your original paths and next-intl
export const config = {
  matcher:
    "/((?!api|trpc|_next|_vercel|_next/static|_next/image|favicon.ico|.*\\..*).*)",
};

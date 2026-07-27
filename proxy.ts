import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/app/lib/seo";

const COOKIE_NAME = "NEXT_LOCALE";

function detectLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && (LOCALES as string[]).includes(cookieLocale)) return cookieLocale;

  // Spanish is the primary market and therefore the first-visit language.
  // Browser language must not override it; only a language explicitly chosen
  // through the site's switcher (and persisted in NEXT_LOCALE) may do so.
  return DEFAULT_LOCALE;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(COOKIE_NAME, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};

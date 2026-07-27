import { notFound } from "next/navigation";
import type { Locale } from "@/app/translations";

export const SITE_URL = "https://levelpro.es";
export const LOCALES: Locale[] = ["en", "de", "es"];
export const DEFAULT_LOCALE: Locale = "es";

// Shared across the site — no dedicated per-page OG photography exists yet,
// and AVIF (used for every other image on the site) isn't reliably rendered
// as an og:image preview by Facebook/X, so this falls back to a real JPG
// already served from the production domain.
export const DEFAULT_OG_IMAGE = "https://levelpro.es/wp-content/uploads/2026/05/3.jpg";

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function assertValidLocale(value: string): asserts value is Locale {
  if (!isValidLocale(value)) notFound();
}

export function absoluteUrl(locale: Locale, pathSuffix = ""): string {
  return `${SITE_URL}/${locale}${pathSuffix}`;
}

export function localizedAlternates(locale: Locale, pathSuffix = "") {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = absoluteUrl(l, pathSuffix);
  languages["x-default"] = absoluteUrl(DEFAULT_LOCALE, pathSuffix);
  return {
    canonical: absoluteUrl(locale, pathSuffix),
    languages,
  };
}

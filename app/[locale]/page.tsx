import type { Metadata } from "next";
import { TRANSLATIONS } from "@/app/translations";
import { assertValidLocale, localizedAlternates, DEFAULT_OG_IMAGE } from "@/app/lib/seo";
import HomeClient from "./HomeClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertValidLocale(locale);
  const t = TRANSLATIONS[locale];
  const title = `${t.hero.titleLine1} ${t.hero.titleLine2}`.trim();
  const description = t.hero.tagline;
  const alternates = localizedAlternates(locale, "");

  return {
    // The root layout's title.template lives in this same route segment
    // (app/[locale]/layout.tsx + app/[locale]/page.tsx), and per the Metadata
    // API a layout's template does not apply to a page in its own segment —
    // only to child segments — so the suffix is composed explicitly here.
    title: `${title} | Level Pro`,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: "Level Pro",
      locale,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  assertValidLocale(locale);
  return <HomeClient locale={locale} />;
}

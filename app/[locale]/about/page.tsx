import type { Metadata } from "next";
import { TRANSLATIONS } from "@/app/translations";
import { assertValidLocale, localizedAlternates, DEFAULT_OG_IMAGE } from "@/app/lib/seo";
import AboutClient from "./AboutClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertValidLocale(locale);
  const t = TRANSLATIONS[locale];
  const title = `${t.aboutPage.hero.headingLine1} ${t.aboutPage.hero.headingLine2}`.trim();
  const description = t.aboutPage.hero.tagline;
  const alternates = localizedAlternates(locale, "/about");

  return {
    title,
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  assertValidLocale(locale);
  return <AboutClient locale={locale} />;
}

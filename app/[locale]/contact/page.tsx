import type { Metadata } from "next";
import { TRANSLATIONS } from "@/app/translations";
import { assertValidLocale, localizedAlternates, DEFAULT_OG_IMAGE } from "@/app/lib/seo";
import ContactClient from "./ContactClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertValidLocale(locale);
  const t = TRANSLATIONS[locale];
  const h = t.contactPage.hero;
  const title = [h.headingLine1, h.headingLine2, h.headingLine3].filter(Boolean).join(" ");
  const description = h.tagline;
  const alternates = localizedAlternates(locale, "/contact");

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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  assertValidLocale(locale);
  return <ContactClient locale={locale} />;
}

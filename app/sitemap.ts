import type { MetadataRoute } from "next";
import { LOCALES, absoluteUrl } from "./lib/seo";

const PAGES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/equipment", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(l, path)])),
      },
    }))
  );
}

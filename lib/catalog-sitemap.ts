import type { MetadataRoute } from "next";
import { LOCALES, SITE_URL, TLocale } from "./site";

type Item = { path: string; lang: string; updated_at?: string };
type Catalog = { published: Item[]; unpublished: Item[] };

export async function catalogSitemap(
  courses: (lang: TLocale) => Promise<Catalog>,
  chapters: (course: string, lang: TLocale) => Promise<Item[]>,
): Promise<MetadataRoute.Sitemap> {
  const paths = new Map<string, Map<TLocale, string | undefined>>();
  function add(path: string, lang: TLocale, updated?: string) {
    const editions = paths.get(path) ?? new Map<TLocale, string | undefined>();
    editions.set(lang, updated);
    paths.set(path, editions);
  }

  for (const lang of LOCALES) {
    add("", lang);
    add("/course", lang);
    const catalog = await courses(lang);
    for (const course of [...catalog.published, ...catalog.unpublished]) {
      const path = "/course/" + encodeURIComponent(course.path);
      if (course.lang === lang) add(path, lang, course.updated_at);
      for (const chapter of await chapters(course.path, lang)) {
        if (chapter.lang === lang) {
          add(path + "/" + encodeURIComponent(chapter.path), lang, chapter.updated_at);
        }
      }
    }
  }

  return Array.from(paths).flatMap(([path, editions]) => {
    const languages = Object.fromEntries(Array.from(editions.keys(), lang =>
      [lang, SITE_URL + "/" + lang + path]));
    return Array.from(editions, ([lang, updated]) => ({
      url: languages[lang],
      // The API exposes SQL timestamps without a time zone. Use the calendar date.
      lastModified: updated?.match(/^\d{4}-\d{2}-\d{2}/)?.[0],
      alternates: { languages },
    }));
  });
}

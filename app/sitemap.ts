import type { MetadataRoute } from "next";
import { getChaptersByPath } from "@/features/course/api/use-chapters-api";
import { getCourses } from "@/features/course/api/use-courses-api";
import { LOCALES, SITE_URL } from "@/lib/site";

// Generated at request time from the live course catalog (never at build).
export const dynamic = "force-dynamic";

const entry = (
  path: string,
  options: Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority">
): MetadataRoute.Sitemap =>
  LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: new Date(),
    ...options,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])
      ),
    },
  }));

const staticEntries = (): MetadataRoute.Sitemap => [
  ...entry("", { changeFrequency: "daily", priority: 1 }),
  ...entry("/course", { changeFrequency: "daily", priority: 0.9 }),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = staticEntries();

  try {
    const coursesRes = await getCourses();
    const courses = [
      ...(coursesRes.data?.published ?? []),
      ...(coursesRes.data?.unpublished ?? []),
    ];

    for (const course of courses) {
      entries.push(
        ...entry(`/course/${course.path}`, {
          changeFrequency: "weekly",
          priority: 0.8,
        })
      );
    }

    // Chapter URLs, per course; a course whose chapter fetch fails is skipped.
    const chapterLists = await Promise.allSettled(
      courses.map(async (course) => ({
        course,
        chapters: (await getChaptersByPath(course.path)).data?.list ?? [],
      }))
    );

    for (const result of chapterLists) {
      if (result.status !== "fulfilled") continue;
      const { course, chapters } = result.value;

      for (const chapter of chapters) {
        entries.push(
          ...entry(`/course/${course.path}/${chapter.path}`, {
            changeFrequency: "monthly",
            priority: 0.7,
          })
        );
      }
    }
  } catch (error) {
    // API down: still serve the static routes instead of a 500.
    console.warn("sitemap: falling back to static routes:", error);
    return staticEntries();
  }

  return entries;
}

import "server-only";
import axios from "axios";
import { notFound, redirect } from "next/navigation";
import { LOCALES } from "@/lib/site";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { TResponse } from "@/lib/request";
import type { TChapterDetail } from "./use-chapters-api";
import type { TCourse } from "./use-courses-api";
import { pageContent } from "./page-content";

export type EditionParams = { lang: string; coursename: string; chaptername: string };
type PublicCourse = Pick<TCourse, "lang" | "path" | "title" | "description" | "cover" | "status">;
type PublicChapter = Pick<TChapterDetail, "lang" | "title" | "content" | "study_time" | "updated_at" | "author" | "content_url">;

// Only the anonymous public API is eligible for this shared cache. Cache successes
// so publishing a new edition is never held up by a cached not-found response.
async function edition<T extends { lang: string }>(path: string, lang: string): Promise<T> {
  const { data } = await axios.get<TResponse<T>>(path, {
    baseURL: process.env.NEXT_PUBLIC_API_URL, params: { lang }, timeout: 10000,
  });
  return pageContent(data, lang);
}

const course = unstable_cache(edition<PublicCourse>, ["public-course-edition"], { revalidate: 60 });
const chapter = unstable_cache(edition<PublicChapter>, ["public-chapter-edition"], { revalidate: 60 });

export const loadEdition = cache(async (courseName: string, chapterName: string, lang: string) => {
  const courseSlug = encodeURIComponent(courseName);
  const chapterSlug = encodeURIComponent(chapterName);
  const path = `/course/${courseSlug}/${chapterSlug}`;
  const [courseData, chapterData] = await Promise.all([
    course(`/public/course/${courseSlug}`, lang),
    chapter(`/public/course/${courseSlug}/chapter/${chapterSlug}`, lang),
  ]);
  if (!LOCALES.some(locale => locale === chapterData.lang)) notFound();
  return { course: courseData, chapter: chapterData, path };
});


export async function localizedEdition(params: EditionParams, suffix = "") {
  const edition = await loadEdition(params.coursename, params.chaptername, params.lang);
  if (edition.chapter.lang !== params.lang) {
    redirect(`/${edition.chapter.lang}${edition.path}${suffix}`);
  }
  return edition;
}

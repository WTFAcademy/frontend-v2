import "server-only";
import { unstable_cache } from "next/cache";
import type { TCourse } from "./use-courses-api";
import type { TChapter } from "./use-chapters-api";
import type { TResponse } from "@/lib/request";

// This loader deliberately does not use the API client that forwards session cookies.
async function fetchPublic<T>(
  base: string,
  path: string,
  language: string
): Promise<T> {
  const response = await fetch(base + path, {
    headers: { Language: language },
    cache: "no-store",
  });
  if (!response.ok) throw Error("Could not load public course content");
  const result: TResponse<T> = await response.json();
  if (result.code !== 0 || !result.data)
    throw Error(result.msg || "Course content unavailable");
  return result.data;
}

export const publicCourse = unstable_cache(
  (base: string, course: string, lang: string) =>
    fetchPublic<TCourse>(base, "/course/" + encodeURIComponent(course), lang),
  ["public-course-overview"],
  { revalidate: 60 }
);
export const publicOutline = unstable_cache(
  async (base: string, course: string, lang: string) =>
    (
      await fetchPublic<{ list: TChapter[] }>(
        base,
        "/course/" + encodeURIComponent(course) + "/chapters",
        lang
      )
    ).list,
  ["public-chapter-outline"],
  { revalidate: 60 }
);

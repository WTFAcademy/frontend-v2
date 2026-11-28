"use client";

import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import useAuth from "@/features/auth/hooks/use-auth";
import { getCourseDetailByPath, TCourse } from "./use-courses-api";
import { getChapterByPath, getChaptersByPath } from "./use-chapters-api";
import type { TResponse } from "@/lib/request";

export type ReaderCourse = Pick<TCourse, "path" | "title" | "status">;

function dataOf<T>({ code, data, msg }: TResponse<T>) {
  if (code !== 0 || !data) throw Error(msg || "Course content unavailable");
  return data;
}

export function useReader(coursePath: string) {
  const { lang } = useParams<{ lang: string }>();
  const { readerSession } = useAuth();
  return useMemo(() => {
    const scope = [lang, coursePath, readerSession];
    const staleTime = 60_000;
    return {
      lang,
      course: queryOptions({
        queryKey: ["reader-course", lang, coursePath],
        staleTime,
        queryFn: async (): Promise<ReaderCourse> => {
          const { path, title, status } = dataOf(
            await getCourseDetailByPath(coursePath, lang)
          );
          return { path, title, status };
        },
      }),
      list: queryOptions({
        queryKey: ["chapters", ...scope],
        staleTime,
        queryFn: async () =>
          dataOf(await getChaptersByPath(coursePath, lang)).list,
      }),
      chapter: (path: string) =>
        queryOptions({
          queryKey: ["chapter", ...scope, path],
          staleTime,
          queryFn: async () =>
            dataOf(await getChapterByPath(coursePath, path, lang)),
        }),
    };
  }, [lang, coursePath, readerSession]);
}

// Warm only the likely destination, or a chapter the reader points to.
export function useWarmChapter(coursePath: string, likely?: string) {
  const reader = useReader(coursePath);
  const client = useQueryClient();
  const router = useRouter();
  const warm = useCallback(
    (path: string) => {
      const connection = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      if (
        document.hidden ||
        connection?.saveData ||
        /2g/.test(connection?.effectiveType || "")
      )
        return;
      router.prefetch(`/${reader.lang}/course/${coursePath}/${path}`);
      void client.prefetchQuery(reader.chapter(path));
    },
    [reader, coursePath, client, router]
  );
  useEffect(() => {
    if (likely) warm(likely);
  }, [likely, warm]);
  return warm;
}

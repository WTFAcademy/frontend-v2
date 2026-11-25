import { notFound, redirect } from "next/navigation";
import { LOCALES } from "@/lib/site";
import type { TResponse } from "@/lib/request";

// The existing v1 API reports missing and non-public resources in its JSON envelope.
const unavailable = new Set([
  "Course not found", "Chapter not found",
  "Course is under construction", "Chapter is under construction",
]);

export function pageContent<T extends { lang: string }>(
  result: TResponse<T>, locale: string, path?: string,
): T {
  if (result.code !== 0) {
    if (unavailable.has(result.msg)) notFound();
    throw new Error("Course service returned an error");
  }
  if (!result.data?.lang) throw new Error("Missing content language");
  if (path && result.data.lang !== locale) {
    if (!LOCALES.some(lang => lang === result.data.lang)) notFound();
    redirect("/" + result.data.lang + path);
  }
  return result.data;
}

import "server-only";

import { cache } from "react";
import { getCourseDetailByPath, getCourses } from "./use-courses-api";
import { getChapterByPath, getChaptersByPath } from "./use-chapters-api";

/**
 * React cache()-wrapped fetchers for server components / generateMetadata:
 * within one request, generateMetadata and the page body (and any nested RSC)
 * share a single API call per unique argument list.
 */
export const getCachedCourses = cache(getCourses);
export const getCachedCourseDetail = cache(getCourseDetailByPath);
export const getCachedChapter = cache(getChapterByPath);
export const getCachedChapters = cache(getChaptersByPath);

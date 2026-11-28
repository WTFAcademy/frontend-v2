import React, { cache, Suspense } from "react";
import CourseDetailCard from "@/features/course/components/course-detail-card";
import ChapterList from "@/features/course/components/chapter-list";
import CourseDetailCardSkeleton from "@/features/course/components/skeletons/course-detail-card-skeleton";
import ChapterListSkeleton from "@/features/course/components/skeletons/chapter-list-skeleton";
import { Metadata } from "next";
import { getCourseDetailByPath } from "@/features/course/api/use-courses-api";

import { cookies } from "next/headers";
import { LOCAL_STORAGE_TOKEN_KEY } from "@/features/auth/constants";
import {
  publicCourse,
  publicOutline,
} from "@/features/course/api/public-outline.server";
const apiBase = process.env.NEXT_PUBLIC_API_URL!;
const signedIn = () => !!cookies().get(LOCAL_STORAGE_TOKEN_KEY)?.value;
const loadCourse = cache(async (path: string, lang: string) => {
  if (!signedIn()) return publicCourse(apiBase, path, lang);
  const result = await getCourseDetailByPath(path, lang);
  if (result.code !== 0 || !result.data)
    throw Error(result.msg || "Course unavailable");
  return result.data;
});

export async function generateMetadata({
  params,
}: {
  params: { lang: string; coursename: string; chaptername: string };
}): Promise<Metadata> {
  const course = await loadCourse(params.coursename, params.lang);

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [
        {
          url: course.cover || "/images/course-placeholder.jpg",
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
      images: [course.cover || "/images/course-placeholder.jpg"],
    },
  };
}

const CourseDetailPage = async ({
  params,
}: {
  params: { lang: string; coursename: string };
}) => {
  const [course, initialChapters] = await Promise.all([
    loadCourse(params.coursename, params.lang),
    signedIn()
      ? undefined
      : publicOutline(apiBase, params.coursename, params.lang),
  ]);

  return (
    <div className="flex-1 flex md:flex-row flex-col border-b-[0.5px] border-wtf-border-divider bg-wtf-background-primary">
      <div className="md:w-[480px] w-full px-4 py-10 md:p-10 border-r-[0.5px] border-wtf-border-divider">
        <Suspense fallback={<CourseDetailCardSkeleton />}>
          <CourseDetailCard course={course} />
        </Suspense>
      </div>
      <div className="md:flex-auto flex flex-col px-4 py-10 md:p-10 gap-6">
        <Suspense fallback={<ChapterListSkeleton />}>
          <ChapterList
            initialChapters={initialChapters}
            coursePath={params.coursename}
            course={course}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default CourseDetailPage;

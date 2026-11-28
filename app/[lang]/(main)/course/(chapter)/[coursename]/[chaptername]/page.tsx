"use client";

import {
  getChapterByPath,
  TChapterDetail,
} from "@/features/course/api/use-chapters-api";
import { getCourseDetailByPath } from "@/features/course/api/use-courses-api";
import ChapterDetailFooter from "@/features/course/components/chapter-detail-footer";
import ChapterDetailHeader from "@/features/course/components/chapter-detail-header";
import ChapterMobileNav from "@/features/course/components/chapter-mobile-nav";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";
import Markdown from "@/features/mdx/components/markdown";
import { TResponse } from "@/lib/request";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

const CourseChapterPage = ({
  params,
}: {
  params: { lang: string; coursename: string; chaptername: string };
}) => {
  const { scrollRef } = useMobileReaderInteraction();

  const { data: courseData } = useSuspenseQuery({
    queryKey: ["course", params.coursename],
    queryFn: () => getCourseDetailByPath(params.coursename),
  });

  const { data } = useSuspenseQuery({
    queryKey: ["chapter", params.lang, params.coursename, params.chaptername],
    queryFn: () =>
      getChapterByPath(params.coursename, params.chaptername).catch((err) => {
        console.log(err);
        return {} as TResponse<TChapterDetail>;
      }),
  });

  const chapter = data.data;
  const course = courseData.data;

  if (!chapter) {
    return (
      <div className="relative h-full w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image src="/svgs/empty.svg" alt="empty" width={120} height={167} />
        </div>
      </div>
    );
  }

  const quizCount =
    course.status === "published" && chapter.status === "published"
      ? chapter.quiz_questions
      : 0;
  return (
    <div className="relative flex-auto overflow-y-auto pt-20" ref={scrollRef}>
      <ChapterMobileNav course={course} chapterPath={params.chaptername} />
      <div className="px-4 py-6 md:p-10">
        <ChapterDetailHeader
          title={chapter.title}
          studyTime={chapter.study_time}
          bestScore={chapter.progress}
        />
        {quizCount > 0 && (
          <Link
            className="mb-5 inline-flex rounded-full border border-wtf-border-outline px-4 py-2 text-sm font-semibold hover:bg-wtf-function-brandBg"
            href={`/${params.lang}/course/${params.coursename}/${params.chaptername}/quiz`}
          >
            {params.lang === "en"
              ? `Take the chapter quiz · ${quizCount} questions`
              : `参加章节测验 · ${quizCount} 题`}{" "}
            →
          </Link>
        )}
        <Markdown>{chapter.content}</Markdown>
      </div>
      <ChapterDetailFooter
        currentChapterPath={params.chaptername}
        coursePath={params.coursename}
        lang={params.lang}
        questions={quizCount}
      />
    </div>
  );
};

export default CourseChapterPage;

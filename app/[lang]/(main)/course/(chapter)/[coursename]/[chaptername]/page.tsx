"use client";

import { useReader, useWarmChapter } from "@/features/course/api/reader";
import ChapterDetailFooter from "@/features/course/components/chapter-detail-footer";
import ChapterDetailHeader from "@/features/course/components/chapter-detail-header";
import ChapterMobileNav from "@/features/course/components/chapter-mobile-nav";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";
import Markdown from "@/features/mdx/components/markdown";

import { useQuery, useSuspenseQueries } from "@tanstack/react-query";

import Link from "next/link";

const CourseChapterPage = ({
  params,
}: {
  params: { lang: string; coursename: string; chaptername: string };
}) => {
  const { scrollRef } = useMobileReaderInteraction();

  const reader = useReader(params.coursename);
  const { data: chapters = [] } = useQuery(reader.list);
  const [{ data: course }, { data: chapter }] = useSuspenseQueries({
    queries: [reader.course, reader.chapter(params.chaptername)],
  });
  const current = chapters.findIndex((ch) => ch.path === params.chaptername);
  useWarmChapter(
    params.coursename,
    current >= 0 ? chapters[current + 1]?.path : undefined
  );
  const quizCount =
    course.status === "published" && chapter.status === "published"
      ? chapter.quiz_questions
      : 0;
  return (
    <div className="relative flex-auto overflow-y-auto pt-20" ref={scrollRef}>
      <ChapterMobileNav
        chapters={chapters}
        lang={params.lang}
        course={course}
        chapterPath={params.chaptername}
      />
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
        chapters={chapters}
        currentChapterPath={params.chaptername}
        coursePath={params.coursename}
        lang={params.lang}
        questions={quizCount}
      />
    </div>
  );
};

export default CourseChapterPage;

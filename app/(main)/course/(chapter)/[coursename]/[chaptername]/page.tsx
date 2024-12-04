"use client";

import { getChapterByPath } from "@/features/course/api/use-chapters-api";
import ChapterDetailFooter from "@/features/course/components/chapter-detail-footer";
import ChapterDetailHeader from "@/features/course/components/chapter-detail-header";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";
import Markdown from "@/features/mdx/components/markdown";
import { useSuspenseQuery } from "@tanstack/react-query";

const CourseChapterPage = ({
  params,
}: {
  params: { coursename: string; chaptername: string };
}) => {
  const { scrollRef } = useMobileReaderInteraction();

  const { data } = useSuspenseQuery({
    queryKey: ["chapter", params.coursename, params.chaptername],
    queryFn: () => getChapterByPath(params.coursename, params.chaptername),
  });

  const chapter = data.data;

  return (
    <div className="relative flex-auto overflow-y-auto pt-20" ref={scrollRef}>
      <div className="px-4 py-6 md:p-10">
        <ChapterDetailHeader
          title={chapter.title}
          studyTime={chapter.study_time}
          bestScore={chapter.score}
        />
        <Markdown>{chapter.content}</Markdown>
      </div>
      <ChapterDetailFooter
        currentChapterPath={params.chaptername}
        coursePath={params.coursename}
      />
    </div>
  );
};

export default CourseChapterPage;

"use client";

import { ReactNode } from "react";
import { TCourse } from "../api/use-courses-api";
import ChapterDetailFooter from "./chapter-detail-footer";
import ChapterDetailHeader from "./chapter-detail-header";
import ChapterMobileNav from "./chapter-mobile-nav";
import { useMobileReaderInteraction } from "../hooks/use-mobile-reader-interaction";

/**
 * Client shell around the (server-rendered) chapter markdown: owns the scroll
 * container ref for the mobile reader interactions plus the nav/header/footer
 * islands. The markdown arrives fully rendered via `children`.
 */
const ChapterReader = ({
  course,
  coursePath,
  chapterPath,
  chapterTitle,
  studyTime,
  bestScore,
  children,
}: {
  course: TCourse;
  coursePath: string;
  chapterPath: string;
  chapterTitle: string;
  studyTime: number;
  bestScore: number;
  children: ReactNode;
}) => {
  const { scrollRef } = useMobileReaderInteraction();

  return (
    <div className="relative flex-auto overflow-y-auto pt-20" ref={scrollRef}>
      <ChapterMobileNav course={course} chapterPath={chapterPath} />
      <div className="px-4 py-6 md:p-10">
        <ChapterDetailHeader
          title={chapterTitle}
          studyTime={studyTime}
          bestScore={bestScore}
        />
        {children}
      </div>
      <ChapterDetailFooter
        currentChapterPath={chapterPath}
        coursePath={coursePath}
        isPublished={course.status === "published"}
      />
    </div>
  );
};

export default ChapterReader;

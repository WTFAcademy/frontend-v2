"use client";

import ChapterDetailFooter from "@/features/course/components/chapter-detail-footer";
import ChapterDetailHeader from "@/features/course/components/chapter-detail-header";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";

const CourseChapterPage = ({
  params,
}: {
  params: { coursename: string; chaptername: string };
}) => {
  console.log(params);
  const { containerRef, scrollRef } =
    useMobileReaderInteraction();

  return (
    <div className="relative flex-auto overflow-y-auto pt-20" ref={scrollRef}>
      <div className="p-10" ref={containerRef}>
        <ChapterDetailHeader
          title="WTF Solidity: 2. Value Type"
          studyTime={20}
          bestScore={100}
        />
        <div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
        </div>
      </div>
      <ChapterDetailFooter />
    </div>
  );
};

export default CourseChapterPage;

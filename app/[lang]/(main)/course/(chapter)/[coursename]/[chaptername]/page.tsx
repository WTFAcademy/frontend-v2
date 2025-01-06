"use client";

import { getChapterByPath, TChapterDetail } from "@/features/course/api/use-chapters-api";
import { getCourseDetailByPath } from "@/features/course/api/use-courses-api";
import ChapterDetailFooter from "@/features/course/components/chapter-detail-footer";
import ChapterDetailHeader from "@/features/course/components/chapter-detail-header";
import ChapterMobileNav from "@/features/course/components/chapter-mobile-nav";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";
import Markdown from "@/features/mdx/components/markdown";
import { TResponse } from "@/lib/request";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";

const CourseChapterPage = ({
  params,
}: {
  params: { coursename: string; chaptername: string };
}) => {
  const { scrollRef, isControlVisible } = useMobileReaderInteraction();

  useEffect(() => {
    const element = document.documentElement;
    
    const enterFullscreen = async () => {
      try {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
      } catch (error) {
        console.log('全屏模式可能不被支持', error);
      }
    };

    const exitFullscreen = async () => {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } catch (error) {
        console.log('退出全屏模式失败', error);
      }
    };

    if (isControlVisible) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isControlVisible]);

  const { data: courseData } = useSuspenseQuery({
    queryKey: ["course", params.coursename],
    queryFn: () => getCourseDetailByPath(params.coursename),
  });

  const { data } = useSuspenseQuery({
    queryKey: ["chapter", params.coursename, params.chaptername],
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

  return (
    <div className="relative flex-auto overflow-y-auto pt-20" ref={scrollRef}>
      <ChapterMobileNav course={course} chapterPath={params.chaptername} />
      <div className="px-4 py-6 md:p-10">
        <ChapterDetailHeader
          title={chapter.title}
          studyTime={chapter.study_time}
          bestScore={chapter.progress}
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

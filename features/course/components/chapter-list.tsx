"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { getChaptersByPath } from "../api/use-chapters-api";
import { Icons } from "@/components/icons";
import Link from "next/link";

const ChapterProgressButton = ({
  progress,
  children,
  onClick,
}: {
  progress: number;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="relative border border-wtf-border-outline rounded-sm w-[80px] h-[34px] flex items-center justify-center overflow-hidden cursor-pointer"
    >
      {children}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-wtf-function-successBg">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-wtf-function-success"
        />
      </div>
    </div>
  );
};

const ChapterProgressStatus = ({
  progress,
  active,
}: {
  progress: number;
  active: boolean;
}) => {
  switch (progress) {
    case 0:
      return active ? (
        <div className="flex items-center gap-1 text-sm font-medium text-wtf-function-link">
          Start <Icons.arrowRight2 className="w-4 h-4 ml-2" />
        </div>
      ) : (
        <div className="text-wtf-content-4 font-medium text-sm relative z-10">
          Not Started
        </div>
      );
    case 1:
      return (
        <div className="text-wtf-function-success font-medium text-sm relative z-10 flex items-center">
          Completed
          <Icons.complete className="w-4 h-4 ml-1" />
        </div>
      );
    default:
      return (
        <div className="text-wtf-content-2 font-medium text-sm relative z-10">
          In Progress
        </div>
      );
  }
};

const ChapterList = ({ coursePath }: { coursePath: string }) => {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const { data: chapterData } = useSuspenseQuery({
    queryKey: ["chapters", coursePath],
    queryFn: async () => {
      const res = await getChaptersByPath(coursePath);
      return res?.data;
    },
  });

  const chapters = chapterData || [];

  const handleChapterClick = (chapterIndex: number) => {
    setSelectedChapter(chapterIndex);
    // 这里可以添加导航逻辑或其他处理
  };

  return (
    <div className="w-full">
      <h1 className="text-wtf-content-1 text-xl font-bold">
        Chapters <span>(15)</span>
      </h1>
      <div className="flex flex-col gap-1 mt-6">
        {chapters.map((chapter, index) => (
          <Link
            key={chapter.route_path}
            href={`/course/${coursePath}/${chapter.route_path}`}
          >
            <motion.div
              key={chapter.route_path}
              className="border-b-[0.5px] border-wtf-border-divider py-1"
              onHoverStart={() => setActiveChapter(index)}
              onHoverEnd={() => setActiveChapter(null)}
              onClick={() => handleChapterClick(index)}
            >
              <div
                className={`flex items-center justify-between py-4 relative cursor-pointer ${
                  selectedChapter === index ? "bg-wtf-background-selected" : ""
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="rounded-full w-[30px] h-[30px] text-wtf-function-link bg-wtf-function-brandBg flex items-center justify-center">
                    {chapter.sort}
                  </div>
                  <h2 className="text-wtf-content-1 text-base font-semibold">
                    {chapter.title}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <ChapterProgressButton
                      progress={chapter.quiz_progress}
                      onClick={() => handleChapterClick(index)}
                    >
                      <Icons.document className="w-4 h-4 text-wtf-content-3" />
                      <span className="text-wtf-content-2 text-sm font-medium ml-1">
                        Quiz
                      </span>
                    </ChapterProgressButton>
                    <ChapterProgressButton
                      progress={chapter.code_progress}
                      onClick={() => handleChapterClick(index)}
                    >
                      <Icons.code2 className="w-4 h-4 text-wtf-content-3" />
                      <span className="text-wtf-content-2 text-sm font-medium ml-1">
                        Code
                      </span>
                    </ChapterProgressButton>
                  </div>
                  <div className="w-[128px] flex justify-end">
                    <ChapterProgressStatus
                      progress={chapter.quiz_progress}
                      active={selectedChapter === index}
                    />
                  </div>
                </div>

                {activeChapter === index && (
                  <motion.div
                    layoutId="chapterHighlight"
                    className="absolute inset-0 rounded-lg bg-wtf-background-hover"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;

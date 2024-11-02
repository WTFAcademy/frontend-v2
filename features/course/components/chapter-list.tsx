"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const ChapterList = () => {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const handleChapterClick = (chapterIndex: number) => {
    setSelectedChapter(chapterIndex);
    // 这里可以添加导航逻辑或其他处理
  };

  return (
    <div className="w-full">
      <h1 className="text-wtf-content-1 text-xl font-bold">
        Chapters <span>(15)</span>
      </h1>
      <div className="flex flex-col gap-1">
        {[1, 2, 3].map((chapter, index) => (
          <motion.div
            key={chapter}
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
                  {chapter}
                </div>
                <h2 className="text-wtf-content-1 text-base font-semibold">
                  HelloWeb3
                </h2>
              </div>
              <div className="text-wtf-content-4 text-sm relative z-10">
                Not Started
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
        ))}
      </div>
    </div>
  );
};

export default ChapterList;

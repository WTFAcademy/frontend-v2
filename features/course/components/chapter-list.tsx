"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { getChaptersByPath } from "../api/use-chapters-api";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { useDictionary } from "@/features/lang";
import { cn } from "@/lib/utils";
import useAuth from "@/features/auth/hooks/use-auth";
import Image from "next/image";
import { isEmpty } from "lodash-es";
import { TCourse } from "../api/use-courses-api";
const ChapterProgressButton = ({
  progress,
  children,
  href,
}: {
  progress: number;
  children: React.ReactNode;
  onClick?: () => void;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="relative border border-wtf-border-outline rounded-sm w-[80px] h-[34px] flex items-center justify-center overflow-hidden cursor-pointer"
    >
      {children}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-wtf-function-successBg">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-wtf-function-success"
        />
      </div>
    </Link>
  );
};

const ChapterProgressStatus = ({
  progress,
  active,
}: {
  progress: number;
  active: boolean;
}) => {
  const t = useDictionary();
  switch (progress) {
    case 0:
      return active ? (
        <div className="flex items-center gap-1 text-sm font-medium text-wtf-function-link">
          {t.course.Start} <Icons.arrowRight2 className="w-4 h-4 ml-2" />
        </div>
      ) : (
        <div className="text-wtf-content-4 font-medium text-sm relative z-10">
          {t.course.Not_Started}
        </div>
      );
    case 100:
      return (
        <div className="text-wtf-function-success font-medium text-sm relative z-10 flex items-center">
          {t.course.Completed}
          <Icons.complete className="w-4 h-4 ml-1" />
        </div>
      );
    default:
      return (
        <div className="text-wtf-content-2 font-medium text-sm relative z-10">
          {t.course.In_Progress}
        </div>
      );
  }
};

const ChapterList = ({ coursePath, course }: { coursePath: string, course: TCourse }) => {
  const t = useDictionary();
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const { isLogin } = useAuth();

  const { data: chapterData } = useSuspenseQuery({
    queryKey: ["chapters", coursePath],
    queryFn: async () => {
      const res = await getChaptersByPath(coursePath);
      return res?.data;
    },
  });

  const chapters = chapterData?.list || [];
  const isPublished = course.status === "published";

  if (isEmpty(chapters)) {
    return (
      <div className="relative h-full w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image src="/svgs/empty.svg" alt="empty" width={120} height={167} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h1 className="text-wtf-content-1 text-xl font-bold">
        {t.course.Chapters} <span>({chapters.length})</span>
      </h1>
      <div className="flex flex-col gap-1 mt-6">
        {chapters.map((chapter, index) => (
          <Link
            key={chapter.path}
            href={`/course/${coursePath}/${chapter.path}`}
          >
            <motion.div
              className="border-b-[0.5px] border-wtf-border-divider py-1"
              onHoverStart={() => setActiveChapter(index)}
              onHoverEnd={() => setActiveChapter(null)}
              whileTap={{ scale: 0.995 }}
            >
              <motion.div
                className={`flex flex-col gap-y-2 md:flex-row md:items-center justify-between py-4 px-1 relative cursor-pointer`}
                animate={{
                  y: activeChapter === index ? 0 : 2,
                  scale: activeChapter === index ? 1 : 0.999,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="rounded-full w-[30px] h-[30px] text-wtf-function-link bg-wtf-function-brandBg flex items-center justify-center">
                    {chapter.sort}
                  </div>
                  <h2 className="text-wtf-content-1 text-base font-semibold">
                    {chapter.title}
                  </h2>
                </div>

                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-4 w-full ml-[46px]">
                    <div className={cn("flex items-center gap-3 flex-1")}>
                      {isLogin && isPublished && (
                        <>
                          <ChapterProgressButton
                            href={`/course/${coursePath}/${chapter.path}/quiz`}
                            progress={chapter.progress}
                          >
                            <Icons.document className="w-4 h-4 text-wtf-content-3" />
                            <span className="text-wtf-content-2 text-sm font-medium ml-1">
                              {t.course.Quiz}
                            </span>
                          </ChapterProgressButton>
                          {/* <ChapterProgressButton
                        href={`/course/${coursePath}/${chapter.path}/code`}
                        progress={chapter.code_progress}
                      >
                        <Icons.code2 className="w-4 h-4 text-wtf-content-3" />
                        <span className="text-wtf-content-2 text-sm font-medium ml-1">
                          {t.course.Code}
                        </span>
                      </ChapterProgressButton> */}
                        </>
                      )}
                    </div>
                    <div className="w-[128px] flex justify-end">
                      <ChapterProgressStatus
                        progress={chapter.progress}
                        active={false}
                      />
                    </div>
                  </div>

                  <motion.div
                    layoutId="chapterHighlight"
                    className="absolute inset-0 rounded-lg bg-wtf-background-hover pointer-events-none"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{
                      opacity: activeChapter === index ? 1 : 0,
                      scale: activeChapter === index ? 1 : 0.98,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                      opacity: { duration: 0.2 },
                      layout: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      },
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;

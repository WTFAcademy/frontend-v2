"use client";

import { Button } from "@/components/ui/button";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";
import { AnimatePresence, motion } from "framer-motion";
import type { TChapter } from "../api/use-chapters-api";

import { Icons } from "@/components/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { canPrefetchChapter } from "../api/reader";
import { useDictionary } from "@/features/lang";

import { cn } from "@/lib/utils";

const ChapterDetailFooter = ({
  chapters,
  currentChapterPath,
  coursePath,
  lang,
  questions,
}: {
  chapters: TChapter[];
  currentChapterPath: string;
  coursePath: string;
  lang: string;
  questions: number;
}) => {
  const t = useDictionary();
  const router = useRouter();
  const { isControlVisible } = useMobileReaderInteraction();

  const currentChapterIndex = chapters.findIndex(
    (chapter) => chapter.path === currentChapterPath
  );
  const nextChapterPath =
    currentChapterIndex >= 0
      ? chapters[currentChapterIndex + 1]?.path
      : undefined;
  const previousChapterPath = chapters[currentChapterIndex - 1]?.path;
  const nextHref = nextChapterPath
    ? `/${lang}/course/${coursePath}/${nextChapterPath}`
    : undefined;

  useEffect(() => {
    if (nextHref && canPrefetchChapter()) router.prefetch(nextHref);
  }, [nextHref, router]);

  return (
    <AnimatePresence>
      <motion.div
        className="sticky footer bottom-0 left-0 right-0 border-t-[0.5px] border-wtf-border-divider px-4 md:px-6 py-4 flex justify-between items-center"
        initial={{ y: 0 }}
        animate={{ y: isControlVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn("flex items-center gap-4")}>
          {questions > 0 && (
            <>
              <Button asChild>
                <Link
                  href={`/${lang}/course/${coursePath}/${currentChapterPath}/quiz`}
                >
                  <Icons.document className="w-4 h-4" />
                  <span className="ml-1">
                    {lang === "zh" ? "章节测验" : "Chapter quiz"} · {questions}
                  </span>
                  <Icons.arrowRight className="hidden md:block w-3 h-3 ml-2" />
                </Link>
              </Button>
            </>
          )}
        </div>
        <div className={cn("flex items-center")}>
          {previousChapterPath && (
            <Button variant="link" className="gap-2" asChild>
              <Link
                href={`/${lang}/course/${coursePath}/${previousChapterPath}`}
              >
                <Icons.arrowLeft className="w-4 h-4" />
                <span className="hidden md:block">{t.course.Previous}</span>
              </Link>
            </Button>
          )}
          {nextHref && (
            <Button variant="link" className="gap-2" asChild>
              <Link href={nextHref} prefetch={false} aria-label={t.course.Next}>
                <span className="hidden md:block">{t.course.Next}</span>
                <Icons.arrowRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChapterDetailFooter;

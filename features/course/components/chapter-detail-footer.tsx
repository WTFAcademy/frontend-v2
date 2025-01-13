"use client";

import { Button } from "@/components/ui/button";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { chapterListAtom } from "../atoms/chapter";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { useDictionary } from "@/features/lang";
import useAuth from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";

const ChapterDetailFooter = ({
  currentChapterPath,
  coursePath,
  isPublished,
}: {
  currentChapterPath: string;
  coursePath: string;
  isPublished: boolean;
}) => {
  const t = useDictionary();
  const { isControlVisible } = useMobileReaderInteraction();
  const chapters = useAtomValue(chapterListAtom);
  const { isLogin } = useAuth();

  const currentChapterIndex = chapters.findIndex(
    (chapter) => chapter.path === currentChapterPath
  );
  const nextChapterPath = chapters[currentChapterIndex + 1]?.path;
  const previousChapterPath = chapters[currentChapterIndex - 1]?.path;

  return (
    <AnimatePresence>
      <motion.div
        className="sticky footer bottom-0 left-0 right-0 border-t-[0.5px] border-wtf-border-divider px-4 md:px-6 py-4 flex justify-between items-center"
        initial={{ y: 0 }}
        animate={{ y: isControlVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn("flex items-center gap-4")}>
          {isLogin && isPublished && (
            <>
              <Button asChild>
                <Link href={`/course/${coursePath}/${currentChapterPath}/quiz`}>
                  <Icons.document className="w-4 h-4" />
                  <span className="hidden md:block ml-1">{t.course.Quiz}</span>
                  <Icons.arrowRight className="hidden md:block w-3 h-3 ml-2" />
                </Link>
              </Button>
              {/* <Button asChild>
                <Link href={`/course/${coursePath}/${currentChapterPath}/code`}>
                  <Icons.code2 className="w-4 h-4" />
                  <span className="hidden md:block ml-1">{t.course.Code}</span>
                  <Icons.arrowRight className="hidden md:block w-3 h-3 ml-2" />
                </Link>
              </Button> */}
            </>
          )}
        </div>
        <div className={cn("flex items-center")}>
          <Button
            variant="link"
            className="gap-2"
            asChild
            disabled={!previousChapterPath}
          >
            <Link
              aria-disabled={!previousChapterPath}
              href={`/course/${coursePath}/${previousChapterPath}`}
            >
              <Icons.arrowLeft className="w-4 h-4" />
              <span className="hidden md:block">{t.course.Previous}</span>
            </Link>
          </Button>
          <Button
            variant="link"
            className="gap-2"
            asChild
            disabled={!nextChapterPath}
          >
            <Link href={`/course/${coursePath}/${nextChapterPath}`}>
              <span className="hidden md:block">{t.course.Next}</span>
              <Icons.arrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChapterDetailFooter;

"use client";

import { Button } from "@/components/ui/button";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { chapterListAtom } from "../atoms/chapter";
import { Icons } from "@/components/icons";
import Link from "next/link";

const ChapterDetailFooter = ({
  currentChapterPath,
  coursePath,
}: {
  currentChapterPath: string;
  coursePath: string;
}) => {
  const { isControlVisible } = useMobileReaderInteraction();
  const chapters = useAtomValue(chapterListAtom);

  const currentChapterIndex = chapters.findIndex(
    (chapter) => chapter.route_path === currentChapterPath
  );
  const nextChapterPath = chapters[currentChapterIndex + 1]?.route_path;
  const previousChapterPath = chapters[currentChapterIndex - 1]?.route_path;

  return (
    <AnimatePresence>
      <motion.div
        className="sticky footer bottom-0 left-0 right-0 border-t-[0.5px] border-wtf-border-divider px-4 md:px-6 py-4 flex justify-between items-center"
        initial={{ y: 0 }}
        animate={{ y: isControlVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <Button>Quiz</Button>
          <Button>Code</Button>
        </div>
        <div className="flex items-center">
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
              <span className="hidden md:block">Previous</span>
            </Link>
          </Button>
          <Button
            variant="link"
            className="gap-2"
            asChild
            disabled={!nextChapterPath}
          >
            <Link
              href={`/course/${coursePath}/${nextChapterPath}`}
            >
              <span className="hidden md:block">Next</span>
              <Icons.arrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChapterDetailFooter;

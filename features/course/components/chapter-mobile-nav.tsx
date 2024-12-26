"use client";

import { Icons } from "@/components/icons";
import { TCourse } from "../api/use-courses-api";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { chapterListAtom } from "../atoms/chapter";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMobileReaderInteraction } from "../hooks/use-mobile-reader-interaction";

const ChapterMobileNav = ({
  course,
  chapterPath,
}: {
  course?: TCourse;
  chapterPath: string;
}) => {
  const [open, setOpen] = useState(false);
  const chapters = useAtomValue(chapterListAtom);
  const pathname = usePathname();
  const router = useRouter();
  const { isControlVisible } = useMobileReaderInteraction();

  const currentChapter = chapters.find(
    (chapter) => chapter.path === chapterPath
  );
  const coursePath = course?.path;

  const handleOpen = () => {
    setOpen(true);
  };

  const isActive = (routePath: string) => {
    return routePath === pathname.split("/").pop();
  };

  return (
    <>
      <div
        className={cn(
          "md:hidden flex gap-3 px-4 mt-3 sticky z-10",
          isControlVisible ? "-top-0" : "-top-10"
        )}
      >
        <div className="w-10 h-10 inline-flex items-center justify-center bg-gray-100/50 dark:bg-gray-900/50 rounded shadow-sm backdrop-blur-[20px]">
          <Icons.arrowLeft
            className="w-4 h-4 cursor-pointer"
            onClick={() => router.push(`/course/${coursePath}`)}
          />
        </div>
        <div
          className="flex-1 h-10 px-3 flex gap-2 items-center bg-gray-100/50 dark:bg-gray-900/50 rounded shadow-sm backdrop-blur-[20px]"
          onClick={handleOpen}
        >
          <Icons.menu className="text-wtf-content-1 w-5 h-5" />
          <div className="h-[18px] w-[1px] bg-wtf-border-line" />
          <div className="w-full flex items-center justify-between">
            <span className="text-sm">
              {currentChapter?.sort}. {currentChapter?.title}
            </span>
            <Icons.arrowDown className="w-4 h-4 text-wtf-content-1" />
          </div>
        </div>
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="pt-6 px-5">
            <div className="w-full flex items-center justify-between">
              <div className="text-xl font-bold">{course?.title}</div>
              <Icons.close
                className="w-6 h-6 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
          </DrawerHeader>
          <ScrollArea className="flex-auto flex flex-col overflow-y-auto max-h-[500px]">
            {chapters.map((chapter, index) => (
              <Link
                key={chapter.path}
                href={`/course/${coursePath}/${chapter.path}`}
                className={cn(
                  "relative flex justify-between items-center px-6 py-[14px] hover:bg-wtf-background-block cursor-pointer",
                  isActive(chapter.path.split("/").pop() || "") &&
                    "bg-wtf-background-block"
                )}
              >
                {isActive(chapter.path.split("/").pop() || "") && (
                  <div className="absolute left-0 top-0 w-[6px] h-full bg-wtf-brand-1" />
                )}
                <div>
                  {index + 1}. {chapter.title}
                </div>
                {chapter.quiz_progress === 1 ? (
                  <Icons.documentFinished className="w-6 h-6 text-wtf-function-success" />
                ) : chapter.quiz_progress === 0 ? (
                  <Icons.documentUnread className="w-6 h-6 text-wtf-border-divider" />
                ) : (
                  <Icons.documentPending className="w-6 h-6 text-wtf-brand-1" />
                )}
              </Link>
            ))}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChapterMobileNav;

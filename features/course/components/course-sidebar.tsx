"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSuspenseQueries } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useReader, useWarmChapter } from "../api/reader";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/features/lang";

const CourseSidebar = ({ coursePath }: { coursePath: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useDictionary();

  const reader = useReader(coursePath);
  const [{ data: course }, { data: chapters }] = useSuspenseQueries({
    queries: [reader.course, reader.list],
  });
  const warm = useWarmChapter(coursePath);

  const isActive = (routePath: string) => {
    return routePath === pathname.split("/").pop();
  };

  const handleBack = () => {
    router.push(`/${reader.lang}/course/${coursePath}`);
  };

  return (
    <div className="w-[320px] 4xl:w-[400px] h-full overflow-hidden flex flex-col border-r-[0.5px] border-wtf-border-divider">
      <div className="flex flex-col h-full">
        <div className="px-6 pt-4">
          <Button variant="outline" onClick={() => handleBack()}>
            <Icons.arrowLeft className="w-4 h-4" />
            <span>{t.course.Back}</span>
          </Button>
        </div>
        <h1 className="px-6 pt-6 pb-4 text-wtf-content-1 text-2xl font-bold">
          {course.title}
        </h1>

        <ScrollArea className="flex-auto flex flex-col overflow-y-auto">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.path}
              prefetch={false}
              onMouseEnter={() => warm(chapter.path)}
              onFocus={() => warm(chapter.path)}
              href={`/${reader.lang}/course/${coursePath}/${chapter.path}`}
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
              {chapter.progress === 100 ? (
                <Icons.documentFinished className="w-6 h-6 text-wtf-function-success" />
              ) : chapter.progress === 0 ? (
                <Icons.documentUnread className="w-6 h-6 text-wtf-border-divider" />
              ) : (
                <Icons.documentPending className="w-6 h-6 text-wtf-brand-1" />
              )}
            </Link>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default CourseSidebar;

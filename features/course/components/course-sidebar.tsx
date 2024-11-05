"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { getChaptersByPath } from "../api/use-chapters-api";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CourseSidebar = ({
  coursePath,
}: {
  coursePath: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data } = useSuspenseQuery({
    queryKey: ["chapters", coursePath],
    queryFn: () => getChaptersByPath(coursePath),
  });
  const chapters = data?.data || [];

  const isActive = (routePath: string) => {
    return routePath === pathname.split("/").pop();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-[320px] h-full overflow-hidden flex flex-col border-r-[0.5px] border-wtf-border-divider">
      <div className="flex flex-col h-full">
        <div className="px-6 pb-6 pt-4 h-[73px]">
          <Button variant="outline" onClick={() => handleBack()}>
            <Icons.arrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        <ScrollArea className="flex-auto flex flex-col overflow-y-auto">
          {chapters.map((chapter) => (
            <Link
              key={chapter.route_path}
              href={`/course/${coursePath}/${chapter.route_path}`}
              className={cn(
                "relative flex justify-between items-center px-6 py-[14px] hover:bg-wtf-background-block",
                isActive(chapter.route_path.split("/").pop() || "") &&
                  "bg-wtf-background-block"
              )}
            >
              {isActive(chapter.route_path.split("/").pop() || "") && (
                <div className="absolute left-0 top-0 w-[6px] h-full bg-wtf-brand-1" />
              )}
              <div>{chapter.title}</div>
              {chapter.quiz_progress === 1 ? (
                <Icons.documentFinished className="w-6 h-6 text-green-500" />
              ) : (
                <Icons.documentFinished className="w-6 h-6 text-wtf-content-4" />
              )}
              {chapter.quiz_progress === 0 && (
                <Icons.book className="w-6 h-6 text-wtf-content-4" />
              )}
            </Link>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default CourseSidebar;

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";

const CourseSidebarSkeleton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="hidden md:flex w-[320px] h-full overflow-hidden flex-col border-r-[0.5px] border-wtf-border-divider pt-20">
      <div className="flex flex-col h-full">
        <div className="px-6 pb-6 pt-4 h-[73px]">
          <Button variant="outline" onClick={() => handleBack()}>
            <Icons.arrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        <ScrollArea className="flex-auto flex flex-col overflow-y-auto">
          {/* 生成5个章节项目的骨架 */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-6 py-[14px]"
            >
              <Skeleton className="h-5 w-32" /> {/* 章节标题骨架 */}
              <Skeleton className="h-6 w-6" /> {/* 图标骨架 */}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default CourseSidebarSkeleton;

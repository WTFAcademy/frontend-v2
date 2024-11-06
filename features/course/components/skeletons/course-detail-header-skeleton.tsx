import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CourseDetailHeaderSkeleton = () => {
  // 创建3个分组作为加载状态展示
  const groups = [1, 2, 3];
  
  return (
    <div className="w-full relative px-8 py-4 border-b-[0.5px] border-wtf-border-divider">
      <div className="w-full flex gap-x-5 px-2 py-1">
        {groups.map((group, index) => (
          <React.Fragment key={group}>
            <div key={group} className="flex flex-col flex-shrink-0">
              {/* 分组标题骨架 */}
              <Skeleton className="h-4 w-20" />
              
              {/* 课程卡片骨架 */}
              <div className="flex items-center mt-[6px] gap-x-3">
                {[1, 2, 3].map((course) => (
                  <Skeleton
                    key={course}
                    className="w-[108px] h-[72px] rounded-sm"
                  />
                ))}
              </div>
            </div>
            
            {/* 分隔线 */}
            {index < groups.length - 1 && (
              <div className="w-[1px] h-[96px] bg-wtf-border-divider flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CourseDetailHeaderSkeleton;
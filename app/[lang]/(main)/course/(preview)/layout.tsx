import CourseDetailHeader from "@/features/course/components/course-detail-header";
import CourseDetailHeaderSkeleton from "@/features/course/components/skeletons/course-detail-header-skeleton";
import { ReactNode, Suspense } from "react";

const CourseDetailLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full pt-20 flex flex-col bg-wtf-background-code">
      <Suspense fallback={<CourseDetailHeaderSkeleton />}>
        <CourseDetailHeader />
      </Suspense>
      {children}
    </div>
  );
};

export default CourseDetailLayout;

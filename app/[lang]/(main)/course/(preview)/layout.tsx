import CourseDetailHeader from "@/features/course/components/course-detail-header";
import CourseDetailHeaderSkeleton from "@/features/course/components/skeletons/course-detail-header-skeleton";
import { ReactNode, Suspense } from "react";

const CourseDetailLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full pt-20 bg-wtf-background-code">
      <div className="container min-h-screen flex flex-col">  
        <Suspense fallback={<CourseDetailHeaderSkeleton />}>
          <CourseDetailHeader />
        </Suspense>
        {children}
      </div>
    </div>
  );
};

export default CourseDetailLayout;

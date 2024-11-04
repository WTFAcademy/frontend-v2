import CourseSidebar from "@/features/course/components/course-sidebar";
import CourseSidebarSkeleton from "@/features/course/components/skeletons/course-sidebar-skeleton";
import { ReactNode, Suspense } from "react";

const CourseChapterLayout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: { coursename: string; chaptername: string };
}) => {
  return (
    <div className="flex pt-20 w-full h-screen">
      <Suspense fallback={<CourseSidebarSkeleton />}>
        <CourseSidebar coursePath={params.coursename} />
      </Suspense>
      {children}
    </div>
  );
};

export default CourseChapterLayout;

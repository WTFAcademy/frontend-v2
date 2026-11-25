import CourseSidebar from "@/features/course/components/course-sidebar";
import CourseSidebarSkeleton from "@/features/course/components/skeletons/course-sidebar-skeleton";
import { ReactNode, Suspense } from "react";

// NOTE: no hardcoded metadata here anymore — the chapter page's
// generateMetadata provides the real per-chapter title/description/OG tags.

const CourseChapterLayout = async ({
  children,
  params: routeParams,
}: {
  children: ReactNode;
  params: Promise<{ coursename: string }>;
}) => {
  const params = await routeParams;
  return (
    <div className="flex w-full h-screen md:mx-auto md:max-w-[1920px] overflow-hidden">
      <Suspense fallback={<CourseSidebarSkeleton />}>
        <div className="hidden md:block pt-20">
          <CourseSidebar coursePath={params.coursename} />
        </div>
      </Suspense>
      {children}
    </div>
  );
};

export default CourseChapterLayout;

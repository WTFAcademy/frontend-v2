import CourseSidebar from "@/features/course/components/course-sidebar";
import CourseSidebarSkeleton from "@/features/course/components/skeletons/course-sidebar-skeleton";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
  title: "WTF Solidity课程",
  description: "Learn Solidity step by step",
  openGraph: {
    title: "WTF Solidity课程",
    description: "Learn Solidity step by step",
    images: [
      {
        url: "/images/course-placeholder.jpg", // 你的OG图片URL
        width: 1200,
        height: 630,
        alt: "WTF Solidity课程",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WTF Solidity课程",
    description: "Learn Solidity step by step",
    images: ["/images/course-placeholder.jpg"], // 你的Twitter卡片图片URL
  },
};

const CourseChapterLayout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: { coursename: string };
}) => {
  return (
    <div className="flex w-full h-screen">
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

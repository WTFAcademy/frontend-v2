import React, { Suspense } from "react";
import CourseDetailCard from "@/features/course/components/course-detail-card";
import ChapterList from "@/features/course/components/chapter-list";
import CourseDetailCardSkeleton from "@/features/course/components/skeletons/course-detail-card-skeleton";
import ChapterListSkeleton from "@/features/course/components/skeletons/chapter-list-skeleton";
import { Metadata } from "next";
import { getCourseDetailByPath, TCourse } from "@/features/course/api/use-courses-api";

export async function generateMetadata({
  params,
}: {
  params: { coursename: string; chaptername: string };
}): Promise<Metadata> {
  const courseData = await getCourseDetailByPath(params.coursename);
  const course = courseData.data || {} as TCourse;

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [
        {
          url: course.cover || "/images/course-placeholder.jpg",
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
      images: [course.cover || "/images/course-placeholder.jpg"],
    },
  };
}

const CourseDetailPage = ({ params }: { params: { coursename: string } }) => {
  return (
    <div className="flex md:flex-row flex-col border-b-[0.5px] border-wtf-border-divider bg-wtf-background-primary">
      <div className="md:w-[480px] w-full px-4 py-10 md:p-10 border-r-[0.5px] border-wtf-border-divider">
        <Suspense fallback={<CourseDetailCardSkeleton />}>
          <CourseDetailCard coursePath={params.coursename} />
        </Suspense>
      </div>
      <div className="md:flex-auto flex flex-col px-4 py-10 md:p-10 gap-6">
        <Suspense fallback={<ChapterListSkeleton />}>
          <ChapterList coursePath={params.coursename} />
        </Suspense>
      </div>
    </div>
  );
};

export default CourseDetailPage;

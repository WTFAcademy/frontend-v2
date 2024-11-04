import React, { Suspense } from "react";
import CourseDetailCard from "@/features/course/components/course-detail-card";
import ChapterList from "@/features/course/components/chapter-list";
import CourseDetailCardSkeleton from "@/features/course/components/skeletons/course-detail-card-skeleton";
import ChapterListSkeleton from "@/features/course/components/skeletons/chapter-list-skeleton";

const CourseDetailPage = ({ params }: { params: { coursename: string } }) => {
  return (
    <div className="flex md:flex-row flex-col border-b-[0.5px] border-wtf-border-divider">
      <div className="md:w-[480px] w-full p-10 border-r-[0.5px] border-wtf-border-divider">
        <Suspense fallback={<CourseDetailCardSkeleton />}>
          <CourseDetailCard coursePath={params.coursename} />
        </Suspense>
      </div>
      <div className="md:flex-auto flex flex-col p-10 gap-6">
        <Suspense fallback={<ChapterListSkeleton />}>
          <ChapterList coursePath={params.coursename} />
        </Suspense>
      </div>
    </div>
  );
};

export default CourseDetailPage;

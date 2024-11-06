import { getCourseDetailByPath } from "@/features/course/api/use-courses-api";
import CourseDetailHeader from "@/features/course/components/course-detail-header";
import CourseDetailHeaderSkeleton from "@/features/course/components/skeletons/course-detail-header-skeleton";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

export async function generateMetadata(
  { params }: { params: { coursename: string; chaptername: string } }
): Promise<Metadata> {
  const courseData = await getCourseDetailByPath(params.coursename)
  const course = courseData.data

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [
        {
          url: course.cover_img || '/images/course-placeholder.jpg',
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description,
      images: [course.cover_img || '/images/course-placeholder.jpg'],
    },
  }
}

const CourseDetailLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full pt-20 flex flex-col">
      <Suspense fallback={<CourseDetailHeaderSkeleton />}>
        <CourseDetailHeader />
      </Suspense>
      {children}
    </div>
  );
};

export default CourseDetailLayout;

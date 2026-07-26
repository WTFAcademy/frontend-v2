import {
  getCachedChapter,
  getCachedCourseDetail,
} from "@/features/course/api/server";
import { TChapterDetail } from "@/features/course/api/use-chapters-api";
import { TCourse } from "@/features/course/api/use-courses-api";
import ChapterReader from "@/features/course/components/chapter-reader";
import MarkdownServer from "@/features/mdx/components/markdown-server";
import { markdownExcerpt } from "@/features/mdx/utils";
import { localeAlternates } from "@/lib/site";
import { TResponse } from "@/lib/request";
import { Metadata } from "next";
import Image from "next/image";

// Chapter content/progress must stay request-fresh (and builds must not need
// a live API), so this route is always rendered on demand.
export const dynamic = "force-dynamic";

type TParams = { lang: string; coursename: string; chaptername: string };

// Mirrors the old client behavior: a failed chapter fetch renders the empty
// state instead of the error boundary.
const getChapterSafe = (coursename: string, chaptername: string) =>
  getCachedChapter(coursename, chaptername).catch((err) => {
    console.log(err);
    return {} as TResponse<TChapterDetail>;
  });

export async function generateMetadata({
  params,
}: {
  params: TParams;
}): Promise<Metadata> {
  const [courseData, chapterData] = await Promise.all([
    getCachedCourseDetail(params.coursename).catch(
      () => ({}) as TResponse<TCourse>
    ),
    getChapterSafe(params.coursename, params.chaptername),
  ]);

  const course = courseData.data;
  const chapter = chapterData.data;

  if (!chapter) return {};

  const title = course?.title
    ? `${chapter.title} - ${course.title}`
    : chapter.title;
  const description =
    markdownExcerpt(chapter.content) || course?.description || "";
  const path = `/course/${params.coursename}/${params.chaptername}`;
  const image = course?.cover || "/images/course-placeholder.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.lang}${path}`,
      ...localeAlternates(path),
    },
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const CourseChapterPage = async ({ params }: { params: TParams }) => {
  // Course + chapter fetched in parallel; cache() dedupes with generateMetadata.
  const [courseData, chapterData] = await Promise.all([
    getCachedCourseDetail(params.coursename),
    getChapterSafe(params.coursename, params.chaptername),
  ]);

  const chapter = chapterData.data;
  const course = courseData.data;

  if (!chapter) {
    return (
      <div className="relative h-full w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image src="/svgs/empty.svg" alt="empty" width={120} height={167} />
        </div>
      </div>
    );
  }

  return (
    <ChapterReader
      course={course}
      coursePath={params.coursename}
      chapterPath={params.chaptername}
      chapterTitle={chapter.title}
      studyTime={chapter.study_time}
      bestScore={chapter.progress}
    >
      <MarkdownServer>{chapter.content}</MarkdownServer>
    </ChapterReader>
  );
};

export default CourseChapterPage;

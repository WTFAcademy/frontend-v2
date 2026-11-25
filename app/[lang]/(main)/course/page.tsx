import { getDictionary } from "@/app/[lang]/dictionaries";
import { getCachedCourses } from "@/features/course/api/server";
import CourseCenter, {
  TCourseCenterData,
} from "@/features/course/components/course-center";
import { localeAlternates } from "@/lib/site";
import { Metadata } from "next";

// Always rendered on demand: keeps the list request-fresh and lets
// `pnpm build` succeed without a live API.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params: routeParams,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await routeParams;
  const t = await getDictionary(params.lang);
  const title = t.course.Courses;
  const description =
    t.course.Courses_specially_designed_by_developers_for_developers;

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.lang}/course`,
      ...localeAlternates("/course"),
    },
    openGraph: {
      title,
      description,
      images: ["/images/course-center-banner.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/course-center-banner.jpg"],
    },
  };
}

const CoursePage = async () => {
  let initialCourses: TCourseCenterData | undefined;

  try {
    const res = await getCachedCourses();
    if (res.code === 0) {
      initialCourses = res.data;
    }
  } catch (error) {
    // Client falls back to fetching (and toasting) exactly like before.
    console.warn("Failed to fetch courses on the server:", error);
  }

  return <CourseCenter initialCourses={initialCourses} />;
};

export default CoursePage;

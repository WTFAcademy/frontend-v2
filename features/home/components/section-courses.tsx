import NumberTag from "@/components/number-tag";
import SectionHeader from "./section-header";
import CourseDisplayCard from "@/features/course/components/course-display-card";
import { Skeleton as SkeletonUI } from "@/components/ui/skeleton";
import { getCourses, TCourse } from "@/features/course/api/use-courses-api";
import { get } from "lodash-es";
import { headers } from "next/headers";
import { getDictionary } from "@/app/[lang]/dictionaries";

// TODO: header
const SectionCourses = async () => {
  const heads = headers()
  const lang = heads.get('x-current-lang')
  const t = await getDictionary(lang)

  const data = await getCourses();

  const popularCourses = get(data, "data.published", []);
  const upcomingCourses = get(data, "data.unpublished", []);

  return (
    <section className="container w-full flex flex-col">
      <SectionHeader
        title={t.index.Courses}
        description={t.index.Courses_specially_designed_by_developers_for_developers}
        moreUrl="/course"
      />
      <div className="w-full flex flex-col">
        <div className="flex items-center gap-x-3 px-8 mb-[-0.5px] md:px-10 py-9 border-wtf-border-divider border-[0.5px] border-solid">
          <span className="text-2xl font-bold leading-8">{t.index.Popular_Courses}</span>
          <NumberTag number={popularCourses.length} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5 border-wtf-border-divider border-x-[0.5px]">
          {popularCourses.map((course: TCourse) => (
            <CourseDisplayCard
              key={course.path}
              title={course.title}
              description={course.description}
              keywords={course.category}
              image={course.cover}
              path={course.path}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="flex items-center gap-x-3 px-8 my-[-0.5px] md:px-10 py-9 border-wtf-border-divider border-[0.5px] border-solid">
          <span className="text-2xl font-bold leading-8">
            {t.index.Upcoming_Courses}
          </span>
          <NumberTag number={upcomingCourses.length} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5 border-wtf-border-divider border-x-[0.5px]">
          {upcomingCourses.map((course) => (
            <CourseDisplayCard
              key={course.path}
              title={course.title}
              description={course.description}
              keywords={course.category}
              image={course.cover}
              path={course.path}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Skeleton = () => {
  return (
    <section className="container w-full flex flex-col">
      <SectionHeader
        title="Courses"
        description="Courses specially designed by developers for developers"
        moreUrl="/course"
      />
      <div className="w-full flex flex-col">
        <div className="flex items-center gap-x-3 px-8 mb-[-0.5px] md:px-10 py-9 border-wtf-border-divider border-[0.5px] border-solid">
          <span className="text-2xl font-bold leading-8">Popular Courses</span>
          <SkeletonUI className="w-6 h-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5 border-wtf-border-divider border-x-[0.5px]">
          <CourseDisplayCard.Skeleton />
          <CourseDisplayCard.Skeleton />
          <CourseDisplayCard.Skeleton />
          <CourseDisplayCard.Skeleton />
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="flex items-center gap-x-3 px-8 my-[-0.5px] md:px-10 py-9 border-wtf-border-divider border-[0.5px] border-solid">
          <span className="text-2xl font-bold leading-8">
            Upcomming Courses
          </span>
          <SkeletonUI className="w-6 h-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5 border-wtf-border-divider border-x-[0.5px]">
          <CourseDisplayCard.Skeleton />
          <CourseDisplayCard.Skeleton />
          <CourseDisplayCard.Skeleton />
          <CourseDisplayCard.Skeleton />
        </div>
      </div>
    </section>
  );
};

SectionCourses.Skeleton = Skeleton;

export default SectionCourses;

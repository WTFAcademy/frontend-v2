import NumberTag from "@/components/number-tag";
import SectionHeader from "./section-header";
import CourseDisplayCard from "@/features/course/components/CourseDisplayCard";

const SectionCourses = () => {
  return (
    <section className="w-full flex flex-col">
      <SectionHeader
        title="Courses"
        description="Courses specially designed by developers for developers"
        moreUrl="/courses"
      />
      <div className="w-full flex flex-col">
        <div className="flex items-center gap-x-3 px-8 md:px-10 4xl:px-20 py-9 border-wtf-border-divider border-[0.5px] border-solid">
          <span className="text-2xl font-bold leading-8">Popular Courses</span>
          <NumberTag number={2} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5">
          <CourseDisplayCard
            title="Solidity 101"
            description="Learn Solidity Basics Learn Solidity Basics Learn Solidity Basics"
            keywords="react, javascript, frontend"
            image="/images/solidity101.jpg"
          />
          <CourseDisplayCard
            title="Solidity 101"
            description="Learn Solidity Basics Learn Solidity Basics Learn Solidity Basics"
            keywords="react, javascript, frontend"
            image="/images/solidity101.jpg"
          />
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="flex items-center gap-x-3 px-8 md:px-10 4xl:px-20 py-9 border-wtf-border-divider border-[0.5px] border-solid">
          <span className="text-2xl font-bold leading-8">Upcomming Courses</span>
          <NumberTag number={108} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5">
          <CourseDisplayCard
            title="Solidity 101"
            description="Learn Solidity Basics Learn Solidity Basics Learn Solidity Basics"
            keywords="react, javascript, frontend"
            image="/images/solidity101.jpg"
          />
          <CourseDisplayCard
            title="Solidity 101"
            description="Learn Solidity Basics Learn Solidity Basics Learn Solidity Basics"
            keywords="react, javascript, frontend"
            image="/images/solidity101.jpg"
          />
          <CourseDisplayCard
            title="Solidity 101"
            description="Learn Solidity Basics Learn Solidity Basics Learn Solidity Basics"
            keywords="react, javascript, frontend"
            image="/images/course-placeholder.jpg"
          />
          <CourseDisplayCard
            title="Solidity 101"
            description="Learn Solidity Basics Learn Solidity Basics Learn Solidity Basics"
            keywords="react, javascript, frontend"
            image="/images/course-placeholder.jpg"
          />
          <CourseDisplayCard
            title="Solidity 101"
            description="Learn Solidity Basics Learn Solidity Basics Learn Solidity Basics"
            keywords="react, javascript, frontend"
            image="/images/course-placeholder.jpg"
          />
          <CourseDisplayCard
            title="Solidity 101"
            description="Learn Solidity Basics Learn Solidity Basics Learn Solidity Basics"
            keywords="react, javascript, frontend"
            image="/images/course-placeholder.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default SectionCourses;

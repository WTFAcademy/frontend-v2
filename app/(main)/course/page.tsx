"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "@/components/layout/footer";
import NumberTag from "@/components/number-tag";
import CourseDisplayCard from "@/features/course/components/CourseDisplayCard";

const CoursePage = () => {
  const typeList = ["All", "Solidity", "Ethers", "EVM", "Layer 2", "Frontend", "zk", "AI", "Basecamp"];

  const [currentType, setCurrentType] = useState<string | null>(typeList && typeList[0]);

  const selectCourseType = (type: string) => {
    setCurrentType(type);
  };

  return (
    <>
      <div id="course" className="w-full h-full flex flex-col">
        <div className="relative flex flex-col items-center px-4 pt-[120px] pb-9 md:px-10 md:pt-[140px] md:pb-10">
          <div className="absolute w-full h-full inset-0 hidden md:block">
              <Image
                  src="/images/course-center-banner.jpg"
                  alt="Coures Center Hero"
                  fill
                  className="absolute w-full h-full object-cover"
              />
              <div className="absolute w-full h-full inset-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[-26.57%] via-[rgba(255,255,255,0)] via-0% to-white to-100% dark:from-[rgba(18,18,18,0)] dark:via-[rgba(18,18,18,0)]  dark:to-[rgba(18,18,18,1)]"></div>
          </div>
          <div className="relative mb-10 flex flex-col max-w-[760px]">
              <span className="relative inline-flex px-4 py-2.5 h-8 mb-3 text-white font-bold bg-[#135BFB] rounded-full uppercase items-center justify-center text-center w-auto mx-auto">Courses</span>
              <p className="relative text-[28px] leading-[36px] text-center font-bold md:text-4xl md:leading-[48px]">Courses specially designed by developers for developers</p>
          </div>
          <div className="relative w-full p-[5px] bg-wtf-border-line rounded-[6px] md:w-auto">
            <div className="flex w-full overflow-x-auto">
              {typeList.map((type, index) => (
                <div
                  key={index}
                  className={`relative px-4 py-1.5 text-base leading-[20px] text-wtf-content-2 font-medium rounded-[3px] cursor-pointer whitespace-nowrap ${currentType === type ? 'bg-white text-[#121212]' : ''}`}
                  onClick={() => selectCourseType(type)}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
        <section className="container w-full flex flex-col">
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-x-3 px-8 mb-[-0.5px] md:px-10 py-9 border-wtf-border-divider border-[0.5px] border-solid">
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
            <div className="flex items-center gap-x-3 px-8 my-[-0.5px] md:px-10 py-9 border-wtf-border-divider border-[0.5px] border-solid">
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
      </div>
      <Footer />
    </>
  );
};

export default CoursePage;

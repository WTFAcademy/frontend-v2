"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/layout/footer";
import NumberTag from "@/components/number-tag";
import CourseDisplayCard from "@/features/course/components/course-display-card";
import { Skeleton as SkeletonUI } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getCourses, TCourse } from "@/features/course/api/use-courses-api";
import { get } from "lodash-es";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useDictionary } from "@/features/lang";

const CoursePage = () => {
  const t = useDictionary();
  const typeList = ["All", "Solidity", "Ethers", "EVM", "Layer 2", "Frontend", "zk", "AI", "Basecamp"];

  const [currentType, setCurrentType] = useState<string | null>(typeList && typeList[0]);

  const [popularCourses, setPopularCourses] = useState<TCourse[]>([]);
  const [upcomingCourses, setUpcomingCourses] = useState<TCourse[]>([]);

  const { data, isLoading } = useQuery<Record<"published" | "unpublished", TCourse[]>>({
    queryKey: ["courses"],
    queryFn: async () => {
      const data = await getCourses();

      if (data.code === 200) {
        return data.data;
      } else {
        toast.error(data.msg);
        throw new Error(data.msg);
      }
    },
  });

  useEffect(() => {
    if (data) {
      setPopularCourses(get(data, "published", []));
      setUpcomingCourses(get(data, "unpublished", []));
    }
  }, [data]);
  
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
              <span className="relative inline-flex px-4 py-2.5 h-8 mb-3 text-white font-bold bg-[#135BFB] rounded-full uppercase items-center justify-center text-center w-auto mx-auto">{t.course.Courses}</span>
              <p className="relative text-[28px] leading-[36px] text-center font-bold md:text-4xl md:leading-[48px]">{t.course.Courses_specially_designed_by_developers_for_developers}</p>
          </div>
          <div className="relative w-full p-[5px] bg-wtf-border-line rounded-[6px] md:w-auto">
            <div className="flex w-full overflow-x-auto relative">
              {typeList.map((type, index) => (
                <motion.div
                  key={index}
                  className="relative"
                >
                  {currentType === type && (
                    <motion.div
                      layoutId="tabs"
                      className="absolute inset-0 bg-wtf-background-primary rounded-[3px]"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <div
                    className={`relative px-4 py-1.5 text-base leading-[20px] font-medium rounded-[3px] cursor-pointer whitespace-nowrap ${
                      currentType === type 
                        ? 'text-wtf-content-1 z-10' 
                        : 'text-wtf-content-2'
                    }`}
                    onClick={() => selectCourseType(type)}
                  >
                    {type}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <section className="container w-full flex flex-col">
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-x-3 px-8 mb-[-0.5px] md:px-10 py-9 border-wtf-border-divider border-[0.5px] border-solid">
              <span className="text-2xl font-bold leading-8">{t.course.Popular_Courses}</span>
              {
                isLoading ? <SkeletonUI className="w-6 h-6" /> : <NumberTag number={popularCourses.length} />
              }
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5">
              {isLoading ? 
              <>
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
              </> :
              popularCourses.map((course: TCourse) => (
                <CourseDisplayCard
                  key={course.path}
                  title={course.title}
                  description={course.description}
                  keywords={""}
                  image={course.cover_img}
                />
              ))}
            </div>
          </div>
          <div className="w-full flex flex-col">
            <div className="flex items-center gap-x-3 px-8 my-[-0.5px] md:px-10 py-9 border-wtf-border-divider border-[0.5px] border-solid">
              <span className="text-2xl font-bold leading-8">{t.course.Upcomming_Courses}</span>
              {
                isLoading ? <SkeletonUI className="w-6 h-6" /> : <NumberTag number={upcomingCourses.length} />
              }
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5">
              {isLoading ? 
              <>
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
                <CourseDisplayCard.Skeleton />
              </> :
              upcomingCourses.map((course: TCourse) => (
                <CourseDisplayCard
                  key={course.path}
                  title={course.title}
                  description={course.description}
                  keywords={""}
                  image={course.cover_img}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CoursePage;

"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getCourseDetailByPath } from "../api/use-courses-api";

type CourseDetailCardProps = {
  coursePath: string;
};

const CourseDetailCard = ({ coursePath }: CourseDetailCardProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ["course", coursePath],
    queryFn: () => getCourseDetailByPath(coursePath),
  });

  const course = data?.data || {};

  return (
    <div className="w-full">
      <div className="px-4 py-2 rounded-full border border-wtf-content-3 text-wtf-content-2 w-fit leading-none">
        {course.category}
      </div>
      <h1 className="text-wtf-content-1 text-4xl font-bold mt-3">
        {course.title}
      </h1>
      <p className="text-wtf-content-2 mt-3">{course.description}</p>
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="flex flex-col">
          <Icons.code className="w-6 h-6 text-wtf-brand-1" />
          <h3 className="mt-2 text-wtf-content-1 text-base font-medium">
            {course.category}
          </h3>
          <span className="mt-1 text-wtf-content-3 text-xs">Category</span>
        </div>
        <div className="flex flex-col">
          <Icons.level className="w-6 h-6 text-wtf-brand-1" />
          <h3 className="mt-2 text-wtf-content-1 text-base font-medium">
            {course.level}
          </h3>
          <span className="mt-1 text-wtf-content-3 text-xs">Difficulty</span>
        </div>
        <div className="flex flex-col">
          <Icons.date className="w-6 h-6 text-wtf-brand-1" />
          <h3 className="mt-2 text-wtf-content-1 text-base font-medium">
            30min
          </h3>
          <span className="mt-1 text-wtf-content-3 text-xs">Study Time</span>
        </div>
      </div>
      <div className="mt-10">
        <Button>Start Learning</Button>
      </div>
      <div
        id="course-certificate-background"
        className="mt-10 p-8 border border-wtf-border-line rounded-lg flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-wtf-content-1 text-base font-semibold">
            Course Certificate
          </h3>
          <p className="text-wtf-content-3 text-xs">
            Claim certificate NFT after you complete all the course exercises.
          </p>
        </div>
        <div className="w-[336px] h-[170px] p-2 bg-white dark:bg-wtf-black rounded-lg relative">
          <Image
            src="/images/course-placeholder.jpg"
            alt="course certificate"
            fill
            className="w-full h-full object-cover"
            // onError={(e) => {
            //   e.currentTarget.src = "/images/fallback-image.png"; // 设置一个后备图片
            // }}
          />
        </div>
        <Button className="bg-wtf-function-brandBg text-wtf-function-link w-fit">
          <Icons.star className="w-4 h-4 mr-2" />
          Claim NFT
        </Button>
      </div>
      <div className="flex flex-col gap-4 mt-10">
        <div className="flex items-center gap-2">
          <Icons.cooperation className="w-4 h-4 text-wtf-content-3" />
          <span className="text-wtf-content-3 text-sm">
            19,282 Builders Enrolled
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Icons.fillDate className="w-4 h-4 text-wtf-content-3" />
          <span className="text-wtf-content-3 text-sm">
            Last updated on <strong>Jun 25, 2024</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailCard;

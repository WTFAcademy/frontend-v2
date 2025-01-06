"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "@/components/image";
import { getCourseDetailByPath } from "../api/use-courses-api";
import { useDictionary } from "@/features/lang";
import dayjs from "dayjs";
import { isNil } from "lodash-es";
import { useLanguage } from "@/features/lang/hooks/use-language";
import Link from "next/link";

type CourseDetailCardProps = {
  coursePath: string;
};

const CourseDetailCard = ({ coursePath }: CourseDetailCardProps) => {
  const t = useDictionary();
  const { data } = useSuspenseQuery({
    queryKey: ["course", coursePath],
    queryFn: () => getCourseDetailByPath(coursePath),
  });
  const { language } = useLanguage();

  const course = data?.data || {};
  const isClaimed = course.claim_address

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
          <span className="mt-1 text-wtf-content-3 text-xs">
            {t.course.Category}
          </span>
        </div>
        <div className="flex flex-col">
          <Icons.level className="w-6 h-6 text-wtf-brand-1" />
          <h3 className="mt-2 text-wtf-content-1 text-base font-medium">
            {course.level}
          </h3>
          <span className="mt-1 text-wtf-content-3 text-xs">
            {t.course.Difficulty}
          </span>
        </div>
        <div className="flex flex-col">
          <Icons.date className="w-6 h-6 text-wtf-brand-1" />
          <h3 className="mt-2 text-wtf-content-1 text-base font-medium">
            {isNil(course.study_time) ? "-" : Number(course.study_time)}{" "}
            {t.course.minutes}
          </h3>
          <span className="mt-1 text-wtf-content-3 text-xs">
            {t.course.Study_Time}
          </span>
        </div>
      </div>
      {/* <div className="mt-10">
        <Button>{t.course.Start_Learning}</Button>
      </div> */}
      <div
        id="course-certificate-background"
        className="mt-10 p-8 border border-wtf-border-line rounded-lg flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-wtf-content-1 text-base font-semibold">
            {t.course.Course_Certificate}
          </h3>
          <p className="text-wtf-content-3 text-xs">
            {
              t.course
                .Claim_certificate_NFT_after_you_complete_all_the_course_exercises
            }
          </p>
        </div>
        <div className="w-[336px] h-[222px] p-2 bg-white dark:bg-wtf-black rounded-lg relative">
          <Image
            src={course.sbt_token?.url}
            alt="course certificate"
            fill
            className="w-full h-full object-cover"
          />
        </div>
        {course.progress === 100 && !isClaimed && (
          <Link href={`/course/${course.path}/sbt`}>
            <Button className="bg-wtf-function-brandBg text-wtf-function-link hover:text-white w-fit">
              <Icons.star className="w-4 h-4 mr-2" />
              {t.course.Claim_NFT}
            </Button>
          </Link>
        )}
        {isClaimed && (
          <Button variant="success" className="w-fit">
            <Icons.star className="w-4 h-4 mr-2" />
            {t.course.Claimed}
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-10">
        <div className="flex items-center gap-2">
          <Icons.cooperation className="w-4 h-4 text-wtf-content-3" />
          <span className="text-wtf-content-3 text-sm">
            {isNil(course.learners) ? "-" : course.learners}{" "}
            {t.course.Builders_Enrolled}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Icons.fillDate className="w-4 h-4 text-wtf-content-3" />
          <span className="text-wtf-content-3 text-sm">
            {t.course.Last_updated_on}{" "}
            <strong>
              {dayjs(course.updated_at).format(
                language === "zh" ? "YYYY-MM-DD" : "MMM DD, YYYY"
              )}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailCard;

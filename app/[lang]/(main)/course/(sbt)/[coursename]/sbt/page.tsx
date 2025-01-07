"use client";

import Image from "@/components/image";
import { getCourseDetailByPath, TCourse } from "@/features/course/api/use-courses-api";
import {
  claimAtom,
  courseAtom,
  courseIdAtom,
  donationAmountAtom,
} from "@/features/sbt/atoms";
import ClaimStepper from "@/features/sbt/components/claim-stepper";
import ClaimSuccess from "@/features/sbt/components/claim-success";
import Title from "@/features/sbt/components/title";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { get } from "lodash-es";
import { useEffect } from "react";
import { formatEther } from "viem";

const CourseSbtPage = ({ params }: { params: { coursename: string } }) => {
  const [isClaimed, setIsClaimed] = useAtom(claimAtom);
  const setCourseId = useSetAtom(courseIdAtom);
  const setDonationAmount = useSetAtom(donationAmountAtom);
  const setCourse = useSetAtom(courseAtom);

  const { data: course } = useSuspenseQuery({
    queryKey: ["course", params.coursename],
    queryFn: () => getCourseDetailByPath(params.coursename).catch(),
  });

  useEffect(() => {
    setIsClaimed(!!get(course, "data.claim_address", null));
    setCourseId(get(course, "data.id", null));
    setDonationAmount(
      Number(formatEther(BigInt(get(course, "data.claim_price", 0))))
    );
    setCourse(get(course, "data", {} as TCourse));
  }, [course]);

  if (course.code !== 0)
    return (
      <div className="flex flex-col text-center max-w-[1024px] mx-auto mt-[76px] px-4 py-6 md:px-10 md:py-7">
        Course not found
      </div>
    );

  return (
    <div className="flex flex-col max-w-[1024px] min-h-screen mx-auto pt-[56px] md:pt-[76px] px-4 md:px-10">
      <div className="mt-[58px] mb-[40px] md:mb-[60px]">
        <Title course={course.data} />
      </div>
      <div className="flex flex-col md:flex-row gap-10 md:min-h-[376px]">
        <div className="flex-1 bg-wtf-background-block rounded-2xl overflow-hidden flex flex-col justify-center items-center">
          <div className="relative h-[180px] w-[calc(100%-80px)]">
            <Image
              src={course.data.sbt_token?.url}
              alt={course.data.title}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-base text-center mt-6">NFT Certificate</span>
        </div>
        <div className="flex-1">
          {isClaimed ? <ClaimSuccess /> : <ClaimStepper />}
        </div>
      </div>
    </div>
  );
};

export default CourseSbtPage;

"use client";

import { Button } from "@/components/ui/button";
import { Balancer } from "react-wrap-balancer";

const ChapterDetailHeader = ({
  title,
  studyTime,
  bestScore,
}: {
  title: string;
  studyTime: number;
  bestScore: number;
}) => {
  return (
    <>
      <div className="text-wtf-content-1 text-4xl font-bold">
        <Balancer>{title}</Balancer>
      </div>
      <div className="my-4 flex items-center gap-4">
        <Button variant="secondary">Time: {studyTime} minutes</Button>
        <Button variant="secondary">Best Score: {bestScore}</Button>
      </div>
    </>
  );
};

export default ChapterDetailHeader;

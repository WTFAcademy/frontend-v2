"use client";

import { Button } from "@/components/ui/button";
import { Balancer } from "react-wrap-balancer";
import { useDictionary } from "@/features/lang";
import { isNil } from "lodash-es";

const ChapterDetailHeader = ({
  title,
  studyTime,
  bestScore,
}: {
  title: string;
  studyTime: number;
  bestScore: number;
}) => {
  const t = useDictionary();
  console.log(bestScore);
  
  return (
    <>
      <div className="text-wtf-content-1 text-4xl font-bold">
        <Balancer>{title}</Balancer>
      </div>
      <div className="my-4 flex items-center gap-4">
        <Button variant="secondary">{t.course.Time}: {isNil(studyTime) ? "-" : Number(studyTime)} {t.course.minutes}</Button>
        {bestScore > 0 && <Button variant="secondary">{t.course.Best_Score}: {bestScore}</Button>}
      </div>
    </>
  );
};

export default ChapterDetailHeader;

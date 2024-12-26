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
  return (
    <>
      <div className="text-wtf-content-1 text-4xl font-bold">
        <Balancer>{title}</Balancer>
      </div>
      <div className="my-4 flex items-center gap-4">
        <Button variant="secondary">{t.course.Time}: {studyTime} {t.course.minutes}</Button>
        {!isNil(bestScore) && <Button variant="secondary">{t.course.Best_Score}: {bestScore}</Button>}
      </div>
    </>
  );
};

export default ChapterDetailHeader;

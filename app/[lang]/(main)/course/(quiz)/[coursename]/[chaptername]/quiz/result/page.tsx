"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const QuizResultPage = ({
  params,
}: {
  params: { coursename: string; chaptername: string };
}) => {
  const searchParams = useSearchParams()
  const score = Number(searchParams.get("score"))
  const errorCnt = Number(searchParams.get("error_cnt"))

  const openConfetti = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    if (score === 100) {
      openConfetti();
    }
  }, [score]);

  const icon = score === 100 ? "🎉" : "🚧";
  const resultText =
    score === 100 ? (
      <span>Congratulations on passing this quiz.</span>
    ) : (
      <span>
        There are <span className="text-function-error font-bold">{errorCnt}</span> wrong
        answers.
      </span>
    );

  return (
    <div className="flex flex-col max-w-[840px] mx-auto mt-[76px] px-4 py-6 md:px-10 md:py-7">
      <div className="flex flex-col items-center">
        <div className="text-[64px] mb-4">{icon}</div>
        <div className="text-xl">{resultText}</div>
        <div className="flex flex-col items-center mt-10 gap-4">
          <div className="text-xl font-bold">The score is</div>
          <div
            className={cn(
              "text-[80px] font-bold px-8 py-3 rounded-xl border",
              score === 100
                ? "bg-wtf-function-successBg border-wtf-function-success text-wtf-function-success"
                : "bg-wtf-function-errorBg border-wtf-function-error text-wtf-function-error"
            )}
          >
            {score}
          </div>
        </div>
        <div className="flex gap-4 mt-12">
          {score !== 100 && (
            <Button variant="outline" asChild>
              <Link
                href={`/course/${params.coursename}/${params.chaptername}/quiz`}
              >
                Try again
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href={`/course/${params.coursename}/${params.chaptername}`}>
              Back to Tutorials
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;

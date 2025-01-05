"use client";

import { getQuizzes } from "@/features/quiz/api/use-quiz-api";
import QuizHeader from "@/features/quiz/components/quiz-header";
import QuizListForm from "@/features/quiz/components/quiz-list-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";

const QuizPage = ({
  params,
}: {
  params: { coursename: string; chaptername: string };
}) => {
  const { data } = useSuspenseQuery({
    queryKey: ["quiz", params.coursename, params.chaptername],
    queryFn: () => getQuizzes(params.coursename, params.chaptername),
    staleTime: 0,
    gcTime: 0,
  });

  if (!data || !data.data) {
    return (
      <div className="relative h-screen w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image src="/svgs/empty.svg" alt="empty" width={120} height={167} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-[840px] mx-auto mt-[76px] px-4 py-6 md:px-10 md:py-7">
      <QuizHeader quiz={data.data} />
      <QuizListForm quiz={data.data} />
    </div>
  );
};

export default QuizPage;

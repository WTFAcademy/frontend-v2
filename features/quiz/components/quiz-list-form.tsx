"use client";

import { useForm } from "react-hook-form";
import FormProvider from "./form/provider";
import { TAnswer } from "../types";
import RHFQuizItem from "./form/rhf-quiz-item";
import { Button } from "@/components/ui/button";
import { submitQuiz, TQuizResponse, TSubmitQuizBody } from "../api/use-quiz-api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/features/lang";

const QuizListForm = ({quiz}: {quiz: TQuizResponse}) => {
  const t = useDictionary();
  const methods = useForm<{ answers: TAnswer[] }>({
    defaultValues: {
      answers: [],
    },
  });
  const router = useRouter()
  const {mutateAsync: submitQuizRequest} = useMutation({
    mutationFn: (data: TSubmitQuizBody) => submitQuiz(data)
  })

  const onSubmit = async (data: any) => {
    const body = {
      course_id: quiz.simple_course.id,
      chapter_id: quiz.simple_chapter.id,
      answers: data.answers
    }

    const res = await submitQuizRequest(body)
    console.log(res.data);
    router.push(`/course/${quiz.simple_course.title}/${quiz.simple_chapter.title}/result?score=${res.data.score}&error_cnt=${res.data.error_cnt}`)
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="flex flex-col gap-6 mb-6">
        {quiz.exercise_list.map((item, index) => (
          <RHFQuizItem
            key={item.meta.id}
            exercise={item as any}
            control={methods.control}
            name={`answers.${index}`}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit">{t.quiz.Submit}</Button>
      </div>
    </FormProvider>
  );
};

export default QuizListForm;

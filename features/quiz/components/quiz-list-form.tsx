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
import { toast } from "sonner";

const QuizListForm = ({quiz}: {quiz: TQuizResponse}) => {
  const t = useDictionary();
  const methods = useForm<{ answers: TAnswer[] }>({
    defaultValues: {
      answers: [],
    },
  });
  const router = useRouter()
  const {mutateAsync: submitQuizRequest} = useMutation({
    mutationFn: async (data: TSubmitQuizBody) => {
      const res = await submitQuiz(quiz.course.id, quiz.chapter.id, quiz.id, data)
      console.log(res)
      if (res.code !== 0) {
        throw new Error(res.msg)
      }
      return res.data
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSubmit = async (data: any) => {
    const body = {
      answer: data.answers
    }

    const res = await submitQuizRequest(body)
    router.push(`/course/${quiz.course.path}/${quiz.chapter.path}/quiz/result?score=${res.progress}&error_cnt=${res.errors}`)
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="flex flex-col gap-6 mb-6">
        {quiz.list.map((item, index) => (
          <RHFQuizItem
            key={item.id}
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

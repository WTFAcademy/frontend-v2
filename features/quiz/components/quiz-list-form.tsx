"use client";

import { useForm } from "react-hook-form";
import FormProvider from "./form/provider";
import { TAnswer } from "../types";
import { quizData } from "../data";
import RHFQuizItem from "./form/rhf-quiz-item";
import { Button } from "@/components/ui/button";

const QuizListForm = () => {
  const methods = useForm<{ exercises: TAnswer[] }>({
    defaultValues: {
      exercises: [],
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="flex flex-col gap-6 mb-6">
        {quizData.map((item, index) => (
          <RHFQuizItem
            key={item.meta.id}
            exercise={item as any}
            control={methods.control}
            name={`exercises.${index}`}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit">提交</Button>
      </div>
    </FormProvider>
  );
};

export default QuizListForm;

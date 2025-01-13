"use client";

import { useForm } from "react-hook-form";
import FormProvider from "./form/provider";
import { TAnswer } from "../types";
import RHFQuizItem from "./form/rhf-quiz-item";
import { Button } from "@/components/ui/button";
import {
  submitQuiz,
  TQuizResponse,
  TSubmitQuizBody,
} from "../api/use-quiz-api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/features/lang";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

const QuizListForm = ({ quiz }: { quiz: TQuizResponse }) => {
  const t = useDictionary();
  const methods = useForm<{ answers: TAnswer[] }>({
    defaultValues: {
      answers: [],
    },
  });
  const router = useRouter();
  const { mutateAsync: submitQuizRequest, isPending } = useMutation({
    mutationFn: async (data: TSubmitQuizBody) => {
      const res = await submitQuiz(
        quiz.course.id,
        quiz.chapter.id,
        quiz.id,
        data
      );
      console.log(res);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      return res.data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { formState: { errors } } = methods;
  const [showTooltip, setShowTooltip] = useState(false);

  const onSubmit = async (data: any) => {
    console.log(data);
    
    const body = {
      answer: data.answers,
    };

    const res = await submitQuizRequest(body);
    router.push(
      `/course/${quiz.course.path}/${quiz.chapter.path}/quiz/result?score=${res.progress}&error_cnt=${res.errors}`
    );
  };

  useEffect(() => {
    const answerErrors = errors.answers;
    if (answerErrors && Array.isArray(answerErrors) && answerErrors.length > 0) {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errors?.answers]);

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
      <div className="flex flex-col items-end gap-2">
        <TooltipProvider>
          <Tooltip open={showTooltip}>
            <TooltipTrigger asChild>
              <Button 
                type="submit" 
                disabled={isPending}
                className={Object.keys(errors).length > 0 ? 'bg-destructive hover:bg-destructive/90' : ''}
              >
                {isPending ? (
                  <Icons.loading className="w-4 h-4 animate-spin" />
                ) : (
                  t.quiz.Submit
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t.quiz.PleaseAnswerAllQuestions}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </FormProvider>
  );
};

export default QuizListForm;

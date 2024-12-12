import React, { useMemo } from "react";
import { TExercise } from "../types";
import Markdown from "@/features/mdx/components/markdown";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/features/lang";
const QuizInset = ({
  quiz,
  value,
  onChange,
}: {
  quiz: TExercise;
  value?: string[];
  onChange?: (value: string[]) => void;
}) => {
  const t = useDictionary();
  const extend = useMemo(() => {
    return (value || []).reduce(
      (prev, next) =>
        prev.map((md) => ({
          ...md,
          raw: md.raw.replace(
            "_____",
            quiz.content?.options?.find((option) => option.value === next)
              ?.label || ""
          ),
        })),
      quiz.content?.extend?.map((md) => ({
        ...md,
        raw: md.raw.replace(/<<!!>>/g, "_____"),
      })) || []
    );
  }, [quiz.content?.extend, value]);

  return (
    <div>
      <div className="mb-4">
        <Markdown mode="quiz">{quiz?.title}</Markdown>
      </div>
      <div className="my-3 flex flex-col gap-2">
        {extend?.map((md, index) => (
          <Markdown key={index}>{md.raw}</Markdown>
        ))}
      </div>
      <div className="mb-4">
        <span className="text-xs opacity-50 text-content">{t.quiz.Choose_answers}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 px-5 py-4 border border-solid border-wtf-border-outline">
        {quiz.content?.options?.map((answer) => (
          <div
            key={answer.value}
            onClick={() => {
              if (!value?.includes(answer.value)) {
                onChange?.([...(value || []), answer.value]);
              } else {
                onChange?.(
                  (value || []).filter((v) => v !== answer.value)
                );
              }
            }}
            className={cn(
              "px-5 border-[1px] rounded",
              value?.includes(answer.value)
                ? "border-wtf-brand-1 bg-wtf-function-brandBg"
                : "border-wtf-border-outline"
            )}
          >
            <Markdown mode="quiz">{`${answer.value}. ${answer.label}`}</Markdown>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizInset;

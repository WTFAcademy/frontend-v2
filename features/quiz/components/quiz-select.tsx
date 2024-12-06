import React, { useMemo } from "react";
import { TExercise } from "../types";
import Markdown from "@/features/mdx/components/markdown";
import { cn } from "@/lib/utils";

interface IProps {
  quiz: TExercise;
  value?: string[];
  onChange?: (value: string[]) => void;
}

const QuizSelect = ({ quiz, value, onChange }: IProps) => {
  const extendRaw = useMemo(() => {
    const raws = quiz.content?.extend?.map((md) => md.raw) || [];
    return raws.join("\n");
  }, [quiz.content]);

  return (
    <div>
      <div className="mb-4">
        <Markdown mode="quiz">{quiz?.title}</Markdown>
      </div>
      {extendRaw && (
        <div className="my-3">
          <Markdown>{extendRaw}</Markdown>
        </div>
      )}
      <div className="text-xs mb-3">Choose an answer</div>
      <div className="flex flex-col gap-3">
        {quiz.content?.options?.map((answer) => (
          <div
            key={answer.value}
            onClick={() => {
              if (!value?.includes(answer.value)) {
                onChange?.([answer.value]);
              } else {
                onChange?.([]);
              }
            }}
            className={cn(
              "px-4 md:px-5 border-[1px] rounded break-all",
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

export default QuizSelect;

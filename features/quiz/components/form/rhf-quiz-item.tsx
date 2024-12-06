import { Control, useController } from "react-hook-form";
import React from "react";
import { TAnswer, TExercise } from "../../types";
import QuizSelect from "../quiz-select";
import QuizMultipleSelect from "../quiz-multiple-select";
import QuizInset from "../quiz-inset";

const RHFQuizItem = ({
  required = true,
  exercise,
  control,
  name,
}: {
  exercise: TExercise;
  index?: number;
  required?: boolean;
  control: Control<{ exercises: TAnswer[] }>;
  name: `exercises.${number}`;
}) => {
  const { field } = useController({
    control,
    name,
    rules: { required },
  });
  const { value, onChange } = field

  const handleChange = (value: string[]) => {
    onChange({
      id: exercise.meta.id,
      answers: value,
    });
  };

  let quizComp = null;

  if (exercise?.meta?.type === "select") {
    quizComp = (
      <QuizSelect
        value={value?.answers}
        quiz={exercise}
        onChange={handleChange}
        // index={exercise?.meta?.index || index}
      />
    );
  }
  if (exercise?.meta?.type === "multiple-select") {
    quizComp = (
      <QuizMultipleSelect
        value={value?.answers}
        quiz={exercise}
        onChange={handleChange}
        // index={exercise?.meta?.index || index}
      />
    );
  }
  if (exercise?.meta?.type === "inset") {
    quizComp = (
      <QuizInset
        value={value?.answers}
        quiz={exercise}
        onChange={handleChange}
        // index={exercise?.meta?.index || index}
      />
    );
  }
  
  return (
    <div className="border border-wtf-border-outline rounded p-6 md:p-8">
      {quizComp}
    </div>
  )
};

export default RHFQuizItem;

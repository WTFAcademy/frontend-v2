import { EExerciseType } from "./contants";

type TExerciseMeta = {
  index?: number;
  type: EExerciseType;
  answer?: string[];
  id?: string;
}

type TExerciseOption = {
  label: string;
  value: string;
}

type TMarkDown = {
  raw: string;
  tokens?: TMarkDown[];
  type: "blockquote" | "heading" | "code" | "paragraph" | "space" | "list";
  deep?: number;
  lang?: string;
}

type TExerciseContent = {
  extend?: TMarkDown[];
  options?: TExerciseOption[];
}

export type TExercise = {
  title: string;
  meta: TExerciseMeta;
  content: TExerciseContent;
}

export type TAnswer = {
  id: string;
  answers: string[];
}

export type TQuizSubmitPayload = {
  lesson_id: string;
  course_id: string;
  quiz_id: string;
  answers: TAnswer[];
}

export type TEditorQuizSubmitPayload = {
  exercises: TExercise[];
  lesson_id: string;
  quiz_id?: string;
}

export type TResponseEditorQuiz = {
  exercises: TExercise[];
  user: {
    uid: string;
    user_name: string;
  };
}

import { EExerciseType } from "./contants";

type TExerciseMeta = {
  index?: number;
  type: EExerciseType;
  answer?: string[];
  // id?: string;
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
  id: number;
  title: string;
  meta: TExerciseMeta;
  content: TExerciseContent;
}

export type TAnswer = {
  id: number;
  selects: string[];
}

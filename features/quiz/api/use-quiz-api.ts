import request, { TResponse } from "@/lib/request";
import { TAnswer, TExercise } from "../types";

type Preview = { id: number; title: string; path: string };
export type TQuizResponse = {
  id: number;
  chapter: Preview;
  course: Preview;
  list: TExercise[];
};
export type QuizResult = {
  errors: number;
  progress: number;
  incorrect_ids: number[];
  explanations?: Record<string, string>;
};

export async function getQuizzes(course: string, chapter: string) {
  const { data } = await request.get<TResponse<TQuizResponse>>(
    `/course/${course}/chapter/${chapter}/quiz/choice`
  );
  if (data.code !== 0) throw Error(data.msg);
  return data.data;
}

export async function submitQuiz(quiz: TQuizResponse, answer: TAnswer[]) {
  const { data } = await request.post<TResponse<QuizResult>>(
    `/course/${quiz.course.id}/chapter/${quiz.chapter.id}/quiz/choice/${quiz.id}`,
    { answer }
  );
  if (data.code !== 0) throw Error(data.msg);
  return data.data;
}

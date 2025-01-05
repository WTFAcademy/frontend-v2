import request, { TResponse } from "@/lib/request";
import { TAnswer } from "../types";

type TSimpleChapter = {
    id: number;
    title: string;
    course_path: string;
    path: string;
}

type TSimpleCourse = {
    id: number;
    title: string;
    path: string;
}

type TExercise = {
    title: string;
    meta: {
        type: string;
        score: number;
        answer: string | null;
    };
    content: {
        extend: {
            type: string;
            raw: string;
        }[];
        options: {
            label: string;
            value: string;
        }[];
    };
    id: number;
};

export type TQuizResponse = {
    id: number;
    chapter: TSimpleChapter;
    course: TSimpleCourse
    list: TExercise[]
}

export const getQuizzes = async (coursePath: string, chapterPath: string) => {
    const res = await request.get<TResponse<TQuizResponse>>(`/course/${coursePath}/chapter/${chapterPath}/quiz/choice`)
    return res.data
}

export type TSubmitQuizBody = {
    answer: TAnswer[]
}

export type TSubmitQuizResponse = {
    errors: number
    message: string
    progress: number
}

export const submitQuiz = async (courseId: number, chapterId: number, quizId: number, data: TSubmitQuizBody) => {
    const res = await request.post<TResponse<TSubmitQuizResponse>>(`/course/${courseId}/chapter/${chapterId}/quiz/choice/${quizId}`, data)
    return res.data
}
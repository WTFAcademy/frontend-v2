import request, { TRequestResponse } from "@/lib/request";
import { TAnswer } from "../types";

type TSimpleChapter = {
    id: number;
    title: string;
    course_path: string;
    chapter_path: string;
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
        id: number;
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
    simple_chapter: TSimpleChapter;
    simple_course: TSimpleCourse
    exercise_list: TExercise[]
}

export const getQuizzes = async (coursePath: string, chapterPath: string) => {
    const res = await request.get<TRequestResponse<TQuizResponse>>(`/course/${coursePath}/chapter/${chapterPath}/quizzes`)
    return res.data
}

export type TSubmitQuizBody = {
    course_id: number;
    chapter_id: number;
    answers: TAnswer[]
}

export type TSubmitQuizResponse = {
    score: number;
    error_cnt: number;
}

export const submitQuiz = async (data: TSubmitQuizBody) => {
    const res = await request.post<TRequestResponse<TSubmitQuizResponse>>(`/grade`, data)
    return res.data
}
import request, { TListResponse, TResponse } from "@/lib/request";

export type TChapter = {
  id: number;
  sort: number;
  path: string;
  lang: string;
  title: string;
  owner: {
    id: number;
    email: string;
    avatar: string;
    username: string;
    nickname: string;
    github_id: number;
  };
  author: {
    id: number;
    email: string;
    avatar: string;
    username: string;
    nickname: string;
    github_id: number;
  };
  content: string;
  quizzes: number;
  keywords: string;
  learners: number;
  created_at: string;
  updated_at: string;
  content_url: string;
  quiz_progress: number;
  code_progress: number;
};

export type TChapterDetail = {
  content: string;
  score: number;
  study_time: number;
  sort: number;
  title: string;
};

export const getChaptersByPath = async (coursePath: string) => {
  const res = await request.get<TListResponse<TChapter[]>>(
    `course/${coursePath}/chapters`
  );
  return res.data;
};

export const getChapterByPath = async (coursePath: string, chapterPath: string) => {
  const res = await request.get<TResponse<TChapterDetail>>(
    `course/${coursePath}/chapter/${chapterPath}`
  );
  return res.data;
};

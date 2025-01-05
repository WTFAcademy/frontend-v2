import request, { TListResponse, TResponse } from "@/lib/request";

export type TChapter = {
  id: number;
  course_id: number;
  sort: number;
  path: string;
  lang: string;
  title: string;
  owner: {
    id: number;
    bio: string;
    email: string;
    avatar: string;
    username: string;
    nickname: string;
    github_id: number;
  },
  author: {
    id: number;
    bio: string;
    email: string;
    avatar: string;
    username: string;
    nickname: string;
    github_id: number;
  },
  content: string;
  keywords: string;
  progress: number;
  learners: number;
  study_time: number;
  created_at: string;
  updated_at: string;
  content_url: string;
};

export type TChapterDetail = {
  id: number;
  course_id: number;
  sort: number;
  path: string;
  lang: string;
  title: string;
  owner: {
    id: number;
    bio: string;
    email: string;
    avatar: string;
    username: string;
    nickname: string;
    github_id: number;
  },
  author: {
    id: number;
    bio: string;
    email: string;
    avatar: string;
    username: string;
    nickname: string;
    github_id: number;
  },
  content: string;
  keywords: string;
  progress: number;
  learners: number;
  study_time: number;
  created_at: string;
  updated_at: string;
  content_url: string;
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

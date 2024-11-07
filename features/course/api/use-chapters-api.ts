import request, { TRequestResponse } from "@/lib/request";

export type TChapter = {
  title: string;
  route_path: string;
  sort: number;
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
  const res = await request.get<TRequestResponse<TChapter[]>>(
    `courses/path/${coursePath}/chapters`
  );
  return res.data;
};

export const getChapterByPath = async (coursePath: string, chapterPath: string) => {
  const res = await request.get<TRequestResponse<TChapterDetail>>(
    `courses/path/${coursePath}/chapters/path/${chapterPath}`
  );
  return res.data;
};

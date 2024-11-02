import request, { TRequestResponse } from "@/lib/request";

export type TChapter = {
  title: string;
  route_path: string;
  sort: number;
  quiz_progress: number;
  code_progress: number;
};

export const getChaptersByPath = async (coursePath: string) => {
  const res = await request.get<TRequestResponse<TChapter[]>>(
    `courses/path/${coursePath}/chapters`
  );
  return res.data;
};

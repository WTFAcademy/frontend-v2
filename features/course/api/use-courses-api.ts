import request, { TRequestResponse } from "@/lib/request";

export type TCourse = {
  title: string;
  path: string;
  category: string;
  level: string;
  description: string;
  cover_img: string;
  sort: number;
  total_score: number;
  user_cnt: number;
  share_url: string;
  study_time: number;
};

export const getCourses = async () => {
  const res = await request.get<TRequestResponse<Record<"published" | "unpublished", TCourse[]>>>("/courses");
  return res.data;
};

export const getCourseWithType = async () => {
  const res = await request.get<TRequestResponse<TCourse[]>>(`/courses/type`);
  return res.data;
};

export const getCourseDetailByPath = async (path: string) => {
  const res = await request.get<TRequestResponse<TCourse>>(
    `/courses/path/${path}`
  );
  return res.data;
};

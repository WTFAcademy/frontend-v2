import request, { TResponse } from "@/lib/request";
import { get } from "lodash-es";

export type TCourse = {
  id: number;
  sort: number;
  path: string;
  lang: string;
  repo: string;
  title: string;
  cover: string;
  level: string;
  owner: {
    id: number;
    bio: string;
    email: string;
    avatar: string;
    username: string;
    nickname: string;
    github_id: number;
  };
  author: {
    id: number;
    bio: string;
    email: string;
    avatar: string;
    username: string;
    nickname: string;
    github_id: number;
  },
  passers: number;
  learners: number;
  category: string;
  schedule: string[];
  share_url: string;
  chapters: number[];
  progress: number;
  study_time: number;
  created_at: string;
  updated_at: string;
  description: string;
  claim_address: string;
  claim_price: number;
  contributors: {
    id: number;
    bio: string;
    email: string;
    avatar: string;
    username: string;
      nickname: string;
      github_id: number;
  }[];
  sbt_token: string;
  sbt_preview_url: string;
};

export type TCategory = {
  name: string;
  list: TCourse[];
}

export const getCourses = async () => {
  const res = await request.get<TResponse<{ published: TCourse[], unpublished: TCourse[], category: TCategory[] }>>("/courses");
  return res.data;
};

export const getCourseWithType = async () => {
  const res = await request.get<TResponse<{ category: TCategory[] }>>(`/category`);
  return get(res, "data.data.category", []);
};

export const getCourseDetailByPath = async (path: string) => {
  const res = await request.get<TResponse<TCourse>>(
    `/course/${path}`
  );
  return res.data;
};

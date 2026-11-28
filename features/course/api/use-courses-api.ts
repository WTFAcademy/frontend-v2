import request, { TResponse } from "@/lib/request";
import { get, set } from "lodash-es";

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
  sbt_token: {
    id: number;
    url: string;
    chain: number;
    price: number;
    expiration: number;
  };
  status: 'prepublish' | 'published';
};

export type TCategory = {
  name: string;
  list: TCourse[];
}

export const getCourses = async (lang?:string) => {
  const res = await request.get<TResponse<{ published: TCourse[], unpublished: TCourse[], category: TCategory[] }>>("/courses",{headers:{Language:lang}});
  return res.data;
};

export const getCourseWithType = async (lang?:string) => {
  const res = await request.get<TResponse<{ category: TCategory[] }>>(`/category`,{headers:{Language:lang}});
  return get(res, "data.data.category", []);
};

export const getCourseDetailByPath = async (path: string, lang?:string) => {
  const res = await request.get<TResponse<TCourse>>(
    `/course/${path}`, {headers:{Language:lang}}
  );

  const sbtToken = get(res, "data.data.sbt_token", {});
  const resData = set(res, "data.data.sbt_token", sbtToken);

  return resData.data;
};

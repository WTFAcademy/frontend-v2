import { useQuery } from "@tanstack/react-query";
import { TContributor } from "../type";
import request, { TResponse } from "@/lib/request";

export const getContributors = async (): Promise<TContributor[]> => {
  try {
    const res = await request.get<TResponse<TContributor[]>>(`/stats/contributors`)
    return res.data.data
  } catch (error) {
    console.error(error)
    return []
  }
};

export const useGetContributors = () => {
  const { data, isLoading } = useQuery<TContributor[]>({
    queryKey: ["contributors"],
    queryFn: () => getContributors(),
    staleTime: Infinity, // 设置数据永不过期
  });
  return { data, isLoading };
};

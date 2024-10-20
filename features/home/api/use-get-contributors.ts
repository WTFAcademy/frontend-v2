import { useQuery } from "@tanstack/react-query";
import { TContributor } from "../type";

// TODO: 获取不全
export const getContributors = async (
  repo = "WTF-Solidity",
): Promise<TContributor[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contributors`, {
    method: 'POST',
    body: JSON.stringify({ repo })
  })
  const { data }: { data: { [key: string]: TContributor[]}} = await res.json()
  return data[repo]
};

export const useGetContributors = () => {
  const { data, isLoading } = useQuery<TContributor[]>({
    queryKey: ["contributors"],
    queryFn: () => getContributors(),
    staleTime: Infinity, // 设置数据永不过期
  });
  return { data, isLoading };
};

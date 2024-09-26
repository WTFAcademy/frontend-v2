import { useQuery } from "@tanstack/react-query";
import { Octokit } from "@octokit/rest";
import { TContributor } from "../type";

const octokit = new Octokit();

export const getContributors = async (
  owner = "wtfacademy",
  repo = "WTFSolidity",
  page = 1,
  perPage = 100,
): Promise<TContributor[]> => {
  let { data } = await octokit.repos.listContributors({
    owner,
    repo,
    page,
    per_page: perPage,
  });

  if (data.length === perPage) {
    data = [
      ...data,
      ...(await getContributors(owner, repo, page + 1, perPage)),
    ];
  }
  return data as TContributor[];
};

export const useGetContributors = () => {
  const { data, isLoading } = useQuery<TContributor[]>({
    queryKey: ["contributors"],
    queryFn: () => getContributors(),
    staleTime: Infinity, // 设置数据永不过期
  });
  return { data, isLoading };
};

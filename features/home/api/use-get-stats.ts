import request from "@/lib/request";
import { TResponse } from "@/lib/request";

type TGetWtfStatsResponse = TResponse<{
  stars: number;
  bonus: number;
  passers: number;
  learners: number;
  contributors: number;
  contributions: number;
}>;

export const getWtfStats = async (): Promise<TGetWtfStatsResponse> => {
    const res = await request.get<TGetWtfStatsResponse>("/stats");
    return res.data;
};

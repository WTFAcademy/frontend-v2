import request from "@/lib/request";
import { TResponse } from "@/lib/request";

type TGetWtfStatsResponse = TResponse<{
  learner_count: number;
  contributor_count: number;
  star_count: number;
  bonus_amount: number;
}>;

export const getWtfStats = async (): Promise<TGetWtfStatsResponse> => {
    const res = await request.get<TGetWtfStatsResponse>("/stats");
    return res.data;
};

import request from "@/lib/request";
import { TRequestResponse } from "@/lib/request";

type TGetWtfStatsResponse = TRequestResponse<{
  learner_count: number;
  contributor_count: number;
  star_count: number;
  bonus_amount: number;
}>;

export const getWtfStats = async (): Promise<TGetWtfStatsResponse> => {
    const res = await request.get<TGetWtfStatsResponse>("/courses/stats");
    return res.data;
};

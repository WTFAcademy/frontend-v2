
import { request, TResponse } from "@/lib/request";
import { TAuthUser } from "../type";

export const getUserApi = async () => {
    const response = await request.get<TResponse<TAuthUser>>(`/user/profile`);
    return response.data;
}
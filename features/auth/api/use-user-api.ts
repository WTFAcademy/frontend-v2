
import { request } from "@/lib/request";

export const getUserApi = async () => {
    const response = await request.get(`/user/profile`);
    return response.data;
}
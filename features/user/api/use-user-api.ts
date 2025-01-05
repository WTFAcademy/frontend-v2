import { request, TResponse } from "@/lib/request";
import { type TCourse } from "@/features/course/api/use-courses-api";
import { type TAuthUser } from "@/features/auth/type";

export type TUserCourse = {
    sbt: TCourse[];
    ongoing: TCourse[];
    completed: TCourse[];
}
export const getUserApi = async () => {
    const response = await request.get<TResponse<TAuthUser>>(`/user/profile`);
    return response.data;
}

export const getUserCourses = async () => {
    const response = await request.get<TResponse<TUserCourse>>(`/user/courses`);
    return response.data;
}

export const updateUser = async (data: {bio: string, nickname: string}) => {
    const response = await request.post<TResponse<TAuthUser>>(`/user/update`, data);
    return response.data;
}

export const unbindWallet = async (data: {address: string; provider: string}) => {
    const response = await request.post<TResponse<{address: string; provider: string}>>(`/user/wallet/unbind`, data);
    return response.data;
}
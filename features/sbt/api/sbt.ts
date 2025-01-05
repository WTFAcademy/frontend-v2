import request from "@/lib/request";

export const getSbtMintSign = async (courseId: number, nonce: number) => {
    const data = {
        nonce,
        course_id: courseId,
    }
    return request.post(`/sbt/token`, data).then((res) => res.data);
}

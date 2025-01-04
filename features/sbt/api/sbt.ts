import request from "@/lib/request";

export const getSbtMintSign = (courseId: string, nonce: number) => {
    return request
    .post(
      `/user_course/${courseId}/nft_sign`,
      {
        nonce,
      }
    )
    .then(res => res.data);
}
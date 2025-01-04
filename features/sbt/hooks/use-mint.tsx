import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import MinterABI from "../abi/WTFSBT1155Minter"; // 确保你有这个ABI文件
import { getSbtMintSign } from "../api/sbt";

const ErrorMap = (message: string) => {
  if (message.includes("Already minted!")) {
    return "已铸造完成，请勿重复进行！";
  }

  if (message.includes("SoulId is not created yet")) {
    return "该认证NFT还未进行未创建";
  }

  if (message.includes("mint has not started")) {
    return "铸造还未开放，请等待";
  }

  if (message.includes("mint has ended")) {
    return "铸造已经结束";
  }

  if (message.includes("Invalid signature")) {
    return "错误的签名";
  }

  if (message.includes("User denied transaction signature.")) {
    return "拒绝交易";
  }

  return "领取错误，请重试";
};

const useMint = (courseId: string, onSuccess: (hash?: string) => void) => {
  const [errorMessage, setErrorMessage] = useState("领取失败，请稍后重试");
  const { address } = useAccount();

  const { writeContract, isPending, isSuccess, isError } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        onSuccess(data);
      },
      onError: (error) => {
        setErrorMessage(ErrorMap(String(error.message)));
      },
    },
  });

  const { data: nonce } = useReadContract({
    address: "0x2BBE57dA6DFE615B9cE86B2BD149A953af7385d2",
    abi: MinterABI,
    functionName: "nonces",
    args: [address],
  });

  const mint = async (donationAmount: number) => {
    const mintInfoRes = await getSbtMintSign(
      courseId,
      Number(nonce),
    );

    const mintInfo = mintInfoRes.data;
    writeContract({
      address: "0x2BBE57dA6DFE615B9cE86B2BD149A953af7385d2",
      abi: MinterABI,
      functionName: "mint",
      args: [address, mintInfo.token_id, mintInfo.mint_price, mintInfo.deadline, mintInfo.sign],
      value: parseEther(donationAmount.toString()),
    })
  };

  return {
    isPending,
    isSuccess,
    isError,
    errorMessage,
    mint,
    nonce,
  };
};

export default useMint;

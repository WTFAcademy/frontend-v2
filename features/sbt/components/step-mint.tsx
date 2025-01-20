"use client";

import { Button } from "@/components/ui/button";
import { ClaimStep } from "./claim-stepper";
import { cn } from "@/lib/utils";
import { claimAtom, courseIdAtom, donationAmountAtom } from "../atoms";
import { useAtom, useAtomValue } from "jotai";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAccount } from "wagmi";
import { useWriteContract, useReadContract } from "wagmi";
import { formatEther, parseEther } from "viem";
import MinterABI from "../constants/abi/WTFSBT1155Minter";
import { getSbtMintSign } from "../api/sbt";
import { useState } from "react";
import { useDictionary } from "@/features/lang";
import { SBT_CHAIN } from "../constants/nft";

const StepMint = ({
  active,
}: {
  nextStep: (target?: ClaimStep) => void;
  active: boolean;
}) => {
  const t = useDictionary();
  const [isFinish, setIsFinish] = useAtom(claimAtom);
  const courseId = useAtomValue(courseIdAtom);
  const [donationAmount, setDonationAmount] = useAtom(donationAmountAtom);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { address } = useAccount();
  const [isChecked, setIsChecked] = useState(false);
  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: (data) => {
        console.log(data);
        setIsFinish(true);
      },
      onError: (error) => {
        console.log(error);
        setErrorMessage(ErrorMap(String(error.message)));
      },
    },
  });

  const { data: nonce } = useReadContract({
    address: "0x2BBE57dA6DFE615B9cE86B2BD149A953af7385d2",
    abi: MinterABI,
    functionName: "nonces",
    args: [address],
    chainId: SBT_CHAIN.id,
  });

  const mint = async () => {
    if (!courseId) {
      setErrorMessage(t.sbt.claim_error.course_id_error);
      return;
    }

    const mintInfoRes = await getSbtMintSign(courseId, Number(nonce));

    const mintInfo = mintInfoRes.data;
    const mintPrice = Number(formatEther(mintInfo.mint_price.toString()));

    if (mintPrice > 0 && (donationAmount < mintPrice || !isChecked)) {
      setErrorMessage(t.sbt.claim_error.donation_too_low.replace("{amount}", String(mintPrice)));
      return;
    }

    writeContract({
      address: "0x2BBE57dA6DFE615B9cE86B2BD149A953af7385d2",
      abi: MinterABI,
      functionName: "mint",
      args: [
        address,
        mintInfo.token_id,
        mintInfo.mint_price,
        mintInfo.deadline,
        mintInfo.sign,
      ],
      value: parseEther(donationAmount.toString()),
      chainId: SBT_CHAIN.id,
    });
  };

  const ErrorMap = (message: string) => {
    if (message.includes("Already minted!")) {
      return t.sbt.claim_error.already_minted;
    }
    if (message.includes("SoulId is not created yet")) {
      return t.sbt.claim_error.not_created;
    }

    if (message.includes("mint has not started")) {
      return t.sbt.claim_error.not_started;
    }

    if (message.includes("mint has ended")) {
      return t.sbt.claim_error.ended;
    }

    if (message.includes("Invalid signature")) {
      return t.sbt.claim_error.invalid_signature;
    }

    if (message.includes("User denied transaction signature.")) {
      return t.sbt.claim_error.user_denied;
    }

    return t.sbt.claim_error.default;
  };

  const ActionButton = () => {
    if (!active && !isFinish) {
      return (
        <Button disabled variant="outline" className="rounded-full">
          {t.sbt.mint}
        </Button>
      );
    }

    if (isFinish) {
      return (
        <Button variant="success" className="rounded-full">
          {t.sbt.already_minted}
        </Button>
      );
    }

    return (
      <Button
        className="rounded-full"
        onClick={() => mint()}
        disabled={isPending}
      >
        {isPending ? t.sbt.minting : t.sbt.mint}
      </Button>
    );
  };

  return (
    <div className="w-full px-8 py-5 border-y-[0.5px] border-wtf-border-divider -mt-[0.5px]">
      <div className="flex items-center justify-between h-10">
        <div className="flex items-center gap-x-3">
          <span
            className={cn(
              "w-8 h-8 rounded-full inline-flex items-center justify-center bg-wtf-brand-2 text-white",
              active && isFinish && "bg-wtf-function-success",
              active && !isFinish && "bg-wtf-brand-1",
              !active && !isFinish && "bg-wtf-function-brandBg text-wtf-function-link"
            )}
          >
            3
          </span>
          <div className="flex flex-col">
            <span>{t.sbt.get_nft_title}</span>
            {errorMessage && (
              <span className="text-xs text-wtf-function-error">
                {errorMessage}
              </span>
            )}
          </div>
        </div>
        <ActionButton />
      </div>
      {active && (
        <div className="rounded-lg bg-wtf-background-block h-[72px] w-full flex items-center justify-between p-4 gap-4 mt-3">
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-x-3">
              <Checkbox
                className="mt-1"
                checked={isChecked}
                onCheckedChange={(checked) => {
                  setIsChecked(checked as boolean);
                }}
              />
              <div className="flex flex-col">
                <span className="text-base font-medium">{t.sbt.donation.title}</span>
              </div>
            </div>
            <span className="text-xs text-wtf-content-3 whitespace-nowrap">
              {t.sbt.donation.description}
            </span>
          </div>
          <div className="flex items-center gap-x-3">
            <Input
              placeholder="0.00"
              step={0.001}
              type="number"
              className="w-[100px]"
              value={donationAmount}
              onChange={(e) => {
                const value = Number(e.target.value);
                setDonationAmount(value);
              }}
            />
            <span>{t.sbt.donation.unit}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepMint;

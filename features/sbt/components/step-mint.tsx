"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ClaimStep } from "./claim-steppter";
import { cn } from "@/lib/utils";

const StepMint = ({ nextStep, active }: { nextStep: (target?: ClaimStep) => void; active: boolean }) => {
  const isFinish = false;

  const ActionButton = () => {
    if (!active && !isFinish) {
      return <Button disabled variant="outline" className="rounded-full">Mint</Button>;
    }

    return (
      <Button variant="success" className="rounded-full">
        Mint
      </Button>
    );
  };

  useEffect(() => {
    if (isFinish) {
      nextStep(ClaimStep.MINT_SUCCESS);
    }
  }, [isFinish]);

  return (
    <div className="h-20 w-full px-8 flex items-center justify-between border-y-[0.5px] border-wtf-border-divider">
      <div className="flex items-center gap-x-3">
        <span
          className={cn(
            "w-8 h-8 rounded-full inline-flex items-center justify-center bg-wtf-brand-2 text-white",
            active && isFinish && "bg-wtf-function-success",
            active && !isFinish && "bg-wtf-brand-1"
          )}
        >
          3
        </span>
        <span>Get the NFT certificate</span>
      </div>

      <ActionButton />
    </div>
  );
};

export default StepMint;

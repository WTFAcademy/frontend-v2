"use client";

import { Button } from "@/components/ui/button";
import useAuth from "@/features/auth/hooks/use-auth";
import { useSetAtom } from "jotai";
import { openAuthModal } from "@/features/auth/atoms/auth";
import { useEffect } from "react";
import { ClaimStep } from "./claim-stepper";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/features/lang";

const StepLogin = ({
  nextStep,
}: {
  nextStep: (target?: ClaimStep) => void;
}) => {
  const { isLogin, authUser } = useAuth();
  const setOpenAuth = useSetAtom(openAuthModal);
  const t = useDictionary();

  const isFinish = isLogin;

  console.log("isLogin: ", isLogin);

  const ActionButton = () => {
    if (!isLogin) {
      return (
        <Button className="rounded-full" onClick={() => setOpenAuth(true)}>
          {t.sbt.sign_in}
        </Button>
      );
    }

    return (
      <Button variant="success" className="rounded-full">
        {authUser?.nickname}
      </Button>
    );
  };

  useEffect(() => {
    if (!isLogin) {
      nextStep(ClaimStep.LOGIN);
    } else {
      nextStep();
    }
  }, [isLogin]);

  return (
    <div className="h-20 w-full px-8 flex items-center justify-between border-y-[0.5px] border-wtf-border-divider">
      <div className="flex items-center gap-x-3">
        <span
          className={cn(
            "w-8 h-8 rounded-full inline-flex items-center justify-center bg-wtf-brand-1 text-white",
            isFinish && "bg-wtf-function-success"
          )}
        >
          1
        </span>
        <span>{t.sbt.sign_in_wtf}</span>
      </div>

      <ActionButton />
    </div>
  );
};

export default StepLogin;

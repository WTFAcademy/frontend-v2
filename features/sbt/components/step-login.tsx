"use client";

import { Button } from "@/components/ui/button";
import useAuth from "@/features/auth/hooks/use-auth";
import { useSetAtom } from "jotai";
import { openAuthModal } from "@/features/auth/atoms/auth";
import { useEffect } from "react";
import { ClaimStep } from "./claim-steppter";
import { cn } from "@/lib/utils";

const StepLogin = ({ nextStep }: { nextStep: (target?: ClaimStep) => void }) => {
  const { isLogin, authUser } = useAuth();
  const setOpenAuth = useSetAtom(openAuthModal);

  const isFinish = isLogin;

  const ActionButton = () => {
    if (!isLogin) {
      return (
        <Button className="rounded-full" onClick={() => setOpenAuth(true)}>
          Sign in
        </Button>
      );
    }

    return <Button variant="success" className="rounded-full">{authUser?.nickname}</Button>;
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
        <span>Sign in WTF Academy</span>
      </div>

      <ActionButton />
    </div>
  );
};

export default StepLogin;

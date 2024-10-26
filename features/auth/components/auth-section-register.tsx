import { Icons } from "@/components/icons";
import { STEP } from "./auth-button";
import { Button } from "@/components/ui/button";
import { useDisconnect } from "@reown/appkit/react";
import { useState } from "react";
import useAuth from "../hooks/use-auth";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useAccount, useSignMessage, useTransactionCount } from "wagmi";

type AuthSectionRegisterProps = {
  updateStep: (step: STEP) => void;
};

enum STEP_REGISTER {
  SignInWithGitHub,
  SignMessageAndBindWallet,
}

const StepSignInWithGitHub = ({
  nextStep,
  active = false,
}: {
  nextStep: () => void;
  active?: boolean;
}) => {
  const { signInWithGithub, setIsRegistering, setToken } = useAuth();
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSignInWithGitHub = async () => {
    setIsRegistering(true);
    const res = await signInWithGithub();
    if (res.code === 200) {
      setToken(res.data.token);
      setIsFinished(true);
      nextStep();
    } else {
      setError("Sign in with GitHub failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between px-8 py-6 border-y-[0.5px] text-wtf-content-1 border-wtf-border-line mb-[-0.5px]">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-semibold",
            active && !isFinished && "bg-wtf-brand-1 text-wtf-content-white",
            isFinished && "bg-wtf-function-success text-wtf-content-white",
            !active && !isFinished && "text-wtf-brand-1 bg-wtf-function-brandBg"
          )}
        >
          1
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold">Sign in with GitHub</span>
        </div>
      </div>

      {isFinished && !error && (
        <Button
          size="lg"
          variant="success"
          className="gap-2 hover:bg-wtf-function-successBg"
        >
          <Icons.check className="w-4 h-4" />
          <span>Done</span>
        </Button>
      )}

      {!isFinished && !error && (
        <Button
          size="lg"
          className="space-x-3"
          onClick={handleSignInWithGitHub}
        >
          <Icons.github />
          <span>Sign in</span>
        </Button>
      )}

      {error && (
        <Button size="lg" variant="destructive">
          <span>Retry</span>
        </Button>
      )}
    </div>
  );
};

const StepSignMessageAndBindWallet = ({
  active = false,
}: {
  active?: boolean;
}) => {
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const { address } = useAccount();
  const { data: nonce } = useTransactionCount({
    address: address,
  });
  const { signMessageAsync } = useSignMessage();

  const { mutate: signMessageAndBindWallet } = useMutation({
    mutationFn: async () => {
      const message = `You are binding the wallet address to your github ID in WTF Academy. \n\nThis binding can not be changed later. \nPlease confirm the binding operation. \n\nGithub ID: \n\nWallet Address: ${address}\n\nNonce: ${nonce}`;
      const signData = await signMessageAsync({
        message: message,
      });

      console.log(signData);
    },
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between px-8 py-6 border-y-[0.5px] text-wtf-content-1 border-wtf-border-line mb-[-0.5px]">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-semibold",
            active && !isFinished && "bg-wtf-brand-1 text-wtf-content-white",
            isFinished && "bg-wtf-function-success text-wtf-content-white",
            !active && !isFinished && "text-wtf-brand-1 bg-wtf-function-brandBg"
          )}
        >
          2
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold">Sign Message + Bind Wallet</span>
        </div>
      </div>

      {isFinished && !error && (
        <Button
          size="lg"
          variant="success"
          className="gap-2 hover:bg-wtf-function-successBg"
        >
          <Icons.check className="w-4 h-4" />
          <span>Done</span>
        </Button>
      )}

      {!isFinished && !error && (
        <Button
          size="lg"
          className="space-x-3"
          variant={active ? "default" : "outline"}
          disabled={!active}
          onClick={() => signMessageAndBindWallet()}
        >
          <span>Sign & Bind</span>
        </Button>
      )}

      {error && (
        <Button size="lg" variant="destructive">
          <span>Retry</span>
        </Button>
      )}
    </div>
  );
};

const AuthSectionRegister = (props: AuthSectionRegisterProps) => {
  const { updateStep } = props;
  const { disconnect } = useDisconnect();
  const [stepRegister, setStepRegister] = useState<STEP_REGISTER>(
    STEP_REGISTER.SignInWithGitHub
  );

  const backToLogin = async () => {
    await disconnect();
    updateStep(STEP.Login);
  };

  const nextStep = () => {
    setStepRegister(STEP_REGISTER.SignMessageAndBindWallet);
  };

  return (
    <div className="flex flex-col gap-6 pt-8 pb-6">
      <div className="flex flex-col items-center gap-4 w-full">
        <Icons.logo className="h-10" />
        <p className="text-2xl font-bold leading-8">Connect to your GitHub</p>
      </div>
      <div className="flex flex-col w-full">
        <StepSignInWithGitHub
          nextStep={nextStep}
          active={stepRegister === STEP_REGISTER.SignInWithGitHub}
        />
        <StepSignMessageAndBindWallet
          active={stepRegister === STEP_REGISTER.SignMessageAndBindWallet}
        />

        <div className="pt-4 mx-auto">
          <Button
            size="lg"
            variant="ghost"
            className="text-wtf-content-3 text-base"
            onClick={backToLogin}
          >
            Cancel login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthSectionRegister;

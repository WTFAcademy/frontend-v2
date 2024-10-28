import { Icons } from "@/components/icons";
import { STEP } from ".";
import { Button } from "@/components/ui/button";
import { useDisconnect } from "@reown/appkit/react";
import { useState } from "react";
import useAuth from "../../hooks/use-auth";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useAccount, useSignMessage, useTransactionCount } from "wagmi";
import { bindWalletApi } from "../../api/use-auth-api";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

type AuthSectionRegisterProps = {
  updateStep: (step: STEP) => void;
  close: () => void;
};

enum STEP_REGISTER {
  SignInWithGitHub,
  SignMessageAndBindWallet,
}

const StepSignInWithGitHub = ({
  nextStep,
  active = false,
  error,
  setError,
}: {
  nextStep: () => void;
  active?: boolean;
  error?: string;
  setError: (error: string | undefined) => void;
}) => {
  const { signInWithGithub, setIsRegistering, setToken } = useAuth();
  const [isFinished, setIsFinished] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    mutate: handleSignInWithGitHub,
    isPending: isPendingSignInWithGitHub,
    error: errorSignInWithGitHub,
    isError: isErrorSignInWithGitHub,
  } = useMutation({
    mutationFn: async () => {
      const res = await signInWithGithub();
      if (res.code !== 200) {
        throw new Error(res.msg);
      }
      return res;
    },
    onSuccess: (res: any) => {
      setIsRegistering(true);
      setToken(res.data.token);
      setIsFinished(true);
      nextStep();
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between px-3 md:px-8 py-5 border-y-[0.5px] text-wtf-content-1 border-wtf-border-line mb-[-0.5px]">
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
          {isDesktop && isErrorSignInWithGitHub && (
            <AnimatePresence mode="wait">
              <motion.span
                className="text-wtf-function-error text-xs"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {errorSignInWithGitHub?.message}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      </div>

      {isFinished && (
        <Button
          size="lg"
          variant="success"
          className="gap-2 hover:bg-wtf-function-successBg"
        >
          <Icons.check className="w-4 h-4" />
          <span>Done</span>
        </Button>
      )}

      {!isFinished && (
        <Button
          size="lg"
          className="space-x-3"
          onClick={() => handleSignInWithGitHub()}
          disabled={isPendingSignInWithGitHub}
        >
          {isPendingSignInWithGitHub ? (
            <Icons.loading className="animate-spin w-4 h-4" />
          ) : (
            <>
              <Icons.github />
              <span>Sign in</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

const StepSignMessageAndBindWallet = ({
  active = false,
  close,
  error,
  setError,
}: {
  active?: boolean;
  close: () => void;
  error?: string;
  setError: (error: string | undefined) => void;
}) => {
  const [isFinished, setIsFinished] = useState(false);
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { setIsRegistering } = useAuth();
  const { data: nonce } = useTransactionCount({
    address: address,
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    mutate: signMessageAndBindWallet,
    error: errorSignMessageAndBindWallet,
    isError: isErrorSignMessageAndBindWallet,
    isPending: isPendingSignMessageAndBindWallet,
  } = useMutation({
    mutationFn: async () => {
      setError(undefined);
      const message = `You are binding the wallet address to your github ID in WTF Academy. \n\nThis binding can not be changed later. \nPlease confirm the binding operation. \n\nGithub ID: \n\nWallet Address: ${address}\n\nNonce: ${nonce}`;
      const signData = await signMessageAsync({
        message: message,
      });

      const bindRes = await bindWalletApi({
        signData: signData,
        mesData: message,
        wallet: address as string,
      });
      console.log(bindRes);
      if (bindRes.code !== 200) {
        throw new Error(bindRes.msg);
      }
      return bindRes;
    },
    onSuccess: () => {
      setIsFinished(true);
      toast.success("Bind wallet successfully");
      close();
    },
    onError: (error: any) => {
      console.log("error: ", error);
      setError(error.message);
    },
  });

  return (
    <div className="border-y-[0.5px] border-wtf-border-line py-5 px-3 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between text-wtf-content-1 mb-[-0.5px]">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-semibold",
              active && !isFinished && "bg-wtf-brand-1 text-wtf-content-white",
              isFinished && "bg-wtf-function-success text-wtf-content-white",
              !active &&
                !isFinished &&
                "text-wtf-brand-1 bg-wtf-function-brandBg"
            )}
          >
            2
          </span>
          <div className="flex flex-col gap-[2px]">
            <span className="text-base font-semibold">
              Sign Message + Bind Wallet
            </span>
            {isDesktop && isErrorSignMessageAndBindWallet && (
              <AnimatePresence mode="wait">
                <motion.span
                  className="text-wtf-function-error text-xs"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {errorSignMessageAndBindWallet?.message}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        </div>

        {isFinished && (
          <Button
            size="lg"
            variant="success"
            className="gap-2 hover:bg-wtf-function-successBg"
          >
            <Icons.check className="w-4 h-4" />
            <span>Done</span>
          </Button>
        )}

        {!isFinished && (
          <Button
            size="lg"
            className="space-x-3"
            variant={active ? "default" : "outline"}
            disabled={!active || isPendingSignMessageAndBindWallet}
            onClick={() => signMessageAndBindWallet()}
          >
            {isPendingSignMessageAndBindWallet ? (
              <Icons.loading className="animate-spin w-4 h-4" />
            ) : (
              <span>Sign & Bind</span>
            )}
          </Button>
        )}
      </div>

      {!isDesktop && error && (
        <AnimatePresence mode="wait">
          <motion.div
            className="text-center text-wtf-function-error text-xs mt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

const AuthSectionRegister = (props: AuthSectionRegisterProps) => {
  const { updateStep, close } = props;
  const { disconnect } = useDisconnect();
  const [stepRegister, setStepRegister] = useState<STEP_REGISTER>(
    STEP_REGISTER.SignInWithGitHub
  );
  const [error, setError] = useState<string | undefined>(undefined);

  console.log("error: ", error);

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
          error={error}
          setError={setError}
        />
        <StepSignMessageAndBindWallet
          active={stepRegister === STEP_REGISTER.SignMessageAndBindWallet}
          close={close}
          error={error}
          setError={setError}
        />

        <div className="pt-4 mx-auto">
          <Button
            size="lg"
            variant="ghost"
            className="text-wtf-content-3 text-base"
            onClick={backToLogin}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthSectionRegister;

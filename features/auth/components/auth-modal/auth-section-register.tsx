import { Icons } from "@/components/icons";
import { STEP } from ".";
import { Button } from "@/components/ui/button";
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { useState } from "react";
import useAuth from "../../hooks/use-auth";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { bindWalletApi, getNonceApi, TLoginWithGithubResponse } from "../../api/use-auth-api";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useDictionary } from "@/features/lang";
import useSiwe from "../../hooks/use-siwe";
import { TResponse } from "@/lib/request";
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
  setError,
}: {
  nextStep: () => void;
  active?: boolean;
  error?: string;
  setError: (error: string | undefined) => void;
}) => {
  const t = useDictionary();
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
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      return res;
    },
    onSuccess: (res: TResponse<TLoginWithGithubResponse>) => {
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
          <span className="text-base font-semibold">{t.login.Sign_in_with_Github}</span>
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
          className="gap-2 hover:bg-wtf-function-successBg rounded-full"
        >
          <Icons.check className="w-4 h-4" />
          <span>{t.login.Done}</span>
        </Button>
      )}

      {!isFinished && (
        <Button
          size="lg"
          className="space-x-3 rounded-full"
          onClick={() => handleSignInWithGitHub()}
          disabled={isPendingSignInWithGitHub}
        >
          {isPendingSignInWithGitHub ? (
            <Icons.loading className="animate-spin w-4 h-4" />
          ) : (
            <>
              <Icons.github />
              <span>{t.login.Sign_in}</span>
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
  const t = useDictionary();
  const [isFinished, setIsFinished] = useState(false);
  const { isConnected, address } = useAppKitAccount();
  const { setIsRegistering, refetchAuthUser } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { signMessage } = useSiwe();
  const { open } = useAppKit();

  const {
    mutate: signMessageAndBindWallet,
    error: errorSignMessageAndBindWallet,
    isError: isErrorSignMessageAndBindWallet,
    isPending: isPendingSignMessageAndBindWallet,
  } = useMutation({
    mutationFn: async () => {
      setError(undefined);
      const nonceResponse = await getNonceApi(address!);
      if (nonceResponse.code === 0) {
        const signature = await signMessage(nonceResponse.data.nonce, "Bind wallet to your github ID in WTF Academy.");
        const bindRes = await bindWalletApi({
          message: signature.data,
          signature: signature.signature,
        });
        if (bindRes.code !== 0) {
          throw new Error(bindRes.msg);
        }
        return bindRes;
      } else {
        throw new Error(nonceResponse.msg);
      }
    },
    onSuccess: () => {
      setIsFinished(true);
      setIsRegistering(false);
      refetchAuthUser();
      toast.success(t.login.Bind_wallet_successfully);
      close();
    },
    onError: (error: any) => {
      console.log("error: ", error);
      setError(error.message);
    },
  });

  const connectWallet = async () => {
    await open();
  };

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
              {t.login.Sign_Message} + {t.login.Bind_Wallet}
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
                  {errorSignMessageAndBindWallet?.message.split('\n')[0]}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        </div>

        {isFinished && (
          <Button
            size="lg"
            variant="success"
            className="gap-2 hover:bg-wtf-function-successBg rounded-full"
          >
            <Icons.check className="w-4 h-4" />
            <span>{t.login.Done}</span>
          </Button>
        )}

        {!isFinished && !isConnected && (
          <Button
            size="lg"
            className="space-x-3 rounded-full"
            variant={active ? "default" : "outline"}
            disabled={!active || isPendingSignMessageAndBindWallet}
            onClick={() => connectWallet()}
          >
            {isPendingSignMessageAndBindWallet ? (
              <Icons.loading className="animate-spin w-4 h-4" />
            ) : (
              <span>{t.login.Connect_Wallet}</span>
            )}
          </Button>
        )}

        {!isFinished && isConnected && (
          <Button
            size="lg"
            className="space-x-3 rounded-full"
            variant={active ? "default" : "outline"}
            disabled={!active || isPendingSignMessageAndBindWallet}
            onClick={() => signMessageAndBindWallet()}
          >
            {isPendingSignMessageAndBindWallet ? (
              <Icons.loading className="animate-spin w-4 h-4" />
            ) : (
              <span>{t.login.Sign_Bind}</span>
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
            {error.split('\n')[0]}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

const AuthSectionRegister = (props: AuthSectionRegisterProps) => {
  const t = useDictionary();
  const { updateStep, close } = props;
  const { disconnect } = useDisconnect();
  const { setIsRegistering, isRegistering } = useAuth();
  const [stepRegister, setStepRegister] = useState<STEP_REGISTER>(
    STEP_REGISTER.SignInWithGitHub
  );
  const [error, setError] = useState<string | undefined>(undefined);

  console.log("error: ", error);

  const backToLogin = async () => {
    if (isRegistering) {
      await disconnect();
      setIsRegistering(false);
      close();
    } else {
      await disconnect();
      updateStep(STEP.Login);
    }
  };

  const nextStep = () => {
    setStepRegister(STEP_REGISTER.SignMessageAndBindWallet);
  };

  return (
    <div className="flex flex-col gap-6 pt-8 pb-6">
      <div className="flex flex-col items-center gap-4 w-full">
        <Icons.logo className="h-10" />
        <p className="text-2xl font-bold leading-8">{t.login.Connect_to_your_GitHub}</p>
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
            {t.login.Cancel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthSectionRegister;

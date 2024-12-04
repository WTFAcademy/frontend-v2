"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Divider from "@/components/divider";
import useAuth from "@/features/auth/hooks/use-auth";
import {
  useAppKit,
  useAppKitAccount,
} from "@reown/appkit/react";
import { useEffect } from "react";
import { STEP } from ".";
import { getNonceApi, loginWithEthereumApi } from "../../api/use-auth-api";
import useSiwe from "../../hooks/use-siwe";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type AuthSectionLoginProps = {
  updateStep: (step: STEP) => void;
  close: () => void;
};

export const AuthSectionLogin = (props: AuthSectionLoginProps) => {
  const { updateStep, close } = props;
  const { signInWithGithub, setToken } = useAuth();
  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();
  const { signMessage } = useSiwe();

  const { mutate: loginWithEthereum, isPending } = useMutation({
    mutationFn: async () => {
      const nonceResponse = await getNonceApi(address!);
      if (nonceResponse.code === 200) {
        const signature = await signMessage(nonceResponse.data);
        return await loginWithEthereumApi({
          message: signature.data,
          signature: signature.signature,
        });
      } else {
        throw new Error(nonceResponse.msg);
      }
    },
    onSuccess: (res: any) => {
      setToken(res.data.token);
      close();
    },
    onError: (error: any) => {
      if (error.message === "record not found") {
        updateStep(STEP.Register);
      } else {
        toast.error("Login failed");
      }
    },
  });

  const { mutate: loginWithGithub, isPending: isPendingGithub } = useMutation({
    mutationFn: async () => {
      return await signInWithGithub();
    },
    onSuccess: (res: any) => {
      setToken(res.data.token);
      close();
    },
    onError: () => {
      toast.error("Login failed");
    },
  });

  const connectWallet = async () => {
    if (isConnected) {
      loginWithEthereum();
    } else {
      open();
    }
  };

  useEffect(() => {
    if (isConnected) {
      loginWithEthereum();
    }
  }, [isConnected, loginWithEthereum]);

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex flex-col items-center gap-4 w-full">
        <Icons.logo className="h-10" />
        <p className="text-2xl font-bold leading-8">Log in to WTF Academy</p>
      </div>
      <div className="flex flex-col items-center gap-4 w-full">
        <Button
          size="lg"
          className="w-full h-12 gap-3"
          onClick={() => loginWithGithub()}
        >
          {isPendingGithub ? (
            <Icons.loading className="animate-spin" />
          ) : (
            <>
              <Icons.github />
              <span className="text-base font-medium leading-6">
                Sign in with Github
              </span>
            </>
          )}
        </Button>
        <Divider>Or if your account is already connected to a wallet</Divider>
        <Button
          onClick={() => connectWallet()}
          variant="outline"
          className="flex h-12 w-full text-base font-medium leading-6"
          size="lg"
        >
          {isPending ? (
            <Icons.loading className="animate-spin" />
          ) : (
            "Sign in with Ethereum"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AuthSectionLogin;

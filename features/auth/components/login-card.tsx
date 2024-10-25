"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Divider from "@/components/divider";
import { WalletConnectButton } from "./wallet-connect-button";
import useAuth from "@/features/auth/hooks/use-auth";

export const LoginCard = () => {
  const { signInWithGithub } = useAuth();
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex flex-col items-center gap-4 w-full">
        <Icons.logo className="h-10" />
        <p className="text-2xl font-bold leading-8">Log in to WTF Academy</p>
      </div>
      <div className="flex flex-col items-center gap-4 w-full">
        <Button className="w-full h-12 gap-3" onClick={signInWithGithub}>
          <Icons.github />
          <span className="text-base font-medium leading-6">
            Sign in with Github
          </span>
        </Button>
        <Divider>Or if your account is already connected to a wallet</Divider>
        <WalletConnectButton />
      </div>
    </div>
  );
};

export default LoginCard;

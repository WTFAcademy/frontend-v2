"use client";

import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";

export const WalletConnectButton = () => {
  const { open } = useAppKit();

  return (
    <Button
      onClick={() => open()}
      variant="outline"
      className="flex h-12 w-full text-base font-medium leading-6"
    >
      Sign in with Ethereum
    </Button>
  );
};

export default WalletConnectButton;

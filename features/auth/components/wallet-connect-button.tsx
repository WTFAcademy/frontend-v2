"use client";

import { Button } from "@/components/ui/button";
import { useAppKit, useDisconnect } from "@reown/appkit/react";
import { useDictionary } from "@/features/lang";

export const WalletConnectButton = () => {
  const t = useDictionary();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();

  return (
    <Button
      onClick={async () => {
        await disconnect();
        open();
      }}
      variant="outline"
      className="flex h-12 w-full text-base font-medium leading-6"
    >
      {t.login.Sign_in_with_Ethereum}
    </Button>
  );
};

export default WalletConnectButton;

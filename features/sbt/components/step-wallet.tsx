import { Button } from "@/components/ui/button";
import { openAuthModal } from "@/features/auth/atoms/auth";
import useAuth from "@/features/auth/hooks/use-auth";
import { cn, formatAddress } from "@/lib/utils";
import { base } from "@reown/appkit/networks";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { useSetAtom } from "jotai";
import { ClaimStep } from "./claim-steppter";
import { useEffect } from "react";

const StepWallet = ({ active, nextStep }: { active: boolean; nextStep: (target?: ClaimStep) => void }) => {
  const { setIsRegistering, authUser } = useAuth();
  const setOpenAuthModal = useSetAtom(openAuthModal);
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const { chainId, switchNetwork } = useAppKitNetwork();

  const isFinish =
    authUser?.wallet_address &&
    authUser.wallet_address.toLowerCase() === address?.toLowerCase() &&
    chainId === base.id;

  const ActionButton = () => {
    if (!active && !isFinish) {
      return (
        <Button disabled variant="outline" className="rounded-full">
          Connect & Bind
        </Button>
      );
    }

    if (!isConnected) {
      return (
        <Button className="rounded-full" onClick={() => open()}>
          Connect & Bind
        </Button>
      );
    }

    if (isConnected && !authUser?.wallet_address) {
      return (
        <Button
          className="rounded-full"
          onClick={() => {
            setOpenAuthModal(true);
            setIsRegistering(true);
          }}
        >
          Bind
        </Button>
      );
    }

    if (
      isConnected &&
      authUser?.wallet_address?.toLowerCase() !== address?.toLowerCase()
    ) {
      return (
        <Button
          className="rounded-full"
          variant="destructive"
          onClick={() => open({ view: "Account" })}
        >
          切换钱包
        </Button>
      );
    }

    if (isConnected && chainId !== base.id) {
      return (
        <Button
          className="rounded-full"
          variant="destructive"
          onClick={() => switchNetwork(base)}
        >
          切换网络
        </Button>
      );
    }

    return (
      <Button variant="success" className="rounded-full">
        {formatAddress(address!)}
      </Button>
    );
  };

  useEffect(() => {
    if (isFinish) {
      nextStep(ClaimStep.MINT);
    } else {
      nextStep(ClaimStep.CONNECT_WALLET);
    }
  }, [isFinish]);

  return (
    <div className="h-20 w-full px-8 flex items-center justify-between border-y-[0.5px] border-wtf-border-divider -mt-[0.5px]">
      <div className="flex items-center gap-x-3">
        <span
          className={cn(
            "w-8 h-8 rounded-full inline-flex items-center justify-center bg-wtf-brand-1 text-white",
            isFinish && "bg-wtf-function-success"
          )}
        >
          2
        </span>
        <span>Connect the wallet</span>
      </div>

      <ActionButton />
    </div>
  );
};

export default StepWallet;

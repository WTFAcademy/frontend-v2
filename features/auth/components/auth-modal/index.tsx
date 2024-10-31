"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthCard from "./auth-card";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAppKitState } from "@reown/appkit/react";

export enum STEP {
  Login = "login",
  Register = "register",
  ChangeWallet = "change-wallet",
}

type TAuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AuthModal = ({
  open,
  onOpenChange,
}: TAuthModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { open: appKitOpen } = useAppKitState();
  const [step, setStep] = useState<STEP>(STEP.Login);

  const isCloseOnOverlayClick = appKitOpen || step !== STEP.Login;

  const updateStep = (step: STEP) => {
    setStep(step);
  };

  const close = () => {
    onOpenChange(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          closeOnOverlayClick={isCloseOnOverlayClick}
          className="flex flex-col p-0 w-[488px]"
        >
          <VisuallyHidden asChild>
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
            </DialogHeader>
          </VisuallyHidden>

          <AuthCard step={step} updateStep={updateStep} close={close} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent closeOnOverlayClick={isCloseOnOverlayClick}>
        <AuthCard step={step} updateStep={updateStep} close={close} />

        {step === STEP.Login && (
          <DrawerFooter className="pt-6 pb-8 border-t border-wtf-border-line">
            <DrawerClose asChild>
              <Button
                size="lg"
                variant="ghost"
                className="text-wtf-content-3 text-base"
                onClick={close}
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AuthModal;

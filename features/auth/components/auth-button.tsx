"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthCard from "./auth-card";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAppKitState, useDisconnect } from "@reown/appkit/react";
import useAuth from "../hooks/use-auth";

export enum STEP {
  Login = "login",
  Register = "register",
  ChangeWallet = "change-wallet",
}

export const AuthButton = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { open: appKitOpen } = useAppKitState();
  const [step, setStep] = useState<STEP>(STEP.Login);
  const { disconnect } = useDisconnect();
  const { setIsRegistering } = useAuth();

  const isCloseOnOverlayClick = appKitOpen || step !== STEP.Login;

  const updateStep = (step: STEP) => {
    setStep(step);
  };

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      setOpen(true);
    } else {
      await disconnect();
      setStep(STEP.Login);
      setIsRegistering(false);
      setOpen(false);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>Login</Button>
        </DialogTrigger>
        <DialogContent
          closeOnOverlayClick={isCloseOnOverlayClick}
          className="flex flex-col p-0 w-[488px]"
        >
          <VisuallyHidden asChild>
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
            </DialogHeader>
          </VisuallyHidden>

          <AuthCard step={step} updateStep={updateStep} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button>Login</Button>
      </DrawerTrigger>
      <DrawerContent closeOnOverlayClick={isCloseOnOverlayClick}>
        <AuthCard step={step} updateStep={updateStep} />

        {step === STEP.Login && (
          <DrawerFooter className="pt-6 pb-8 border-t border-wtf-border-line">
            <DrawerClose asChild>
              <Button
                size="lg"
                variant="ghost"
                className="text-wtf-content-3 text-base"
                onClick={() => handleOpenChange(false)}
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

export default AuthButton;

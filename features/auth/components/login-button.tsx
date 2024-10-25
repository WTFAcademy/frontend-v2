"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LoginCard from "./login-card";
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

export const LoginButton = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>登录</Button>
        </DialogTrigger>
        <DialogContent withoutClose className="flex flex-col">
          <VisuallyHidden asChild>
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
            </DialogHeader>
          </VisuallyHidden>

          <LoginCard />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>登录</Button>
      </DrawerTrigger>
      <DrawerContent>
        <LoginCard />

        <DrawerFooter className="pt-6 pb-8 border-t border-wtf-border-line">
          <DrawerClose asChild>
            <Button variant="ghost" className="text-wtf-content-3 text-base">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default LoginButton;

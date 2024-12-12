"use client";

import { useState } from "react";
import AuthModal from "./auth-modal";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/use-auth";
import UserAvatar from "@/features/user/components/user-avatar";
import { useDictionary } from "@/features/lang";

const AuthButton = ({ onAvatarClick }: { onAvatarClick?: () => void }) => {
  const t = useDictionary();
  const [open, setOpen] = useState(false);
  const { setIsRegistering, authUser } = useAuth();

  const handleAuthModalOpenChange = async (open: boolean) => {
    if (open) {
      setOpen(true);
    } else {
      setOpen(false);
      setIsRegistering(false);
    }
  };

  return (
    <>
      {authUser ? (
        <UserAvatar
          src={authUser.avatar}
          fallback={authUser.username?.[0]}
          onClick={onAvatarClick}
        />
      ) : (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {t.login.Login}
        </Button>
      )}
      {open && (
        <AuthModal open={open} onOpenChange={handleAuthModalOpenChange} />
      )}
    </>
  );
};

export default AuthButton;

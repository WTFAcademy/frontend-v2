"use client";

import { useState } from "react";
import AuthModal from "./auth-modal";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/use-auth";
import UserAvatar from "@/features/user/components/user-avatar";

const AuthButton = ({ onAvatarClick }: { onAvatarClick?: () => void }) => {
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
          Login
        </Button>
      )}
      {open && (
        <AuthModal open={open} onOpenChange={handleAuthModalOpenChange} />
      )}
    </>
  );
};

export default AuthButton;

import { useState } from "react";
import AuthModal from "./auth-modal";
import { Button } from "@/components/ui/button";
import { useDisconnect } from "wagmi";
import useAuth from "../hooks/use-auth";
import UserAvatar from "@/features/user/components/user-avatar";

const AuthButton = () => {
  const [open, setOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { setIsRegistering, authUser } = useAuth();

  const handleAuthModalOpenChange = async (open: boolean) => {
    if (open) {
      setOpen(true);
    } else {
      disconnect();
      setIsRegistering(false);
      setOpen(false);
    }
  };

  return (
    <>
      {authUser ? (
        <UserAvatar src={authUser.avatar} fallback={authUser.username?.[0]} />
      ) : (
        <Button onClick={() => setOpen(true)}>Login</Button>
      )}
      <AuthModal open={open} onOpenChange={handleAuthModalOpenChange} />
    </>
  );
};

export default AuthButton;

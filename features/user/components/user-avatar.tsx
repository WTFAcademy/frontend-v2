"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Jazzicon from "react-jazzicon";
import { useAccount } from "wagmi";

type TUserAvatarProps = {
  className?: string;
  src?: string;
  fallback?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | number;
};

const userAvatarVariants = cva("w-8 h-8", {
  variants: {
    size: {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-10 h-10",
    },
    defaultVariants: {
      size: "md",
    },
  },
});

const UserAvatar = ({ className, src, fallback, onClick, size = "md" }: TUserAvatarProps) => {
  const { address } = useAccount();
  const { authUser } = useAuth();
  const newAddress = fallback || authUser?.username || authUser?.wallet_address || address || "0x0000000000000000000000000000000000000000";
  const seed = parseInt(newAddress.slice(2, 10), 16);

  const avatarSrc = src || authUser?.avatar;

  return (
    // @ts-ignore
    <Avatar className={cn(userAvatarVariants({ size }), className)} onClick={onClick}>
      <AvatarImage src={avatarSrc} alt={fallback} />
      <AvatarFallback>
        <Jazzicon diameter={size === "sm" ? 24 : size === "lg" ? 40 : typeof size === "number" ? size : 32} seed={seed} />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

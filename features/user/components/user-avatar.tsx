import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type TUserAvatarProps = {
  className?: string;
  src: string;
  fallback: string;
};

const UserAvatar = ({ className, src, fallback }: TUserAvatarProps) => {
  return (
    <Avatar className={cn("w-8 h-8", className)}>
      <AvatarImage src={src} alt={fallback} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

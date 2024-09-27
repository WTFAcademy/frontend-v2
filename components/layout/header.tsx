import UserAvatar from "@/features/user/components/user-avatar";
import { Icons } from "../icons";
import { ModeToggle } from "../theme/mode-toggle";

const Header = () => {
  return (
    <header className="fixed z-50 top-4 inset-x-4 md:inset-x-10 rounded-full bg-wtf-bg-nav backdrop-blur-[20px] h-[60px] px-4 py-3 md:px-8 md:py-[18px] flex justify-between items-center">
      <div className="flex items-center gap-x-8">
        <Icons.logo className="w-[66px] h-6" />
      </div>
      <div className="flex items-center gap-x-2">
        <ModeToggle />
        <UserAvatar src="https://github.com/shadcn.png" fallback="@shadcn" />
      </div>
    </header>
  );
};

export default Header;

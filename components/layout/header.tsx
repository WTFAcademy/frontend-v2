'use client';

import UserAvatar from "@/features/user/components/user-avatar";
import { Icons } from "../icons";
import { ModeToggle } from "../theme/mode-toggle";
import { LoginButton } from "@/features/auth/components/login-button";
import useAuth from "@/features/auth/hooks/use-auth";

const Header = () => {
  const { data } = useAuth();
  console.log('data', data);
  return (
    <header className="fixed z-50 top-4 inset-x-0 px-4 md:px-10 4xl:px-[20rem] container">
      <div className="w-full rounded-full bg-wtf-bg-nav backdrop-blur-[20px] h-[60px] px-4 py-3 md:px-8 md:py-[18px] flex justify-between items-center">
        <div className="flex items-center gap-x-8">
          <Icons.logo className="w-[66px] h-6" />
        </div>
        <div className="flex items-center gap-x-2">
          <ModeToggle />
          {data ? <UserAvatar src={data.avatar_url} fallback={data.login} /> : <LoginButton />}
        </div>
      </div>
    </header>
  );
};

export default Header;

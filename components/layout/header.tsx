'use client';

import { Icons } from "../icons";
import { ModeToggle } from "../theme/mode-toggle";

import AuthButton from "@/features/auth/components/auth-button";

const Header = () => {
  return (
    <header className="fixed z-50 top-4 inset-x-0 px-4 md:px-10 4xl:px-[20rem] container">
      <div className="w-full rounded-full bg-wtf-background-navbar backdrop-blur-[20px] h-[60px] px-4 py-3 md:px-8 md:py-[18px] flex justify-between items-center">
        <div className="flex items-center gap-x-8">
          <Icons.logo className="w-[66px] h-6" />
        </div>
        <div className="flex items-center gap-x-2">
          <ModeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;

"use client";

import { Icons } from "../icons";
import { ModeToggle } from "../theme/mode-toggle";
import { LangToggle } from "./lang-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import useAuth from "@/features/auth/hooks/use-auth";
import { Close as SheetClose } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAvatar from "@/features/user/components/user-avatar";
import { shortWallet } from "@/features/user/utils/short-wallet";
import { CascaderPanel } from "../cascader-panel";
import CourseCascaderPanel from "@/features/course/components/course-cascader-panel";
import Sidebar from "./sidebar";
import AuthModal from "@/features/auth/components/auth-modal";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";
import { AnimatePresence, motion } from "framer-motion";
import { useDictionary } from "@/features/lang";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const options = [
  {
    label: "WTF Town",
    value: "https://wtf.town",
  },
  {
    label: "RescuEth",
    value: "https://rescu-eth-app.vercel.app/",
  },
];

const Header = () => {
  // @dev(daxiongya): 添加一个状态来追踪是否在客户端
  const [isMounted, setIsMounted] = React.useState(false);
  const { authUser, setIsRegistering, logout } = useAuth();
  const [openSheet, setOpenSheet] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const { isControlVisible } = useMobileReaderInteraction();
  const t = useDictionary();

  const handleAuthModalOpenChange = async (open: boolean) => {
    if (open) {
      setOpenLoginModal(true);
    } else {
      setOpenLoginModal(false);
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <header className="fixed z-50 top-4 inset-x-0 px-4 md:px-10 4xl:px-[20rem] container">
        <div className="w-full rounded-full bg-wtf-background-navbar backdrop-blur-[20px] h-[60px] px-4 py-3 md:px-8 md:py-[18px] flex justify-between items-center">
          <div className="flex items-center gap-x-8">
            <Icons.logo className="w-[66px] h-6" />
          </div>
        </div>
      </header>
    );
  }

  const handleSelect = (keys: string[]) => {
    window.location.href = keys[keys.length - 1];
  };

  return (
    <AnimatePresence>
      <motion.header
        className="fixed z-50 top-4 inset-x-0 px-4 md:px-10 4xl:px-[20rem] container"
        initial={{ y: 0 }}
        animate={{ y: isControlVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full rounded-full bg-wtf-background-navbar backdrop-blur-[20px] h-[60px] px-4 py-3 md:px-8 md:py-[18px] flex justify-between items-center">
          <div className="flex items-center gap-x-8">
            <Link href="/">
              <Icons.logo className="w-[66px] h-6" />
            </Link>

            <NavigationMenu className="hidden md:block">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>{t.index.Courses}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <Suspense fallback={<CascaderPanel.Skeleton />}>
                      <CourseCascaderPanel />
                    </Suspense>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>{t.index.Projects}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <CascaderPanel
                      options={options}
                      onSelect={handleSelect}
                      className="w-fit"
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/docs" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t.index.Forum}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/docs" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t.index.Shop}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/docs" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {t.index.About_us}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="hidden md:flex items-center gap-x-2">
            <LangToggle />
            <ModeToggle />
            {authUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="outline-none">
                  <div>
                    <UserAvatar
                      src={authUser.avatar}
                      fallback={authUser.username?.[0]}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[240px]"
                  align="end"
                  sideOffset={8}
                >
                  <div className="flex items-center gap-2 px-3 py-4 rounded-lg bg-wtf-background-block">
                    <UserAvatar size="lg" />
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-medium">
                        {authUser?.username}
                      </span>
                      {authUser?.wallet && (
                        <span className="text-xs text-wtf-content-3">
                          {shortWallet(authUser?.wallet)}
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="font-medium">
                      <Icons.wallet className="w-5 h-5 mr-2" />
                      {t.index.Bind_Wallet}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-medium">
                      <Icons.profile className="w-5 h-5 mr-2" />
                      {t.index.Personal_Center}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-wtf-function-error font-medium"
                    onClick={logout}
                  >
                    <Icons.logout className="w-5 h-5 mr-2" />
                    {t.index.Logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenLoginModal(true);
                }}
              >
                {t.index.Login}
              </Button>
            )}
          </div>
          <div className="flex md:hidden items-center gap-x-2">
            {authUser ? (
              <UserAvatar
                src={authUser.avatar}
                fallback={authUser.username?.[0]}
                onClick={() => setOpenSheet(true)}
              />
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenLoginModal(true);
                  }}
                >
                  {t.index.Login}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenSheet(true)}
                >
                  <Icons.menu className="w-5 h-5" />
                </Button>
              </>
            )}
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetContent className="w-[340px] p-0" withoutClose>
                <div className="flex justify-between items-center px-5 py-8">
                  <Icons.logo className="w-[66px] h-6" />
                  <SheetClose>
                    <Icons.close className="w-5 h-5" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>
                <div className="flex flex-col w-full">
                  <Sidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {openLoginModal && (
          <AuthModal
            open={openLoginModal}
            onOpenChange={handleAuthModalOpenChange}
          />
        )}
      </motion.header>
    </AnimatePresence>
  );
};

export default Header;

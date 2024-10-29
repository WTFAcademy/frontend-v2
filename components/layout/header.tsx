"use client";

import { Icons } from "../icons";
import { ModeToggle } from "../theme/mode-toggle";

import AuthButton from "@/features/auth/components/auth-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import React, { useState, useEffect } from "react";
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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

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
    label: "Solidity",
    value: "Solidity",
    children: [
      {
        label: "Solidity 101",
        value: "Solidity 101",
      },
      {
        label: "Solidity 102",
        value: "Solidity 102",
      },
      {
        label: "Solidity 103",
        value: "Solidity 103",
      },
    ],
  },
  {
    label: "Ethers",
    value: "Ethers",
    children: [
      {
        label: "Ethers 101",
        value: "Ethers 101",
      },
      {
        label: "Ethers 102",
        value: "Ethers 102",
      },

      {
        label: "Ethers 103",
        value: "Ethers 103",
      },
    ],
  },
  {
    label: "Web3",
    value: "Web3", 
    children: [
      {
        label: "Web3 101",
        value: "Web3 101",
      },
    ],
  },
  {
    label: "Layer2",
    value: "Layer2",
    children: [
      {
        label: "Layer2 101",
        value: "Layer2 101",
      },
      {
        label: "Layer2 102",
        value: "Layer2 102",
      },
      {
        label: "Layer2 103",
        value: "Layer2 103",
      },
    ]
  },
  {
    label: "Frontend",
    value: "Frontend",
    children: [
      {
        label: "Frontend 101",
        value: "Frontend 101",
      },
    ],
  },
  {
    label: "ZK",
    value: "ZK"
  },
];

const Header = () => {
  // @dev(daxiongya): 添加一个状态来追踪是否在客户端
  const [isMounted, setIsMounted] = React.useState(false);
  const { isLogin, authUser } = useAuth();
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

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

  return (
    <header className="fixed z-50 top-4 inset-x-0 px-4 md:px-10 4xl:px-[20rem] container">
      <div className="w-full rounded-full bg-wtf-background-navbar backdrop-blur-[20px] h-[60px] px-4 py-3 md:px-8 md:py-[18px] flex justify-between items-center">
        <div className="flex items-center gap-x-8">
          <Icons.logo className="w-[66px] h-6" />

          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <CascaderPanel
                    options={options}
                    onSelect={setSelectedKeys}
                    className="w-fit"
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <CascaderPanel
                    options={options}
                    onSelect={setSelectedKeys}
                    className="w-fit"
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Forum
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Shop
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden md:flex items-center gap-x-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="outline-none">
              <AuthButton onAvatarClick={() => setOpenSheet(true)} />
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
                  Bind Wallet
                </DropdownMenuItem>
                <DropdownMenuItem className="font-medium">
                  <Icons.profile className="w-5 h-5 mr-2" />
                  Personal Center
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-wtf-function-error font-medium">
                <Icons.logout className="w-5 h-5 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex md:hidden items-center gap-x-2">
          <AuthButton onAvatarClick={() => setOpenSheet(true)} />
          {!isLogin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenSheet(true)}
            >
              <Icons.menu className="w-5 h-5" />
            </Button>
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

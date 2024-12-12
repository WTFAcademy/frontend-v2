"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LangToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = pathname?.split('/')[1] || 'zh';
  
  const setLanguageCookie = (lang: string) => {
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`; // 保存一年
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          className="group rounded-full bg-wtf-background-navbar2 flex items-center gap-1"
        >
          <span>{currentLang === 'en' ? 'En' : '中文'}</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {
          setLanguageCookie('en');
          router.push(pathname.replace(currentLang, 'en'));
        }}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setLanguageCookie('zh');
          router.push(pathname.replace(currentLang, 'zh'));
        }}>
          中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

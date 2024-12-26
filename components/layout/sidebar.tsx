"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import NavItem, { NavSelectionItem, NavSwitchItem } from "../nav-item";
import {
  getCourseWithType,
} from "@/features/course/api/use-courses-api";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/features/lang";
import useAuth from "@/features/auth/hooks/use-auth";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = pathname?.split('/')[1] || 'zh';
  const [language, setLanguage] = useState(currentLang);
  const { setTheme, theme } = useTheme();
  const t = useDictionary();
  const { logout } = useAuth();

  const { data } = useSuspenseQuery({
    queryKey: ["coursesWithType"],
    queryFn: () => getCourseWithType(),
  });

  const courseItems = data.map(({name, list}) => {
    return {
      name,
      children: list.map((c) => ({
        name: c.title,
        url: `/course/${c.path}`,
      })),
    };
  });

  const handleLogout = () => {
    logout();
    // relaod
    window.location.reload();
  };

  return (
    <div className="flex flex-col w-full">
      <NavItem items={courseItems} groupName={t.mobile.Course} />
      <NavItem
        items={[
          {
            name: t.mobile.WTF_Town,
            url: "https://wtf.town",
          },
          {
            name: t.mobile.RescuETH,
            url: "https://rescue.wtf",
          },
        ]}
        groupName={t.mobile.Project}
      />
      <NavItem
        items={[]}
        groupName={t.mobile.Forum}
        url="/forum"
      />
      <NavItem
        items={[]}
        groupName={t.mobile.Shop}
        url="/shop"
      />
      <NavItem
        items={[]}
        groupName={t.mobile.About_us}
        url="/about"
      />
      <Separator className="my-4" />
      <NavSelectionItem
        options={[
          {
            label: t.mobile.English,
            value: "en",
          },
          {
            label: t.mobile.Chinese,
            value: "zh",
          },
        ]}
        groupName={t.mobile.Language}
        value={language}
        onChange={(value) => {
          setLanguage(value);
          document.cookie = `NEXT_LOCALE=${value};path=/;max-age=${60 * 60 * 24 * 365}`;
          router.push(pathname.replace(currentLang, value));
        }}
      />
      <NavSwitchItem
        groupName={t.mobile.Dark_Mode}
        value={theme === "dark"}
        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <Separator className="my-4" />
      <div className="relative z-20 flex flex-col mt-2">
        <div className="flex items-center py-[18.5px] px-5 cursor-pointer" onClick={handleLogout}>
          <div className="flex items-center gap-2 text-base font-medium text-wtf-function-error">
            <span>{t.index.Logout}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

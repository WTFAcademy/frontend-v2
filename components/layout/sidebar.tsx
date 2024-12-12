"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import NavItem, { NavSelectionItem, NavSwitchItem } from "../nav-item";
import {
  getCourseWithType,
  TCourse,
} from "@/features/course/api/use-courses-api";
import { get } from "lodash-es";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/features/lang";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = pathname?.split('/')[1] || 'zh';
  const [language, setLanguage] = useState(currentLang);
  const { setTheme, theme } = useTheme();
  const t = useDictionary();

  const { data } = useSuspenseQuery({
    queryKey: ["coursesWithType"],
    queryFn: () => getCourseWithType(),
  });

  const courseData = get(data, "data", {});
  const courseItems = Object.keys(courseData).map((type) => {
    const course: TCourse[] = get(courseData, type, []);
    return {
      name: type,
      children: course.map((c) => ({
        name: c.title,
        url: `/course/${c.path}`,
      })),
    };
  });

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
    </div>
  );
};

export default Sidebar;

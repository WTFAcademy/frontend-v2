"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import NavItem, { NavSelectionItem, NavSwitchItem } from "../nav-item";
import {
  getCourseWithType,
  TCourse,
} from "@/features/course/api/use-courses.api";
import { get } from "lodash-es";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useTheme } from "next-themes";

const Sidebar = () => {
  const [language, setLanguage] = useState("en");
  const { setTheme, theme } = useTheme();

  const { data } = useSuspenseQuery({
    queryKey: ["courses"],
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
      <NavItem items={courseItems} groupName="Course" />
      <NavItem
        items={[
          {
            name: "WTF Town",
            url: "https://wtf.town",
          },
          {
            name: "RescuETH",
            url: "https://rescue.wtf",
          },
        ]}
        groupName="Project"
      />
      <NavItem
        items={[]}
        groupName="Forum"
        url="/forum"
      />
      <NavItem
        items={[]}
        groupName="Shop"
        url="/shop"
      />
      <NavItem
        items={[]}
        groupName="About us"
        url="/about"
      />
      <Separator className="my-4" />
      <NavSelectionItem
        options={[
          {
            label: "English",
            value: "en",
          },
          {
            label: "Chinese",
            value: "zh",
          },
        ]}
        groupName="Language"
        value={language}
        onChange={setLanguage}
      />
      <NavSwitchItem
        groupName="Dark Mode"
        value={theme === "dark"}
        onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
    </div>
  );
};

export default Sidebar;

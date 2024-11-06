"use client";

import { ReactNode } from "react";

const ChapterMobileContainer = ({ children }: { children: ReactNode }) => {
  console.log(children);

  return <div className="relative flex-auto overflow-y-auto">{children}</div>;
};

export default ChapterMobileContainer;

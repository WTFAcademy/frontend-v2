import { ReactNode } from "react";

const CourseLayout = ({ children }: { children: ReactNode }) => {
  return <div className="w-full h-full pt-20 flex flex-col">{children}</div>;
};

export default CourseLayout;

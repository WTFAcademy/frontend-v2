import { ReactNode } from "react";

const CourseLayout = ({ children }: { children: ReactNode }) => {
  return <div className="w-full h-full flex flex-col">{children}</div>;
};

export default CourseLayout;

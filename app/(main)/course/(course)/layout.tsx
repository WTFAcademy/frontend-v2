import Footer from "@/components/layout/footer";
import CourseDetailHeader from "@/features/course/components/course-detail-header";
import { ReactNode } from "react";

const CourseDetailLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full pt-20 flex flex-col">
      <CourseDetailHeader />
      {children}
      <Footer />
    </div>
  );
};

export default CourseDetailLayout;

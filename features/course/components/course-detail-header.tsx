"use client";

import { Separator } from "@/components/ui/separator";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getCourseWithType, TCourse } from "../api/use-courses-api";
import { get } from "lodash-es";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const CourseDetailHeader = () => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);
  const path = usePathname();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(
    path.split("/").pop() || null
  );

  const { data } = useSuspenseQuery({
    queryKey: ["coursesWithType"],
    queryFn: () => getCourseWithType(),
  });

  const courseData = get(data, "data", {});
  const courseGroups = Object.keys(courseData).map((type) => {
    const courses: TCourse[] = get(courseData, type, []);
    return {
      type,
      courses,
    };
  });

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setShowLeftGradient(scrollLeft > 0);
    setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 40);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleSelectCourse = (path: string) => {
    setSelectedCourse(path);
    router.replace(`/course/${path}`);
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowRightGradient(scrollWidth > clientWidth);

    if (selectedCourse) {
      const selectedElement = scrollContainerRef.current.querySelector(
        `[data-path="${selectedCourse}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedCourse, data]);

  return (
    <div className="w-full relative px-8 py-4 border-b-[0.5px] border-wtf-border-divider">
      {showLeftGradient && (
        <div className="absolute left-0 top-0 bottom-0 w-24 [background:linear-gradient(270deg,rgba(249,250,251,0.00)_0%,#F9FAFB_63%)] dark:[background:linear-gradient(270deg,rgba(28,32,40,0.00)_0%,#1C2028_63%)] z-10 flex items-center justify-start px-4">
          <motion.button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-wtf-background-navButton hover:bg-wtf-background-navButtonHover"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full flex gap-x-5 overflow-x-auto scrollbar-hide px-2 py-1"
      >
        {courseGroups.map((group, groupIndex) => (
          <React.Fragment key={group.type}>
            <div key={group.type} className="flex flex-col flex-shrink-0">
              <div className="text-wtf-content-3 text-sm">{group.type}</div>
              <div className="flex items-center mt-[6px] gap-x-3">
                {group.courses.map((course) => (
                  <motion.div
                    key={course.path}
                    layoutId={`course-${course.path}`}
                    data-path={course.path}
                    onClick={() => handleSelectCourse(course.path)}
                    className={`w-[108px] h-[72px] bg-wtf-background-block rounded-sm cursor-pointer relative`}
                  >
                    <Image
                      src={course.cover_img}
                      alt={course.title}
                      fill
                      className="object-cover rounded-sm"
                    />
                    {/* 可以添加课程缩略图 */}
                    {selectedCourse === course.path && (
                      <motion.div
                        layoutId="tabs"
                        className="absolute inset-[-4px] z-40 border-[2px] border-wtf-content-1 rounded-md"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            {groupIndex < courseGroups.length - 1 && (
              <Separator
                orientation="vertical"
                className="h-[96px] flex-shrink-0"
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {showRightGradient && (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-24 [background:linear-gradient(90deg,rgba(249,250,251,0.00)_0%,#F9FAFB_63%)] dark:[background:linear-gradient(90deg,rgba(28,32,40,0.00)_0%,#1C2028_63%)] z-10 flex items-center justify-end px-4">
            <motion.button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-wtf-background-navButton hover:bg-wtf-background-navButtonHover"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseDetailHeader;

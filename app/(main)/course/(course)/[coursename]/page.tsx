"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import CourseDetailCard from "@/features/course/components/course-detail-card";
import ChapterList from "@/features/course/components/chapter-list";

const CourseDetailPage = ({ params }: { params: { coursename: string } }) => {
  console.log(params);

  return (
    <div className="flex md:flex-row flex-col border-b-[0.5px] border-wtf-border-divider">
      <div className="md:w-[480px] w-full p-10 border-r-[0.5px] border-wtf-border-divider">
        <CourseDetailCard />
      </div>
      <div className="md:flex-auto flex flex-col p-10 gap-6">
        <ChapterList />
      </div>
    </div>
  );
};

export default CourseDetailPage;

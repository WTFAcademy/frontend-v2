"use client";
import { useParams } from "next/navigation";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChapterError({ reset }: { reset: () => void }) {
  const { lang, coursename } = useParams<{
    lang: string;
    coursename: string;
  }>();
  const { reset: resetQuery } = useQueryErrorResetBoundary();
  const en = lang === "en";
  return (
    <section className="mx-auto mt-24 p-6" role="alert">
      <p>{en ? "Could not load this chapter." : "暂时无法加载本章。"}</p>
      <div className="mt-4 flex gap-4">
        <Button
          onClick={() => {
            resetQuery();
            reset();
          }}
        >
          {en ? "Retry" : "重试"}
        </Button>
        <Button asChild variant="outline">
          <Link href={`/${lang}/course/${coursename}`}>
            {en ? "Course outline" : "课程目录"}
          </Link>
        </Button>
      </div>
    </section>
  );
}

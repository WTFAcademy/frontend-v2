"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import useAuth from "@/features/auth/hooks/use-auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getChaptersByPath } from "../api/use-chapters-api";
import CourseLink from "@/components/course-link";
import { cn } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { chapterListAtom } from "../atoms/chapter";
import { getCourseDetailByPath } from "../api/use-courses-api";
import { useDictionary } from "@/features/lang";

const CourseSidebar = ({
  coursePath,
}: {
  coursePath: string;
}) => {
  const { authUser } = useAuth();
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const pathname = usePathname();
  const setChapterList = useSetAtom(chapterListAtom);
  const t = useDictionary();

  const { data: courseData } = useSuspenseQuery({
    queryKey: ["course", coursePath, lang, authUser?.id],
    queryFn: () => getCourseDetailByPath(coursePath),
  });

  const { data: chapterData } = useSuspenseQuery({
    queryKey: ["chapters", coursePath, lang, authUser?.id],
    queryFn: async () => {
      const res = await getChaptersByPath(coursePath, lang);
      return res?.data;
    },
  });

  useEffect(() => { setChapterList(chapterData?.list ?? []); }, [chapterData, setChapterList]);

  const course = courseData?.data || {};
  const chapters = chapterData?.list || [];

  const isActive = (routePath: string) => {
    return routePath === pathname.split("/").pop();
  };

  const handleBack = () => {
    router.push(`/${lang}/course/${coursePath}`);
  };

  return (
    <div className="w-[320px] 4xl:w-[400px] h-full overflow-hidden flex flex-col border-r-[0.5px] border-wtf-border-divider">
      <div className="flex flex-col h-full">
        <div className="px-6 pt-4">
          <Button variant="outline" onClick={() => handleBack()}>
            <Icons.arrowLeft className="w-4 h-4" />
            <span>{t.course.Back}</span>
          </Button>
        </div>
        <div className="px-6 pt-6 pb-4 text-wtf-content-1 text-2xl font-bold">
          {course.title}
        </div>

        <ScrollArea className="flex-auto flex flex-col overflow-y-auto">
          {chapters.map((chapter, index) => (
            <CourseLink
              key={chapter.path}
              href={`/course/${coursePath}/${chapter.path}`}
              className={cn(
                "relative flex justify-between items-center px-6 py-[14px] hover:bg-wtf-background-block cursor-pointer",
                isActive(chapter.path.split("/").pop() || "") &&
                  "bg-wtf-background-block"
              )}
            >
              {isActive(chapter.path.split("/").pop() || "") && (
                <div className="absolute left-0 top-0 w-[6px] h-full bg-wtf-brand-1" />
              )}
              <div>{index + 1}. {chapter.title}</div>
              {chapter.progress === 100 ? (
                <Icons.documentFinished className="w-6 h-6 text-wtf-function-success" />
              ) : chapter.progress === 0 ? (
                <Icons.documentUnread className="w-6 h-6 text-wtf-border-divider" />
              ) : (
                <Icons.documentPending className="w-6 h-6 text-wtf-brand-1" />
              )}
            </CourseLink>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default CourseSidebar;

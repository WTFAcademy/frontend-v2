"use client";

import Footer from "@/components/layout/footer";
import UserAvatar from "@/features/user/components/user-avatar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import UserCourseDisplayCard from "@/features/course/components/user-course-display-card";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserCourses } from "@/features/user/api/use-user-api";
import { formatAddress } from "@/lib/utils";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { openAuthModal } from "@/features/auth/atoms/auth";
import { useDictionary } from "@/features/lang";

const PersonalPage = () => {
  const { authUser, setIsRegistering } = useAuth();
  const setOpenLoginModal = useSetAtom(openAuthModal);
  const t = useDictionary();
  const { data: userCourses, isLoading: userCoursesLoading } = useSuspenseQuery(
    {
      queryKey: ["userCourses"],
      queryFn: () => getUserCourses(),
    }
  );

  return (
    <>
      <div id="personal" className="relative min-h-screen flex flex-col">
        <div id="personal-banner" className="absolute w-full h-[761px] md:h-[539px] inset-x-0 top-0 md:block opacity-60" />
        <section className="container relative z-10 container w-full flex flex-col">
          <div className="flex flex-col items-center px-4 md:px-10 pb-10">
            <div className="p-[5px] bg-white rounded-full w-fit mt-[135px]">
              <UserAvatar size={128} className="w-[128px] h-[128px]" />
            </div>
            <div className="mt-5 mb-6 text-[32px] font-bold">
              {authUser?.nickname || authUser?.username}
            </div>
            <div className="flex flex-col md:flex-row bg-wtf-background-navbar border-[0.5px] border-wtf-background-navbar2 backdrop-blur-[40px] rounded-2xl w-full min-h-[50px] p-8 gap-4">
              <div className="flex-1 flex flex-col gap-4">
                <p className="text-wtf-content-3">{authUser?.bio || t.personal.bio}</p>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-[10px]">
                    <Icons.github className="w-6 h-6 text-wtf-content-1" />
                    <span>
                      <Link
                        href={`https://github.com/${authUser?.username}`}
                        target="_blank"
                      >
                        {authUser?.username || "Github"}
                      </Link>
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <Icons.eth className="w-6 h-6 text-wtf-content-1" />
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          authUser?.wallet_address || ""
                        );
                        toast.success("Copied to clipboard");
                      }}
                    >
                      {formatAddress(authUser?.wallet_address || "")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  className={`${authUser?.wallet_address ? "hidden" : ""}`}
                  onClick={() => {
                    setOpenLoginModal(true);
                    setIsRegistering(true);
                  }}
                >
                  {t.personal.Bind_Wallet}
                </Button>
                <Link href="/settings">
                  <Button variant="secondary">{t.personal.Settings}</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="px-10 py-9 font-bold text-[24px] border-y-[0.5px] border-wtf-border-divider">
              {t.personal.My_Certificates}
            </div>
            {userCoursesLoading ? (
              <div>
                <UserCourseDisplayCard.Skeleton />
                <UserCourseDisplayCard.Skeleton />
                <UserCourseDisplayCard.Skeleton />
              </div>
            ) : !userCourses.data || userCourses.data.sbt.length === 0 ? (
              <div className="px-10 py-9 text-wtf-content-3 min-h-[160px]">
                {t.personal.You_have_not_obtained_any_certificates_yet}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5 mt-[-0.5px] border-y-[0.5px] border-wtf-border-divider">
                {userCourses.data.sbt.map((sbt) => (
                  <UserCourseDisplayCard
                    key={sbt.id}
                    title={sbt.title}
                    description={sbt.description}
                    path={`${sbt.path}`}
                    image={sbt.cover}
                    time={sbt.updated_at.split(" ")[0]}
                    isCompleted={true}
                  />
                ))}
              </div>
            )}
            <div className="px-10 py-9 font-bold text-[24px] border-y-[0.5px] border-wtf-border-divider mt-[-0.5px]">
              {t.personal.My_Courses}
            </div>
            {userCoursesLoading ? (
              <div>
                <UserCourseDisplayCard.Skeleton />
                <UserCourseDisplayCard.Skeleton />
                <UserCourseDisplayCard.Skeleton />
              </div>
            ) : !userCourses.data ||
                userCourses.data.completed.length +
                userCourses.data.ongoing.length ===
              0 ? (
              <div className="px-10 py-9 text-wtf-content-3 min-h-[160px] border-b-[0.5px] border-wtf-border-divider">
                {t.personal.You_have_not_started_any_course_yet}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5 mt-[-0.5px] border-y-[0.5px] border-wtf-border-divider">
                {userCourses.data.completed.map((course) => (
                  <UserCourseDisplayCard
                    key={course.id}
                    title={course.title}
                    description={course.description}
                    path={`${course.path}`}
                    image={course.cover}
                    time={course.updated_at.split(" ")[0]}
                    isCompleted={true}
                  />
                ))}
                {userCourses.data.ongoing.map((course) => (
                  <UserCourseDisplayCard
                    key={course.id}
                    title={course.title}
                    description={course.description}
                    path={`${course.path}`}
                    image={course.cover}
                    time={course.updated_at.split(" ")[0]}
                    isCompleted={false}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PersonalPage;

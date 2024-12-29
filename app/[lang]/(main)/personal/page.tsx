import Footer from "@/components/layout/footer";
import Image from "next/image";
import { getDictionary } from "../../dictionaries";
import { headers } from "next/headers";
import UserAvatar from "@/features/user/components/user-avatar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import UserCourseDisplayCard from "@/features/course/components/user-course-display-card";
import Link from "next/link";

const PersonalPage = async () => {
  const heads = headers();
  const lang = heads.get("x-current-lang");
  const t = await getDictionary(lang);

  return (
    <>
      <div id="personal" className="relative min-h-screen flex flex-col">
        <div className="absolute w-full h-[519px] inset-x-0 top-0 hidden md:block">
          <Image
            src="/images/personal-banner.png"
            alt="Personal Center Hero"
            fill
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute w-full h-full inset-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[-26.57%] via-[rgba(255,255,255,0)] via-0% to-white to-100% dark:from-[rgba(18,18,18,0)] dark:via-[rgba(18,18,18,0)]  dark:to-[rgba(18,18,18,1)]"></div>
        </div>
        <section className="container relative z-10 container w-full flex flex-col">
          <div className="flex flex-col items-center px-10 pb-10">
            <div className="p-[5px] bg-white rounded-full w-fit mt-[135px]">
              <UserAvatar size={128} className="w-[128px] h-[128px]" />
            </div>
            <div className="mt-5 mb-6 text-[32px] font-bold">Daxiongya</div>
            <div className="flex flex-col md:flex-row bg-wtf-background-navbar border border-wtf-background-navbar2 rounded-2xl w-full min-h-[50px] p-8">
              <div className="flex-1 flex flex-col gap-4">
                <p className="text-wtf-content-3">
                  The man was lazy and left nothing behind.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-[10px]">
                    <Icons.github className="w-6 h-6 text-wtf-content-1" />
                    <span>Github</span>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <Icons.eth className="w-6 h-6 text-wtf-content-1" />
                    <span>Wallet</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button>Bind Wallet</Button>
                <Link href="/settings">
                  <Button variant="secondary">Settings</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="px-10 py-9 font-bold text-[24px] border-y-[0.5px] border-wtf-border-divider">
              My Certificates
            </div>
            {/* <div className="px-10 py-9 text-wtf-content-3 min-h-[160px]">
              You have not obtained any certificates yet.
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5 mt-[-0.5px]">
              <UserCourseDisplayCard
                title="Course 1"
                description="Description 1"
                path="/course/1"
                image="/images/course-1.png"
                time="2022-01-01"
                isCompleted={false}
              />
            </div>

            <div className="px-10 py-9 font-bold text-[24px] border-y-[0.5px] border-wtf-border-divider mt-[-0.5px]">
              My Certificates
            </div>
            {/* <div className="px-10 py-9 text-wtf-content-3 min-h-[160px]">
              You have not started any course yet.
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-5 mt-[-0.5px]">
              <UserCourseDisplayCard
                title="Course 1"
                description="Description 1"
                path="/course/1"
                image="/images/course-1.png"
                time="2025-01-01"
                isCompleted={true}
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PersonalPage;

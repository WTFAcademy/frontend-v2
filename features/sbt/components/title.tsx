"use client";

import { Icons } from "@/components/icons";
import useAuth from "@/features/auth/hooks/use-auth";
import { TCourse } from "@/features/course/api/use-courses-api";
import { useDictionary } from "@/features/lang";

const Title = ({ course }: { course: TCourse }) => {
  const { isLogin } = useAuth();
  const t = useDictionary();

  const canMintSbt = course.progress === 100;
  const isClaimed = !!course.claim_address;

  if (!isLogin)
    return (
      <h1 className="text-center text-3xl font-bold">
        {t.sbt.title.login_first.replace("{course}", course.title)}
      </h1>
    );

  if (!canMintSbt) {
    return (
      <h1 className="text-center text-3xl font-bold">
        {t.sbt.title.complete_first.replace("{course}", course.title)}
      </h1>
    )
  }

  if (isClaimed) {
    return (
      <h1 className="text-center text-3xl font-bold">
        {t.sbt.title.already_claimed.replace("{course}", course.title)}
      </h1>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-wtf-function-success flex items-center justify-center">
          <Icons.check className="w-6 h-6 text-white" />
        </div>
        <span className="text-[28px] font-bold">{t.sbt.title.test_passed}</span>
      </div>
      <p className="text-[18px] font-medium">
        {t.sbt.title.congratulations.replace("{course}", course.title)}
      </p>
    </div>
  );
};

export default Title;

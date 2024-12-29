"use client";

import { Icons } from "@/components/icons";
import useAuth from "@/features/auth/hooks/use-auth";
import { TCourse } from "@/features/course/api/use-courses-api";

const Title = ({ course }: { course: TCourse }) => {
  const { user, isLogin } = useAuth();

  const canMintSbt = true;

  if (!isLogin)
    return (
      <h1 className="text-center text-3xl font-bold">
        请先登录再进行领取{course.title}认证NFT
      </h1>
    );

  if (canMintSbt) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-wtf-function-success flex items-center justify-center">
            <Icons.check className="w-6 h-6 text-white" />
          </div>
          <span className="text-[28px] font-bold">The test passed</span>
        </div>
        <p className="text-[18px] font-medium">
          Congratulations on getting the {course.title}-NFT certificate
        </p>
      </div>
    );
  }

  return (
    <h1 className="text-center text-[28px] font-bold">
      领取{course.title}认证NFT
    </h1>
  );
};

export default Title;

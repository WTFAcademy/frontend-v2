"use client";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { openAuthModal } from "@/features/auth/atoms/auth";
import useAuth from "@/features/auth/hooks/use-auth";
import { ManagementProvider, href } from "@/features/management/shared";
import { Courses } from "@/features/management/courses";
import { Users } from "@/features/management/users";
import "./styles.css";

export default function ManagementPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: string };
  searchParams: { course?: string; chapter?: string; tab?: string };
}) {
  const { authUser, isPendingAuthUser, isLogin } = useAuth(),
    open = useSetAtom(openAuthModal);
  const en = lang === "en",
    courses = authUser?.grants?.includes("course.list"),
    users = authUser?.grants?.includes("user.list");
  const showUsers = users && (searchParams.tab === "users" || !courses);
  return (
    <main className="ws mg">
      <Link className="ws-back" href={`/${lang}/personal`}>
        ← {en ? "Personal workspace" : "个人中心"}
      </Link>
      <h1>{en ? "Administration" : "管理后台"}</h1>
      {!authUser ? (
        isLogin && isPendingAuthUser ? (
          <p>…</p>
        ) : (
          <button onClick={() => open(true)}>
            {en ? "Sign in" : "登录 Academy"}
          </button>
        )
      ) : !courses && !users ? (
        <p>
          {en
            ? "This account has no management access."
            : "当前账号没有管理权限。"}
        </p>
      ) : (
        <ManagementProvider key={authUser.id} user={authUser} lang={lang}>
          <nav>
            {courses && (
              <Link
                aria-current={!showUsers ? "page" : undefined}
                href={href(lang)}
              >
                {en ? "Courses" : "课程管理"}
              </Link>
            )}
            {users && (
              <Link
                aria-current={showUsers ? "page" : undefined}
                href={href(lang) + "?tab=users"}
              >
                {en ? "Users and roles" : "用户与角色"}
              </Link>
            )}
          </nav>
          {showUsers ? (
            <Users />
          ) : (
            <Courses
              key={[searchParams.course, searchParams.chapter].join("/")}
              courseId={searchParams.course}
              chapterId={searchParams.chapter}
            />
          )}
        </ManagementProvider>
      )}
    </main>
  );
}

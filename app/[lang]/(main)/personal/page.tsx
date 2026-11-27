"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  FilePenLine,
  Github,
  GraduationCap,
  Layers3,
  Plus,
  Settings2,
  Wallet,
  ClipboardCheck,
} from "lucide-react";
import Footer from "@/components/layout/footer";
import UserAvatar from "@/features/user/components/user-avatar";
import useAuth from "@/features/auth/hooks/use-auth";
import { openAuthModal } from "@/features/auth/atoms/auth";
import { getUserCourses } from "@/features/user/api/use-user-api";
import { getChaptersByPath } from "@/features/course/api/use-chapters-api";
import { formatAddress } from "@/lib/utils";
import { revisions, statusName, unpack } from "@/features/workspace/api";

export default function PersonalPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { tab?: string };
}) {
  const lang = params.lang === "en" ? "en" : "zh",
    en = lang === "en";
  const t = (zh: string, english: string) => (en ? english : zh);
  const { authUser, isLogin, isPendingAuthUser, setIsRegistering } = useAuth();
  const open = useSetAtom(openAuthModal);
  const [tab, setTab] = useState<"learn" | "create" | "review">(
    searchParams.tab === "create" ? "create" : "learn"
  );
  const uid = authUser?.id;
  const courses = useQuery({
    queryKey: ["userCourses", uid, lang],
    enabled: !!uid,
    queryFn: async () => unpack(await getUserCourses()),
  });
  const work = useQuery({
    queryKey: ["workspace", uid, lang],
    enabled: !!uid,
    queryFn: () => revisions(lang),
  });
  const ongoing = [...(courses.data?.ongoing || [])].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at)
  );
  const latest = ongoing[0];
  const chapters = useQuery({
    queryKey: ["workspace-chapters", uid, lang, latest?.path],
    enabled: !!uid && !!latest,
    queryFn: async () => unpack(await getChaptersByPath(latest.path)).list,
  });
  const chapter = chapters.data?.find((row) => row.progress < 100);
  const courseURL = (path: string) =>
    `/${lang}/course/${encodeURIComponent(path)}`;
  const studio = (id: string | number) => `/${lang}/personal/studio/${id}`;
  const mine = work.data?.filter((r) => r.mine) || [],
    queue = work.data?.filter((r) => r.reviewable) || [];
  const checked = !!uid;
  const login = () => {
    setIsRegistering(false);
    open(true);
  };
  const retry = (again: () => void) => (
    <div className="ws-empty" role="alert">
      {t("暂时无法加载。", "Unable to load. ")}{" "}
      <button onClick={again}>{t("重试", "Try again")}</button>
    </div>
  );
  const visibleTab = tab === "review" && !queue.length ? "learn" : tab;
  const learning = visibleTab === "learn";
  const finished = courses.data?.completed || [],
    certificates = courses.data?.sbt || [];
  return (
    <>
      <div className="ws">
        <header className="ws-title">
          <div>
            <h1>{t("个人中心", "Personal workspace")}</h1>
          </div>
          {checked && (
            <Link className="ws-tool" href={`/${lang}/settings`}>
              <Settings2 size={16} />
              {t("账号设置", "Settings")}
            </Link>
          )}
        </header>
        <div className="ws-layout">
          <aside className="ws-sidebar">
            <div className="ws-id">
              <UserAvatar size={52} />
              <div>
                <strong>
                  {authUser?.nickname ||
                    authUser?.username ||
                    (isLogin && isPendingAuthUser
                      ? t("加载中…", "Loading…")
                      : t("访客", "Guest"))}
                </strong>
                {authUser && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://github.com/${encodeURIComponent(
                      authUser.username
                    )}`}
                  >
                    <Github size={13} />
                    {authUser.username}
                  </a>
                )}
              </div>
            </div>
            <nav className="ws-nav" aria-label={t("工作区", "Workspace")}>
              {(
                [
                  {
                    id: "learn",
                    label: t("我的学习", "Learning"),
                    icon: BookOpen,
                  },
                  {
                    id: "create",
                    label: t("我的创作", "Studio"),
                    icon: FilePenLine,
                  },
                  ...(queue.length
                    ? [
                        {
                          id: "review",
                          label: t("待我审核", "Review queue"),
                          icon: ClipboardCheck,
                        },
                      ]
                    : []),
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  aria-current={visibleTab === id ? "page" : undefined}
                  onClick={() => setTab(id as typeof tab)}
                >
                  <Icon size={18} />
                  {label}
                  <ChevronRight size={14} />
                </button>
              ))}
            </nav>
            {checked && (
              <div className="ws-wallet">
                <Wallet size={17} />
                {authUser.wallet_address ? (
                  <span>{formatAddress(authUser.wallet_address)}</span>
                ) : (
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      open(true);
                    }}
                  >
                    {t("绑定钱包", "Bind wallet")} <Plus size={13} />
                  </button>
                )}
              </div>
            )}
          </aside>
          <section className="ws-content">
            {learning ? (
              <>
                <div className="ws-hero">
                  <Image
                    src="/images/course-center-banner.jpg"
                    fill
                    priority
                    sizes="(max-width: 760px) 96vw, 900px"
                    alt=""
                  />
                  <div>
                    <span className="ws-label">
                      <GraduationCap size={15} />
                      {t("我的学习", "My learning")}
                    </span>
                    <h2>{latest?.title || t("开始学习", "Start learning")}</h2>
                    <p>
                      {latest
                        ? chapter?.title || t("课程目录", "Course overview")
                        : t(
                            "从开放课程中选择一个主题，开始你的第一章。",
                            "Explore the open course library and start your first chapter."
                          )}
                    </p>
                    <Link
                      className="ws-cta"
                      href={
                        latest
                          ? courseURL(latest.path) +
                            (chapter
                              ? "/" + encodeURIComponent(chapter.path)
                              : "")
                          : `/${lang}/course`
                      }
                    >
                      {latest
                        ? t("继续学习", "Continue learning")
                        : t("浏览课程", "Explore courses")}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
                <div className="ws-metrics">
                  {[
                    {
                      name: t("学习中", "In progress"),
                      value: ongoing.length,
                      icon: BookOpen,
                    },
                    {
                      name: t("已完成", "Completed"),
                      value: finished.length,
                      icon: Check,
                    },
                    {
                      name: t("已获证书", "Certificates"),
                      value: certificates.length,
                      icon: Award,
                    },
                  ].map(({ name, value, icon: Icon }) => (
                    <div key={name}>
                      <Icon size={17} />
                      <strong>{courses.data ? value : "—"}</strong>
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
                <div className="ws-heading">
                  <h2>{t("课程与证书", "Courses and certificates")}</h2>
                </div>
                {!checked ? (
                  isLogin && isPendingAuthUser ? (
                    <div className="ws-empty">
                      {t("正在加载账号…", "Loading your account…")}
                    </div>
                  ) : (
                    <div className="ws-empty">
                      <BookOpen />
                      <p>
                        {t(
                          "登录后查看课程进度和证书。",
                          "Sign in to see your courses and certificates."
                        )}
                      </p>
                      <button onClick={login}>
                        {t("登录 Academy", "Sign in to Academy")}
                      </button>
                    </div>
                  )
                ) : courses.isError ? (
                  retry(courses.refetch)
                ) : courses.isPending ? (
                  <div className="ws-empty">{t("加载中…", "Loading…")}</div>
                ) : ![...ongoing, ...finished, ...certificates].length ? (
                  <div className="ws-empty">
                    <BookOpen />
                    <p>{t("你还没有学习记录", "No courses started yet")}</p>
                    <Link href={`/${lang}/course`}>
                      {t("前往课程目录", "Explore the course library")} →
                    </Link>
                  </div>
                ) : (
                  <div className="ws-list">
                    {[
                      ...ongoing.map((c) => ({
                        c,
                        tag: t("学习中", "In progress"),
                        cert: false,
                      })),
                      ...finished.map((c) => ({
                        c,
                        tag: t("已完成", "Completed"),
                        cert: false,
                      })),
                      ...certificates.map((c) => ({
                        c,
                        tag: t("证书", "Certificate"),
                        cert: true,
                      })),
                    ].map(({ c, tag, cert }) => (
                      <Link
                        key={c.id + "-" + tag}
                        href={courseURL(c.path) + (cert ? "/sbt" : "")}
                      >
                        <div className="ws-icon">
                          {cert ? <Award /> : <BookOpen />}
                        </div>
                        <div>
                          <small>{tag}</small>
                          <strong>{c.title}</strong>
                        </div>
                        {!cert && (
                          <span className="ws-percent">{c.progress}%</span>
                        )}
                        <ArrowUpRight size={17} />
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="ws-studio-head">
                  <div className="ws-icon">
                    {visibleTab === "create" ? (
                      <FilePenLine />
                    ) : (
                      <ClipboardCheck />
                    )}
                  </div>
                  <h2>
                    {visibleTab === "create"
                      ? t("我的创作", "My studio")
                      : t("待我审核", "Review queue")}
                  </h2>
                  <p>
                    {visibleTab === "create"
                      ? t(
                          "撰写教程、管理草稿，跟进每一次投稿。",
                          "Write tutorials, return to your drafts and track submissions."
                        )
                      : t(
                          "查看课程的待审版本和投稿正文。",
                          "Read pending course submissions."
                        )}
                  </p>
                  {visibleTab === "create" &&
                    (checked ? (
                      <Link className="ws-cta" href={studio("new")}>
                        <Plus size={16} />
                        {t("创建教程", "Create tutorial")}
                      </Link>
                    ) : (
                      <button className="ws-cta" onClick={login}>
                        {t("登录后创作", "Sign in to create")}
                        <ArrowRight size={16} />
                      </button>
                    ))}
                </div>
                {checked && (
                  <>
                    <div className="ws-heading">
                      <h2>
                        {visibleTab === "create"
                          ? t("我的投稿", "My submissions")
                          : t("待审核版本", "Pending revisions")}
                      </h2>
                    </div>
                    {work.isError ? (
                      retry(work.refetch)
                    ) : work.isPending ? (
                      <div className="ws-empty">{t("加载中…", "Loading…")}</div>
                    ) : !(visibleTab === "create" ? mine : queue).length ? (
                      <div className="ws-empty">
                        <Layers3 />
                        <p>{t("还没有投稿", "No submissions yet")}</p>
                        <span>
                          {t(
                            "网页和 CLI 提交的教程都会出现在这里。",
                            "Tutorials submitted here or with the CLI appear here."
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="ws-list">
                        {(visibleTab === "create" ? mine : queue).map((r) => (
                          <Link key={r.id} href={studio(r.id)}>
                            <div className="ws-icon">
                              <FilePenLine />
                            </div>
                            <div>
                              <small>
                                {statusName(r.status, en)} ·{" "}
                                {r.created_at.slice(0, 10)}
                              </small>
                              <strong>{r.title}</strong>
                            </div>
                            <span className="ws-percent">
                              {r.editable
                                ? t("继续编辑", "Edit draft")
                                : t("查看", "View")}
                            </span>
                            <ArrowUpRight size={16} />
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

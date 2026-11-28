"use client";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { openAuthModal } from "@/features/auth/atoms/auth";
import useAuth from "@/features/auth/hooks/use-auth";
import { getQuizzes } from "@/features/quiz/api/use-quiz-api";
import QuizListForm from "@/features/quiz/components/quiz-list-form";

type Params = { lang: string; coursename: string; chaptername: string };
export default function QuizPage({ params }: { params: Params }) {
  const { authUser, isLogin, isPendingAuthUser } = useAuth();
  const open = useSetAtom(openAuthModal);
  return (
    <Attempt
      key={JSON.stringify([
        params.lang,
        params.coursename,
        params.chaptername,
        authUser?.id,
      ])}
      {...params}
      ready={!!authUser}
      loading={isLogin && isPendingAuthUser}
      login={() => open(true)}
    />
  );
}
function Attempt({
  lang,
  coursename,
  chaptername,
  ready,
  loading,
  login,
}: Params & { ready: boolean; loading: boolean; login: () => void }) {
  const en = lang === "en",
    chapter = `/${lang}/course/${coursename}/${chaptername}`;
  const start = useMutation({
    mutationFn: () => getQuizzes(coursename, chaptername),
    retry: false,
  });
  const quiz = start.data;
  return (
    <main className="mx-auto mt-20 w-full max-w-3xl px-4 py-8 md:py-12">
      <Link className="text-sm underline underline-offset-4" href={chapter}>
        ← {quiz?.chapter.title || (en ? "Back to chapter" : "返回章节")}
      </Link>
      <h1 className="mb-2 mt-6 text-3xl font-bold">
        {en ? "Chapter quiz" : "章节测验"}
      </h1>
      {quiz ? (
        <QuizListForm quiz={quiz} lang={lang} />
      ) : (
        <section className="mt-6 rounded-xl border border-wtf-border-outline p-6">
          <p className="mb-6">
            {en
              ? "Answer every question to check your understanding. Get them all right to complete the chapter."
              : "答完后可查看错题并修改答案。全部答对即可完成本章。"}
          </p>
          {start.error && (
            <p role="alert" className="mb-4">
              {start.error.message.includes("No quiz found")
                ? en
                  ? "No questions are available in this language yet."
                  : "本章当前语言还没有题目。"
                : en
                ? "Could not load the quiz. Please retry."
                : "无法加载测验，请重试。"}
            </p>
          )}
          <Button
            disabled={loading || start.isPending}
            onClick={() => (ready ? start.mutate() : login())}
          >
            {loading || start.isPending
              ? "…"
              : ready
              ? en
                ? "Start quiz"
                : "开始答题"
              : en
              ? "Sign in to start"
              : "登录后答题"}
          </Button>
        </section>
      )}
    </main>
  );
}

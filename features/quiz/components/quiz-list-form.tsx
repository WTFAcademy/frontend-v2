"use client";
import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Markdown from "@/features/mdx/components/markdown";
import { Button } from "@/components/ui/button";
import { submitQuiz, TQuizResponse } from "../api/use-quiz-api";

export default function QuizListForm({
  quiz,
  lang,
}: {
  quiz: TQuizResponse;
  lang: string;
}) {
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [edited, setEdited] = useState<number[]>([]);
  const cache = useQueryClient();
  const grade = useMutation({
    mutationFn: () =>
      submitQuiz(
        quiz,
        quiz.list.map(({ id }) => ({ id, selects: answers[id] || [] }))
      ),
    onSuccess: () => {
      setEdited([]);
      for (const key of [
        "chapter",
        "chapters",
        "course",
        "userCourses",
        "workspace-chapters",
      ])
        void cache.invalidateQueries({ queryKey: [key] });
    },
  });
  const result = grade.data;
  const en = lang === "en";
  const done = quiz.list.filter((q) => answers[q.id]?.length).length;
  const total = quiz.list.length;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (done === total && !grade.isPending) grade.mutate();
      }}
    >
      <div className="mb-8 mt-3">
        <p aria-live="polite">
          {en ? `${done} of ${total} answered` : `已答 ${done} / ${total} 题`}
        </p>
        <progress
          className="mt-2 h-2 w-full accent-wtf-brand-1"
          value={done}
          max={total}
        />
      </div>
      {quiz.list.map((q, i) => {
        const picks = answers[q.id] || [],
          single = q.meta.type === "select",
          inset = q.meta.type === "inset";
        const missed = result?.incorrect_ids.includes(q.id);
        const options = q.content.options || [];
        let blank = 0;
        const passage = (q.content.extend || [])
          .map((x) => x.raw)
          .join("\n")
          .replace(/<<!!>>/g, () => {
            const pick = picks[blank++];
            return options.find((o) => o.value === pick)?.label || "_____";
          });
        return (
          <fieldset
            key={q.id}
            disabled={grade.isPending || result?.errors === 0}
            className="mb-6 min-w-0 rounded-xl border border-wtf-border-outline p-5 md:p-7"
          >
            <legend className="px-2 text-sm font-semibold">
              {en ? `Question ${i + 1}` : `第 ${i + 1} 题`} ·{" "}
              {inset
                ? en
                  ? "Fill in order"
                  : "按顺序填空"
                : single
                ? en
                  ? "Single choice"
                  : "单选"
                : en
                ? "Multiple choice"
                : "多选"}
            </legend>
            <Markdown mode="quiz">{q.title}</Markdown>
            {passage && <Markdown>{passage}</Markdown>}
            <div className="mt-4 grid gap-2">
              {options.map((o) => {
                const checked = picks.includes(o.value);
                return (
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 focus-within:ring-2 ${
                      checked
                        ? "border-wtf-brand-1 bg-wtf-function-brandBg"
                        : "border-wtf-border-outline"
                    }`}
                  >
                    <input
                      type={single ? "radio" : "checkbox"}
                      name={`q-${q.id}`}
                      checked={checked}
                      className="mt-1.5 shrink-0"
                      onChange={() => {
                        setEdited((prev) =>
                          prev.includes(q.id) ? prev : [...prev, q.id]
                        );
                        setAnswers((old) => ({
                          ...old,
                          [q.id]: single
                            ? [o.value]
                            : checked
                            ? picks.filter((v) => v !== o.value)
                            : [...picks, o.value],
                        }));
                      }}
                    />
                    <div className="min-w-0">
                      <Markdown mode="quiz">{o.label}</Markdown>
                    </div>
                  </label>
                );
              })}
            </div>
            {result && !edited.includes(q.id) && (
              <p className="mt-4 font-medium">
                {missed
                  ? en
                    ? "Review this answer"
                    : "这道题需要再想想"
                  : en
                  ? "Correct"
                  : "答对了"}
                {result.explanations?.[q.id] &&
                  ` · ${result.explanations[q.id]}`}
              </p>
            )}
          </fieldset>
        );
      })}
      <div className="mb-12 space-y-4" aria-live="polite">
        {grade.error && (
          <p role="alert">
            {en
              ? "Submission failed. Your answers are still here."
              : "提交失败，已保留你的答案，可再次提交。"}
          </p>
        )}
        {result && edited.length === 0 && (
          <p className="text-lg font-bold">
            {result.errors === 0
              ? en
                ? "Chapter complete"
                : "本章已完成"
              : en
              ? `${
                  total - result.errors
                } / ${total} correct. Review the marked questions.`
              : `答对 ${
                  total - result.errors
                } / ${total} 题，请查看上方标记的错题。`}
          </p>
        )}
        {result?.errors === 0 ? (
          <Button asChild>
            <Link
              href={`/${lang}/course/${quiz.course.path}/${quiz.chapter.path}`}
            >
              {en ? "Return to chapter" : "返回章节"}
            </Link>
          </Button>
        ) : (
          <Button type="submit" disabled={done !== total || grade.isPending}>
            {grade.isPending ? "…" : en ? "Check answers" : "提交答案"}
          </Button>
        )}
      </div>
    </form>
  );
}

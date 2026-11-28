import { useState } from "react";
import { adminRequest, Load, useAdmin, useManagement } from "./shared";
type Choice = {
  title: string;
  meta: { type: string; score: number; answer: string[]; explanation?: string };
  content: {
    extend: { type: string; raw: string }[];
    options: { label: string; value: string }[];
  };
};
type QuizSet = { lang: string; choices: Choice[] };
export function QuizEditor({
  path,
  languages,
  editable,
}: {
  path: string;
  languages: string[];
  editable: boolean;
}) {
  const { t } = useManagement(),
    q = useAdmin<QuizSet[] | null>(path, "quiz.choice.list");
  if (q.isPending || q.isError) return <Load query={q} />;
  const rows = q.data || [],
    langs = Array.from(new Set([...languages, ...rows.map((r) => r.lang)]));
  return (
    <section>
      <h2>{t("章节测验", "Chapter quiz")}</h2>
      {langs.map((l) => (
        <QuizLanguage
          key={l}
          lang={l}
          path={path}
          initial={rows.find((r) => r.lang === l)?.choices || []}
          editable={editable}
        />
      ))}
    </section>
  );
}
function QuizLanguage({
  lang,
  path,
  initial,
  editable,
}: {
  lang: string;
  path: string;
  initial: Choice[];
  editable: boolean;
}) {
  const { t, busy, run } = useManagement(),
    [choices, setChoices] = useState(initial);
  function change(i: number, c: Choice) {
    setChoices(choices.map((entry, n) => (n === i ? c : entry)));
  }
  return (
    <details>
      <summary>
        {lang} · {choices.length}
      </summary>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => {
            for (const c of choices) {
              if (
                !c.meta.answer?.length ||
                c.meta.answer.some((a) => !a.trim())
              )
                throw Error(
                  t("每题都需要答案", "Each question needs an answer")
                );
              if (
                c.meta.type === "select" ||
                c.meta.type === "multiple-select"
              ) {
                const opts = (c.content?.options || []).map((o) =>
                  o.value.trim().toLowerCase()
                );
                if (
                  !opts.length ||
                  new Set(opts).size !== opts.length ||
                  c.meta.answer.some(
                    (a) => !opts.includes(a.trim().toLowerCase())
                  )
                )
                  throw Error(
                    t(
                      "答案必须对应唯一的选项编号",
                      "Answers must match unique option IDs"
                    )
                  );
                if (c.meta.type === "select" && c.meta.answer.length !== 1)
                  throw Error(
                    t(
                      "单选题只能有一个答案",
                      "Single-choice requires one answer"
                    )
                  );
              }
            }
            await adminRequest(path, "POST", { details: [{ lang, choices }] });
          });
        }}
      >
        <fieldset disabled={!editable || busy}>
          {choices.map((c, i) => (
            <section key={i}>
              <label>
                {t("题目", "Question")} {i + 1}
                <textarea
                  required
                  aria-label={t("题目", "Question") + " " + (i + 1)}
                  value={c.title}
                  onChange={(e) => change(i, { ...c, title: e.target.value })}
                />
              </label>
              {(c.content?.extend || []).map((part, j) => (
                <label key={j}>
                  {t("题干正文", "Question passage")} {j + 1}
                  <textarea
                    value={part.raw}
                    onChange={(e) =>
                      change(i, {
                        ...c,
                        content: {
                          ...c.content,
                          extend: c.content.extend.map((v, k) =>
                            k === j ? { ...v, raw: e.target.value } : v
                          ),
                        },
                      })
                    }
                  />
                </label>
              ))}
              <button
                type="button"
                onClick={() =>
                  change(i, {
                    ...c,
                    content: {
                      ...c.content,
                      extend: [
                        ...(c.content?.extend || []),
                        { type: "paragraph", raw: "" },
                      ],
                    },
                  })
                }
              >
                {t("添加题干段落", "Add question passage")}
              </button>
              <div className="grid">
                <label>
                  {t("题型", "Type")}
                  <select
                    value={c.meta.type}
                    onChange={(e) =>
                      change(i, {
                        ...c,
                        meta: { ...c.meta, type: e.target.value },
                      })
                    }
                  >
                    {Array.from(
                      new Set([
                        c.meta.type,
                        "select",
                        "multiple-select",
                        "inset",
                      ])
                    ).map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {t("分值", "Score")}
                  <input
                    type="number"
                    min={0}
                    value={c.meta.score}
                    onChange={(e) =>
                      change(i, {
                        ...c,
                        meta: { ...c.meta, score: Number(e.target.value) },
                      })
                    }
                  />
                </label>
              </div>
              {(c.content?.options || []).map((o, j) => (
                <div className="grid" key={j}>
                  {(["value", "label"] as const).map((k) => (
                    <label key={k}>
                      {k === "value"
                        ? t("选项编号", "Option ID")
                        : t("选项内容", "Option text")}
                      <input
                        required
                        value={o[k]}
                        onChange={(e) =>
                          change(i, {
                            ...c,
                            content: {
                              ...c.content,
                              options: c.content.options.map((opt, n) =>
                                n === j ? { ...opt, [k]: e.target.value } : opt
                              ),
                            },
                          })
                        }
                      />
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      change(i, {
                        ...c,
                        content: {
                          ...c.content,
                          options: c.content.options.filter((_, n) => n !== j),
                        },
                      })
                    }
                  >
                    {t("移除选项", "Remove option")}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  change(i, {
                    ...c,
                    content: {
                      ...c.content,
                      options: [
                        ...(c.content?.options || []),
                        { label: "", value: "" },
                      ],
                    },
                  })
                }
              >
                {t("添加选项", "Add option")}
              </button>
              <label>
                {t("答案（每行一个）", "Answers (one per line)")}
                <textarea
                  required
                  aria-label={t("答案（每行一个）", "Answers (one per line)")}
                  value={(c.meta.answer || []).join("\n")}
                  onChange={(e) =>
                    change(i, {
                      ...c,
                      meta: { ...c.meta, answer: e.target.value.split("\n") },
                    })
                  }
                />
              </label>
              <label>
                {t("解析", "Explanation")}
                <textarea
                  value={c.meta.explanation || ""}
                  onChange={(e) =>
                    change(i, {
                      ...c,
                      meta: { ...c.meta, explanation: e.target.value },
                    })
                  }
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (confirm(t("移除此题？", "Remove this question?")))
                    setChoices(choices.filter((_, n) => i !== n));
                }}
              >
                {t("移除题目", "Remove question")}
              </button>
            </section>
          ))}
          {editable && (
            <div className="actions">
              <button
                type="button"
                onClick={() =>
                  setChoices([
                    ...choices,
                    {
                      title: "",
                      meta: { type: "select", score: 1, answer: [] },
                      content: {
                        extend: [],
                        options: [
                          { value: "a", label: "" },
                          { value: "b", label: "" },
                        ],
                      },
                    },
                  ])
                }
              >
                {t("添加题目", "Add question")}
              </button>
              <button>{t("保存测验", "Save quiz")}</button>
            </div>
          )}
        </fieldset>
      </form>
    </details>
  );
}

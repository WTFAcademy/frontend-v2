"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import {
  ArrowLeft,
  FilePenLine,
  ImagePlus,
  Save,
  Send,
  Upload,
} from "lucide-react";
import { zipSync, unzipSync, strFromU8, strToU8 } from "fflate";
import useAuth from "@/features/auth/hooks/use-auth";
import { openAuthModal } from "@/features/auth/atoms/auth";
import {
  detail,
  getPackage,
  reviewRevision,
  savePackage,
  statusName,
  submit,
} from "@/features/workspace/api";

import { quizExample, quizGuide } from "@/features/quiz/authoring";

type Files = Record<string, Uint8Array>;
const firstFile = "chapters/intro/zh.md";
const markdownFiles = (files: Files) =>
  Object.keys(files)
    .filter((n) => /^chapters\/[^/]+\/[a-zA-Z-]+\.md$/.test(n))
    .sort();
function readZip(raw: ArrayBuffer) {
  let total = 0;
  if (raw.byteLength > 64 * 1024 * 1024) throw Error("ZIP > 64 MB");
  return unzipSync(new Uint8Array(raw), {
    filter: (f) => {
      total += f.originalSize;
      if (
        total > 64 * 1024 * 1024 ||
        f.name.split("/").some((part) => part === "..") ||
        f.name.startsWith("/")
      )
        throw Error("Invalid course ZIP");
      return !f.name.endsWith("/");
    },
  });
}
function errorText(e: unknown) {
  const err = e as { response?: { data?: { msg?: string } }; message?: string };
  return err.response?.data?.msg || err.message || "Request failed";
}
export default function StudioPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const { authUser, isLogin, isPendingAuthUser } = useAuth();
  const open = useSetAtom(openAuthModal);
  if (!authUser)
    return (
      <div className="ws">
        <div className="ws-empty">
          {isLogin && isPendingAuthUser ? (
            "…"
          ) : (
            <button onClick={() => open(true)}>
              {params.lang === "en" ? "Sign in to Academy" : "登录 Academy"}
            </button>
          )}
        </div>
      </div>
    );
  return (
    <Editor key={authUser.id + ":" + params.id} {...params} uid={authUser.id} />
  );
}
function Editor({ lang, id, uid }: { lang: string; id: string; uid: number }) {
  const en = lang === "en",
    t = (zh: string, english: string) => (en ? english : zh);
  const isNew = id === "new",
    router = useRouter(),
    cache = useQueryClient();
  const [title, setTitle] = useState(""),
    [slug, setSlug] = useState(""),
    [text, setText] = useState("");
  const [files, setFiles] = useState<Files>({}),
    [selected, select] = useState(firstFile),
    [dirty, mark] = useState(false);
  const [problem, setProblem] = useState("");
  const upload = useRef<HTMLInputElement>(null),
    imageFile = useRef<HTMLInputElement>(null),
    markdownFile = useRef<HTMLInputElement>(null);
  const q = useQuery({
    queryKey: ["workspace-detail", uid, id, lang],
    enabled: !isNew && /^\d+$/.test(id),
    queryFn: () => detail(id, lang),
  });
  const row = q.data?.revision,
    editing = isNew || !!row?.editable;
  const source = useQuery({
    queryKey: ["workspace-source", uid, id],
    enabled: !!row?.editable,
    queryFn: async () => readZip(await getPackage(id)),
    staleTime: Infinity,
  });
  function chapterParts(data: Uint8Array) {
    const raw = strFromU8(data);
    const header = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)?.[0] || "";
    return { header, body: raw.slice(header.length) };
  }
  function editedChapter() {
    return strToU8(
      (files[selected] ? chapterParts(files[selected]).header : "") + text
    );
  }
  function loadFiles(data: Files) {
    const file = markdownFiles(data)[0];
    if (!file || !data["course.yaml"])
      throw Error(
        t(
          "需要包含 course.yaml 和章节 Markdown 的课程包。",
          "Include course.yaml and chapter Markdown in the ZIP."
        )
      );
    setFiles(data);
    select(file);
    setText(chapterParts(data[file]).body);
  }
  useEffect(() => {
    if (source.data) {
      try {
        loadFiles(source.data);
      } catch (e) {
        setProblem(errorText(e));
      }
    }
    // Immutable revision IDs identify the original package.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.data]);
  const isPackage = !!files["course.yaml"];
  const quizPath =
    selected.slice(0, selected.lastIndexOf("/") + 1) + "quiz.yaml";
  const chapterLang = selected.split("/").pop()!.replace(/\.md$/, "");
  const quizText = files[quizPath] ? strFromU8(files[quizPath]) : "";
  const [copied, setCopied] = useState(false);
  function changeQuiz(value: string) {
    setFiles((old) => {
      const next = { ...old };
      if (value.trim()) next[quizPath] = strToU8(value);
      else delete next[quizPath];
      return next;
    });
    mark(true);
  }
  const pendingSource = !!row?.editable && !isPackage;
  function packed() {
    const data = { ...files };
    if (!isPackage) {
      if (
        !title.trim() ||
        !text.trim() ||
        !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
      )
        throw Error(
          t(
            "请填写标题、正文和英文短链接。",
            "Enter a title, Markdown and a lowercase course slug."
          )
        );
      data["course.yaml"] = strToU8(
        JSON.stringify({
          path: slug,
          detail: {
            zh: { title: title.trim() },
          },
        })
      );
      const initial = firstFile;
      data[initial] = strToU8(
        "---\ntitle: " +
          JSON.stringify(title.trim()) +
          "\nsort: 1\n---\n" +
          text
      );
    } else data[selected] = editedChapter();
    return zipSync(data, { level: 0 });
  }
  const action = useMutation({
    mutationFn: async (kind: "save" | "submit") => {
      let current = id;
      if (isNew || dirty) {
        current = String((await savePackage(packed(), row?.id)).id);
      }
      if (kind === "submit") {
        try {
          return await submit(current);
        } catch (err) {
          if (current !== id)
            router.replace(`/${lang}/personal/studio/${current}`);
          throw err;
        }
      }
      return { id: Number(current) };
    },
    onSuccess: async (result) => {
      await Promise.all([
        cache.invalidateQueries({ queryKey: ["workspace", uid] }),
        cache.invalidateQueries({ queryKey: ["workspace-detail", uid, id] }),
      ]);
      mark(false);
      router.replace(`/${lang}/personal/studio/${result.id}`);
    },
    onError: (e) => setProblem(errorText(e)),
  });
  const review = useMutation({
    mutationFn: async (decision: "approve" | "revert") => {
      if (!row) throw Error(t("版本不可用", "Revision unavailable"));
      return reviewRevision(row, decision);
    },
    onSuccess: (result) => {
      if (result.status === "reverted" && !row?.mine) {
        router.replace(`/${lang}/personal?tab=review`);
      }
    },
    onError: (e) => setProblem(errorText(e)),
    onSettled: () =>
      Promise.all([
        cache.invalidateQueries({ queryKey: ["workspace", uid] }),
        cache.invalidateQueries({ queryKey: ["workspace-detail", uid, id] }),
      ]),
  });
  function confirmReview(decision: "approve" | "revert") {
    if (!row || review.isPending) return;
    const question =
      decision === "approve"
        ? t("确认发布这个版本？", "Publish this revision?")
        : t(
            "确认撤回这个版本，恢复发布前的课程内容？",
            "Roll back this revision and restore the previous course content?"
          );
    if (window.confirm(question)) {
      setProblem("");
      review.mutate(decision);
    }
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      loadFiles(readZip(await file.arrayBuffer()));
      mark(true);
      setProblem("");
    } catch (e) {
      setProblem(errorText(e));
    }
  }
  async function addImage(file?: File) {
    if (!file) return;
    try {
      if (
        file.size > 8 * 1024 * 1024 ||
        !/\.(png|jpg|jpeg|gif|webp|avif)$/i.test(file.name)
      )
        throw Error(
          t("请选择 8 MB 以内的常见图片。", "Choose an image under 8 MB.")
        );
      const name = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const ref = "images/" + crypto.randomUUID().slice(0, 8) + "-" + name;
      const key = selected.slice(0, selected.lastIndexOf("/") + 1) + ref;
      const bytes = new Uint8Array(await file.arrayBuffer());
      setFiles((old) => ({ ...old, [key]: bytes }));
      setText((old) => old + "\n\n![" + name + "](" + ref + ")\n");
      mark(true);
    } catch (e) {
      setProblem(errorText(e));
    }
  }
  return (
    <div className="ws">
      <Link
        className="ws-back"
        href={`/${lang}/personal?tab=${row?.reviewable || row?.revertible ? "review" : "create"}`}
      >
        <ArrowLeft size={16} />
        {t("返回个人中心", "Back to workspace")}
      </Link>
      <header className="ws-title">
        <h1>
          {isNew
            ? t("创建教程", "Create tutorial")
            : row?.title || t("教程版本", "Tutorial revision")}
        </h1>
        {row && <small>{statusName(row.status, en)}</small>}
      </header>
      {!isNew && !q.data ? (
        <div className="ws-empty">
          {q.isPending
            ? "…"
            : t("无法打开此版本。", "This revision is unavailable.")}
        </div>
      ) : editing ? (
        <section className="ws-editor">
          <h2>
            <FilePenLine size={20} /> {t("教程编辑器", "Tutorial editor")}
          </h2>
          {pendingSource ? (
            source.isError ? (
              <div role="alert">
                {t("无法读取原始文件", "Could not load the original files")}{" "}
                <button onClick={() => source.refetch()}>
                  {t("重试", "Retry")}
                </button>
              </div>
            ) : (
              <p>…</p>
            )
          ) : (
            <>
              {!isPackage ? (
                <div className="ws-fields">
                  <label>
                    {t("教程标题", "Tutorial title")}
                    <input
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        mark(true);
                      }}
                      maxLength={160}
                    />
                  </label>
                  <label>
                    {t("课程短链接", "Course slug")}
                    <input
                      value={slug}
                      placeholder="hello-web3"
                      onChange={(e) => {
                        setSlug(e.target.value);
                        mark(true);
                      }}
                      maxLength={90}
                    />
                  </label>
                </div>
              ) : (
                <label>
                  {t("编辑文件", "Edit file")}
                  <select
                    value={selected}
                    onChange={(e) => {
                      setFiles({ ...files, [selected]: editedChapter() });
                      select(e.target.value);
                      setText(chapterParts(files[e.target.value]).body);
                    }}
                  >
                    {markdownFiles(files).map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                {isPackage
                  ? "Markdown"
                  : t("Markdown", "Markdown · Chinese source (zh.md)")}
                <textarea
                  rows={13}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    mark(true);
                  }}
                  placeholder={t(
                    "在这里写下教程正文…",
                    "Write your tutorial here…"
                  )}
                />
              </label>
              <div className="ws-studio-actions">
                <button
                  className="ws-tool"
                  onClick={() => markdownFile.current?.click()}
                >
                  <Upload size={16} />
                  {t("导入 Markdown", "Import Markdown")}
                </button>
                <input
                  hidden
                  ref={markdownFile}
                  type="file"
                  accept=".md,.markdown,text/markdown"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    if (file.size > 1024 * 1024) {
                      setProblem(
                        t("Markdown 文件过大。", "Markdown file is too large.")
                      );
                      return;
                    }
                    try {
                      const raw = await file.text();
                      setText(chapterParts(strToU8(raw)).body);
                      if (!isPackage && !title)
                        setTitle(file.name.replace(/\.(md|markdown)$/i, ""));
                      mark(true);
                      setProblem("");
                    } catch (err) {
                      setProblem(errorText(err));
                    }
                  }}
                />
                <button
                  className="ws-tool"
                  onClick={() => imageFile.current?.click()}
                >
                  <ImagePlus size={16} />
                  {t("插入图片", "Insert image")}
                </button>
                <input
                  hidden
                  ref={imageFile}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.avif,.gif"
                  onChange={(e) => {
                    addImage(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <button
                  className="ws-tool"
                  onClick={() => upload.current?.click()}
                >
                  <Upload size={16} />
                  {t("导入课程 ZIP", "Import course ZIP")}
                </button>
                <input
                  hidden
                  ref={upload}
                  type="file"
                  accept=".zip"
                  onChange={(e) => {
                    importFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
              <details
                className="my-5 rounded-lg border border-wtf-border-outline p-4"
                key={quizPath}
              >
                <summary className="cursor-pointer font-semibold">
                  {t("章节测验", "Chapter quiz")}
                  {quizText ? " · quiz.yaml" : ""}
                </summary>
                <p className="my-3 text-sm">
                  {t(
                    "粘贴题目 YAML，或复制含本章正文的出题指令给 Agent。保存草稿时会校验题目。",
                    "Paste question YAML, or copy the instructions and chapter for your agent. Saving validates the questions."
                  )}
                </p>
                <label htmlFor="chapter-quiz-yaml">quiz.yaml</label>
                <textarea
                  id="chapter-quiz-yaml"
                  rows={10}
                  spellCheck={false}
                  value={quizText}
                  placeholder={quizExample(chapterLang)}
                  onChange={(e) => changeQuiz(e.target.value)}
                />
                <div className="ws-studio-actions">
                  <a
                    className="ws-tool"
                    target="_blank"
                    rel="noreferrer"
                    href={`/${lang}/quiz-guide`}
                  >
                    {t("格式与示例", "Format and example")} ↗
                  </a>
                  <button
                    className="ws-tool"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          quizGuide(chapterLang) +
                            "\n## Chapter Markdown\n\n" +
                            text
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      } catch {
                        setProblem(
                          t(
                            "无法复制，请打开格式与示例。",
                            "Copy failed. Open the format and example."
                          )
                        );
                      }
                    }}
                  >
                    {copied
                      ? t("已复制", "Copied")
                      : t("复制 Agent 出题指令", "Copy agent instructions")}
                  </button>
                </div>
              </details>
              <div className="ws-studio-actions">
                <button
                  disabled={action.isPending || (!dirty && !isNew)}
                  className="ws-tool"
                  onClick={() => {
                    setProblem("");
                    action.mutate("save");
                  }}
                >
                  <Save size={16} />
                  {t("保存草稿", "Save draft")}
                </button>
                <button
                  disabled={action.isPending}
                  className="ws-cta"
                  onClick={() => {
                    setProblem("");
                    action.mutate("submit");
                  }}
                >
                  <Send size={16} />
                  {t("提交审核", "Submit for review")}
                </button>
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="ws-editor">
          <h2>{t("投稿内容", "Submission")}</h2>
          {q.data?.submission?.chapters?.map((ch) =>
            Object.entries(ch.bodies || {}).map(([language, body]) => (
              <article key={ch.path + language}>
                <h3>
                  {body.title} · {language}
                </h3>
                <pre>{body.content}</pre>
                {!!ch.quizzes?.[language]?.choices?.length && (
                  <details>
                    <summary>
                      {t("章节测验", "Chapter quiz")} ·{" "}
                      {ch.quizzes[language].choices?.length}
                    </summary>
                    <ol>
                      {ch.quizzes[language].choices?.map((item, index) => (
                        <li key={index}>
                          <strong>{item.title}</strong>
                          <p>
                            {t("答案", "Answer")} ·{" "}
                            {item.meta.answer.join(", ")}
                          </p>
                          {item.meta.explanation && (
                            <p>{item.meta.explanation}</p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </details>
                )}
              </article>
            ))
          ) || (
            <p>
              {t(
                "此历史版本仅保留状态记录。",
                "Only status information is available for this version."
              )}
            </p>
          )}
          {!!q.data?.preview_images?.length && (
            <div className="space-y-3">
              <h3>{t("投稿配图", "Submission images")}</h3>
              {q.data.preview_images.map((url, i) => (
                // Signed private previews must go directly to the material server.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="max-h-80 max-w-full object-contain"
                  alt={t("投稿配图", "Submission image") + " " + (i + 1)}
                />
              ))}
              <button className="ws-tool" onClick={() => q.refetch()}>
                {t("刷新配图", "Refresh images")}
              </button>
            </div>
          )}
          <div className="ws-studio-actions">
            {row?.reviewable && row.status === "pending" && (
              <button
                className="ws-cta"
                disabled={review.isPending}
                onClick={() => confirmReview("approve")}
              >
                {t("批准发布", "Approve publication")}
              </button>
            )}
            {row?.revertible && row.status === "approved" && (
              <button
                className="ws-tool"
                disabled={review.isPending}
                onClick={() => confirmReview("revert")}
              >
                {t("撤回发布", "Roll back publication")}
              </button>
            )}
          </div>
        </section>
      )}
      {problem && <p role="alert">{problem}</p>}
    </div>
  );
}

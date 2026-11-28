import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminRequest,
  href,
  useManagement,
  type Course,
  type Chapter,
  type Translation,
} from "./shared";

function TranslationFields({
  initial,
  lang,
  chapter,
}: {
  initial?: Translation;
  lang: string;
  chapter: boolean;
}) {
  const { t, can, run, busy } = useManagement();
  const [body, setBody] = useState(initial?.content || ""),
    [cover, setCover] = useState(initial?.cover || ""),
    [source, setSource] = useState(initial?.content_url || ""),
    [name, setName] = useState(initial?.title || "");
  return (
    <fieldset>
      <h3>{lang}</h3>
      <label>
        {t("标题", "Title")}
        <input
          name={lang + ".title"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      {chapter ? (
        <>
          <label>
            {t("章节正文", "Chapter Markdown")}
            <textarea
              aria-label={t("章节正文", "Chapter Markdown")}
              name={lang + ".content"}
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          <label>
            {t("导入 Markdown 文件", "Import Markdown file")}
            <input
              type="file"
              accept=".md,.markdown,text/markdown"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file)
                  void run(async () => {
                    if (file.size > 1024 * 1024)
                      throw Error(t("文件超过 1 MiB", "File exceeds 1 MiB"));
                    setBody(await file.text());
                  });
              }}
            />
          </label>
          <label>
            {t("Markdown 来源", "Markdown source URL")}
            <input
              name={lang + ".content_url"}
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </label>
          {can("chapter.read") && (
            <button
              type="button"
              disabled={busy || !source}
              onClick={() =>
                void run(async () => {
                  const url = new URL(source);
                  if (
                    url.protocol !== "https:" ||
                    !["github.com", "raw.githubusercontent.com"].includes(
                      url.hostname
                    )
                  )
                    throw Error(
                      t("请输入 GitHub 文件地址", "Enter a GitHub file URL")
                    );
                  const imported = await adminRequest<Chapter>(
                    "chapter?" + new URLSearchParams({ url: source })
                  );
                  const d = imported.details.find((x) => x.lang === lang);
                  if (!d)
                    throw Error(
                      t("来源语言不匹配", "Source language does not match")
                    );
                  setBody(d.content || "");
                  setName(d.title);
                })
              }
            >
              {t("从 GitHub 载入", "Load from GitHub")}
            </button>
          )}
        </>
      ) : (
        <>
          <label>
            {t("课程封面", "Cover URL")}
            <input
              name={lang + ".cover"}
              value={cover}
              onChange={(e) => setCover(e.target.value)}
            />
          </label>
          {can("upload.file") && (
            <label>
              {t("上传封面", "Upload cover")}
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.gif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    void run(async () => {
                      const data = new FormData();
                      data.append("file", file);
                      const result = await adminRequest<{ url: string }>(
                        "upload",
                        "POST",
                        data
                      );
                      setCover(result.url);
                    });
                }}
              />
            </label>
          )}
          {(
            [
              ["description", "简介", "Description"],
              ["outline", "大纲", "Outline"],
              ["portrait", "适合人群", "Audience"],
            ] as const
          ).map(([k, zh, en]) => (
            <label key={k}>
              {t(zh, en)}
              <textarea name={lang + "." + k} defaultValue={initial?.[k]} />
            </label>
          ))}
        </>
      )}
    </fieldset>
  );
}
export function ContentEditor({
  courseId,
  entry,
  readOnly = false,
}: {
  courseId?: number;
  entry?: Chapter | Course;
  readOnly?: boolean;
}) {
  const { lang, t, run, busy } = useManagement();
  const router = useRouter();
  const [original, setOriginal] = useState(entry),
    chapter = courseId !== undefined,
    course = original as Course | undefined,
    ch = original as Chapter | undefined;
  const [langs, setLangs] = useState(
    original?.details?.length ? original.details.map((d) => d.lang) : [lang]
  );
  return (
    <section>
      <h2>
        {chapter
          ? t("章节信息", "Chapter details")
          : t("课程信息", "Course details")}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          void run(async () => {
            const payload: Record<string, unknown> = {};
            for (const key of [
              "path",
              "sort",
              ...(chapter
                ? ["study_time", "keywords"]
                : ["category", "repo", "level"]),
            ]) {
              const raw = String(data.get(key) ?? "");
              const value = ["sort", "study_time"].includes(key)
                ? Number(raw)
                : raw;
              if (!original || value !== original[key as keyof typeof original])
                payload[key] = value;
            }
            if (!chapter) {
              const from = String(data.get("from") || ""),
                to = String(data.get("to") || "");
              const dates = (course?.schedule || []).map((d) => d.slice(0, 10));
              if (from !== (dates[0] || "") || to !== (dates[1] || "")) {
                if (!from || !to || to < from)
                  throw Error(
                    t(
                      "请填写有效的起止日期",
                      "Enter a valid start and end date"
                    )
                  );
                payload.schedule = [from, to];
              }
            }
            const details = langs.flatMap((l) => {
              const prev = original?.details?.find((d) => d.lang === l);
              const fields: Record<string, string> = {};
              for (const k of chapter
                ? ["title", "content", "content_url"]
                : ["title", "description", "outline", "portrait", "cover"]) {
                const v = String(data.get(l + "." + k) ?? "");
                if (!prev || v !== (prev[k as keyof Translation] || ""))
                  fields[k] = v;
              }
              return Object.keys(fields).length ? [{ lang: l, ...fields }] : [];
            });
            if (
              typeof payload.path === "string" &&
              (!payload.path.trim() || /[/?#]/.test(payload.path))
            ) {
              throw Error(t("请输入有效路径", "Enter a valid path segment"));
            }
            if (details.length) payload.details = details;
            if (!Object.keys(payload).length) return;
            const base = chapter ? `course/${courseId}/chapter` : "course";
            const result = await adminRequest<Course | Chapter>(
              original ? base + "/" + original.id : base,
              original ? "PUT" : "POST",
              payload
            );
            if (original) setOriginal(result);
            else
              router.replace(
                chapter
                  ? href(lang, courseId, result.id)
                  : href(lang, result.id)
              );
          });
        }}
      >
        <fieldset disabled={busy || readOnly}>
          <div className="grid">
            <label>
              {t("路径", "Path")}
              <input name="path" required defaultValue={original?.path} />
            </label>
            <label>
              {t("排序", "Sort order")}
              <input
                name="sort"
                type="number"
                defaultValue={original?.sort || 0}
              />
            </label>
            {chapter ? (
              <>
                <label>
                  {t("学习时长", "Study time")}
                  <input
                    name="study_time"
                    min="0"
                    type="number"
                    defaultValue={ch?.study_time || 0}
                  />
                </label>
                <label>
                  {t("关键词", "Keywords")}
                  <input name="keywords" defaultValue={ch?.keywords} />
                </label>
              </>
            ) : (
              <>
                <label>
                  {t("分类", "Category")}
                  <input name="category" defaultValue={course?.category} />
                </label>
                <label>
                  {t("难度", "Level")}
                  <input name="level" defaultValue={course?.level} />
                </label>
                <label>
                  {t("来源仓库", "Source repository")}
                  <input name="repo" defaultValue={course?.repo} />
                </label>
                <label>
                  {t("开始日期", "Start date")}
                  <input
                    name="from"
                    type="date"
                    defaultValue={course?.schedule?.[0]?.slice(0, 10)}
                  />
                </label>
                <label>
                  {t("结束日期", "End date")}
                  <input
                    name="to"
                    type="date"
                    defaultValue={course?.schedule?.[1]?.slice(0, 10)}
                  />
                </label>
              </>
            )}
          </div>
          {langs.map((l) => (
            <TranslationFields
              key={l}
              chapter={chapter}
              lang={l}
              initial={original?.details?.find((d) => d.lang === l)}
            />
          ))}
          {!readOnly && (
            <div className="actions">
              {["zh", "en"]
                .filter((l) => !langs.includes(l))
                .map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => setLangs([...langs, l])}
                  >
                    + {l}
                  </button>
                ))}
              <button>{t("保存", "Save")}</button>
            </div>
          )}
        </fieldset>
      </form>
    </section>
  );
}

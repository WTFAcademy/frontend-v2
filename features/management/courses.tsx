import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminRequest,
  href,
  Load,
  title,
  useAdmin,
  useManagement,
  type Course,
  type Chapter,
} from "./shared";
import { ContentEditor } from "./editor";
import { QuizEditor } from "./quiz";

export function Courses({
  courseId,
  chapterId,
}: {
  courseId?: string;
  chapterId?: string;
}) {
  const { lang, t, can } = useManagement();
  if (courseId === "new" && can("course.create")) return <ContentEditor />;
  if (courseId && /^[1-9]\d*$/.test(courseId) && can("course.read"))
    return <CoursePage id={Number(courseId)} chapterId={chapterId} />;
  if (courseId) return <p>{t("课程不可用", "Course unavailable")}</p>;
  return <CourseList key={lang} />;
}
function CourseList() {
  const { lang, t, can } = useManagement(),
    q = useAdmin<{ list: Course[] }>("courses", "course.list"),
    [filter, setFilter] = useState("");
  if (!q.data) return <Load query={q} />;
  const rows = q.data.list.filter((c) =>
    (title(c, lang) + " " + c.path).toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <section>
      <div className="row">
        <h2>{t("课程", "Courses")}</h2>
        {can("course.create") && (
          <Link className="action" href={href(lang, "new")}>
            {t("新建课程", "New course")}
          </Link>
        )}
      </div>
      <label>
        {t("搜索课程", "Search courses")}
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </label>
      {rows.map((c) => (
        <div className="row" key={c.id}>
          <div>
            <strong>{title(c, lang)}</strong>
            <small>
              {c.path} · {c.status}
            </small>
          </div>
          {can("course.read") && (
            <Link className="action" href={href(lang, c.id)}>
              {t("管理", "Manage")}
            </Link>
          )}
        </div>
      ))}
      {!rows.length && <p>{t("没有匹配的课程", "No matching courses")}</p>}
    </section>
  );
}
function CoursePage({ id, chapterId }: { id: number; chapterId?: string }) {
  const { lang, user, t, can } = useManagement(),
    q = useAdmin<Course>("course/" + id, "course.read");
  if (!q.data) return <Load query={q} />;
  const c = q.data,
    owner =
      user.role_id === 1 || user.role_id === 2 || user.id === c.author?.id;
  if (chapterId === "new" && can("chapter.create"))
    return (
      <>
        <Link href={href(lang, id)}>← {title(c, lang)}</Link>
        <ContentEditor courseId={id} />
      </>
    );
  if (chapterId)
    return /^[1-9]\d*$/.test(chapterId) && can("chapter.read") ? (
      <ChapterPage course={c} owner={owner} id={Number(chapterId)} />
    ) : (
      <p>{t("章节不可用", "Chapter unavailable")}</p>
    );
  const editable = owner || !["published", "prepublished"].includes(c.status);
  return (
    <>
      <h2>{title(c, lang)}</h2>
      <small>
        {c.path} · {c.status}
      </small>
      <PublishActions
        path={"course/" + id}
        type="course"
        owner={owner}
        editable={editable}
        back={href(lang)}
        status={c.status}
      />
      {can("chapter.list") && <ChapterList course={c} />}
      <ContentEditor entry={c} readOnly={!editable || !can("course.update")} />
      <Contributors course={c} owner={owner} />
      {can("revision.submit") && <GithubImport course={c} />}
    </>
  );
}
function PublishActions({
  path,
  type,
  owner,
  editable,
  back,
  status,
}: {
  path: string;
  type: "course" | "chapter";
  owner: boolean;
  editable: boolean;
  back: string;
  status: string;
}) {
  const { can, t, busy, run } = useManagement(),
    router = useRouter();
  const options =
    type === "course"
      ? ([
          [2, "published", t("发布", "Publish")],
          [4, "prepublished", t("预发布", "Prepublish")],
          [0, "draft", t("转为草稿", "Return to draft")],
        ] as const)
      : ([[2, "published", t("发布", "Publish")]] as const);
  return (
    <div className="actions">
      {owner &&
        can(type + ".update") &&
        options
          .filter(([, state]) => state !== status)
          .map(([code, , label]) => (
            <button
              key={code}
              disabled={busy}
              onClick={() => {
                if (confirm(label + "?"))
                  void run(() => adminRequest(path, "PUT", { status: code }));
              }}
            >
              {label}
            </button>
          ))}
      {editable && can(type + ".delete") && (
        <button
          disabled={busy}
          onClick={() => {
            if (confirm(t("确定删除当前条目？", "Delete this item?")))
              void run(
                () => adminRequest(path, "DELETE"),
                () => router.replace(back),
                true
              );
          }}
        >
          {t("删除", "Delete")}
        </button>
      )}
    </div>
  );
}
function ChapterList({ course }: { course: Course }) {
  const { lang, t, can } = useManagement(),
    q = useAdmin<{ list: Chapter[] }>(
      `course/${course.id}/chapters`,
      "chapter.list"
    );
  return (
    <section>
      <div className="row">
        <h2>{t("章节", "Chapters")}</h2>
        {can("chapter.create") && (
          <Link href={href(lang, course.id, "new")}>
            {t("新建章节", "New chapter")}
          </Link>
        )}
      </div>
      {!q.data ? (
        <Load query={q} />
      ) : (
        q.data.list.map((ch) => (
          <div className="row" key={ch.id}>
            <span>
              {ch.sort}. {title(ch, lang)}
            </span>
            {can("chapter.read") && (
              <Link href={href(lang, course.id, ch.id)}>
                {t("编辑章节", "Edit chapter")}
              </Link>
            )}
          </div>
        ))
      )}
    </section>
  );
}
function ChapterPage({
  course,
  id,
  owner,
}: {
  course: Course;
  id: number;
  owner: boolean;
}) {
  const { lang, can } = useManagement(),
    path = `course/${course.id}/chapter/${id}`,
    q = useAdmin<Chapter>(path, "chapter.read");
  if (!q.data) return <Load query={q} />;
  const ch = q.data,
    editable = owner || !["published", "prepublished"].includes(ch.status);
  return (
    <>
      <Link href={href(lang, course.id)}>← {title(course, lang)}</Link>
      <h2>{title(ch, lang)}</h2>
      <PublishActions
        path={path}
        type="chapter"
        status={ch.status}
        back={href(lang, course.id)}
        owner={owner}
        editable={editable}
      />
      <ContentEditor
        entry={ch}
        courseId={course.id}
        readOnly={!editable || !can("chapter.update")}
      />
      {can("quiz.choice.list") && (
        <QuizEditor
          path={path + "/quiz/choices"}
          languages={ch.details.map((d) => d.lang)}
          editable={editable && can("quiz.choice.create")}
        />
      )}
    </>
  );
}
function Contributors({ course, owner }: { course: Course; owner: boolean }) {
  const { t, can, busy, run } = useManagement(),
    [login, setLogin] = useState("");
  const base = `course/${course.id}/contributor/`;
  return (
    <section>
      <h2>{t("协作者", "Contributors")}</h2>
      {course.contributors?.map((p) => (
        <div className="row" key={p.id}>
          {p.username}
          {owner && can("course.contributor.remove") && (
            <button
              disabled={busy}
              onClick={() => {
                if (confirm(t("移除此协作者？", "Remove this contributor?")))
                  void run(() =>
                    adminRequest(
                      base + encodeURIComponent(p.github_id || p.username),
                      "DELETE"
                    )
                  );
              }}
            >
              {t("移除", "Remove")}
            </button>
          )}
        </div>
      ))}
      {owner && can("course.contributor.add") && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(
              () =>
                adminRequest(base + encodeURIComponent(login.trim()), "PUT"),
              () => setLogin("")
            );
          }}
        >
          <label>
            {t("GitHub 用户名或 ID", "GitHub username or ID")}
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              pattern="[A-Za-z0-9\-]+"
            />
          </label>
          <button disabled={busy}>{t("添加协作者", "Add contributor")}</button>
        </form>
      )}
    </section>
  );
}
function GithubImport({ course }: { course: Course }) {
  const { t, busy, run, lang } = useManagement(),
    router = useRouter();
  return (
    <details>
      <summary>
        {t("从 GitHub 导入教程", "Import tutorial from GitHub")}
      </summary>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          void run(async () => {
            const rev = await adminRequest<{ id: number }>(
              `course/${course.id}/revisions`,
              "POST",
              { repository: d.get("repository"), commit: d.get("commit") }
            );
            router.push(`/${lang}/personal/studio/${rev.id}`);
          });
        }}
      >
        <label>
          {t("仓库（组织/仓库名）", "Repository (owner/name)")}
          <input
            name="repository"
            required
            pattern="[A-Za-z0-9_.\-]+/[A-Za-z0-9_.\-]+"
          />
        </label>
        <label>
          Commit SHA
          <input name="commit" required pattern="[0-9a-fA-F]{40}" />
        </label>
        <button disabled={busy}>{t("提交审核", "Submit for review")}</button>
      </form>
    </details>
  );
}

"use client";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { request, type TResponse } from "@/lib/request";
import type { TAuthUser } from "@/features/auth/type";

export type Person = { id: number; username: string; github_id: number };
export type Translation = {
  lang: string;
  title: string;
  description?: string;
  outline?: string;
  portrait?: string;
  cover?: string;
  content?: string;
  content_url?: string;
};
export type Entry = {
  id: number;
  path: string;
  status: string;
  sort: number;
  details: Translation[];
};
export type Course = Entry & {
  author: Person;
  contributors: Person[];
  repo: string;
  level: string;
  category: string;
  schedule: string[];
};
export type Chapter = Entry & { keywords: string; study_time: number };

type Management = {
  user: TAuthUser;
  lang: string;
  busy: boolean;
  t: (zh: string, en: string) => string;
  can: (grant: string) => boolean;
  run: (
    work: () => Promise<unknown>,
    next?: () => void,
    leavingPage?: boolean
  ) => Promise<void>;
};
const Context = createContext<Management | null>(null);
export function useManagement() {
  const context = useContext(Context);
  if (!context) throw Error("Missing management context");
  return context;
}
export function ManagementProvider({
  user,
  lang,
  children,
}: {
  user: TAuthUser;
  lang: string;
  children: ReactNode;
}) {
  const cache = useQueryClient(),
    lock = useRef(false);
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [problem, setProblem] = useState("");
  const t = (zh: string, en: string) => (lang === "en" ? en : zh);
  async function run(
    work: () => Promise<unknown>,
    next?: () => void,
    leavingPage = false
  ) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setProblem("");
    setNotice("");
    try {
      await work();
      await cache.invalidateQueries({
        queryKey: ["management", user.id],
        refetchType: leavingPage ? "none" : "active",
      });
      next?.();
      setNotice(t("操作成功", "Changes saved"));
    } catch (e) {
      setProblem(
        isAxiosError(e)
          ? e.response?.data?.msg || e.message
          : e instanceof Error
            ? e.message
            : t("请求失败", "Request failed")
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Context.Provider
      value={{
        user,
        lang,
        t,
        busy,
        can: (g) => !!user.grants?.includes(g),
        run,
      }}
    >
      {problem && (
        <p role="alert" className="mg-error">
          {problem}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {children}
    </Context.Provider>
  );
}
export async function adminRequest<T>(
  path: string,
  method = "GET",
  data?: unknown
) {
  const res = await request.request<TResponse<T>>({
    url: "/admin/" + path,
    method,
    data,
  });
  if (res.data.code !== 0) throw Error(res.data.msg || "Request failed");
  return res.data.data;
}
export function useAdmin<T>(path: string, grant: string) {
  const { user, lang, can } = useManagement();
  return useQuery({
    queryKey: ["management", user.id, lang, path],
    queryFn: () => adminRequest<T>(path),
    enabled: can(grant),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
export function Load({
  query,
}: {
  query: { isError: boolean; error: Error | null; refetch: () => unknown };
}) {
  const { t } = useManagement();
  return query.isError ? (
    <p role="alert">
      {query.error?.message}{" "}
      <button onClick={() => query.refetch()}>{t("重试", "Retry")}</button>
    </p>
  ) : (
    <p role="status">{t("加载中…", "Loading…")}</p>
  );
}
export function title(row: Entry, lang: string) {
  return (
    row.details?.find((d) => d.lang === lang)?.title ||
    row.details?.[0]?.title ||
    row.path
  );
}
export function href(
  lang: string,
  course?: number | string,
  chapter?: number | string
) {
  const params = new URLSearchParams();
  if (course) params.set("course", String(course));
  if (chapter) params.set("chapter", String(chapter));
  return `/${lang}/personal/manage${params.size ? "?" + params : ""}`;
}

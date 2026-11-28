import request, { TResponse } from "@/lib/request";

export type Revision = {
  id: number;
  course_id: number;
  path: string;
  title: string;
  status: string;
  created_at: string;
  mine: boolean;
  editable: boolean;
  reviewable: boolean;
  revertible?: boolean;
  packaged: boolean;
};
export type RevisionDetail = {
  revision: Revision;
  preview_images?: string[] | null;
  submission: {
    chapters: {
      path: string;
      quizzes?: Record<
        string,
        {
          choices?: {
            title: string;
            meta: { answer: string[]; explanation?: string };
          }[];
        }
      >;
      bodies: Record<string, { title: string; content: string }>;
    }[];
  } | null;
};
export function unpack<T>(res: TResponse<T>) {
  if (res.code !== 0 || res.data == null)
    throw new Error(res.msg || "Request failed");
  return res.data;
}
export async function revisions(lang: string) {
  return unpack(
    (
      await request.get<TResponse<Revision[]>>("/user/workspace/revisions", {
        headers: { Language: lang },
      })
    ).data
  );
}
export async function detail(id: string, lang: string) {
  return unpack(
    (
      await request.get<TResponse<RevisionDetail>>(
        "/user/workspace/revisions/" + id,
        { headers: { Language: lang } }
      )
    ).data
  );
}
export async function getPackage(id: string) {
  return (
    await request.get<ArrayBuffer>(
      "/user/workspace/revisions/" + id + "/package",
      { responseType: "arraybuffer" }
    )
  ).data;
}
export async function savePackage(data: Uint8Array, previous?: number) {
  return unpack(
    (
      await request.post<TResponse<{ id: number }>>(
        "/user/workspace/drafts",
        data,
        {
          headers: { "Content-Type": "application/zip" },
          params: { previous },
        }
      )
    ).data
  );
}
export async function submit(id: string) {
  return unpack(
    (
      await request.post<TResponse<{ id: number }>>(
        "/user/workspace/drafts/" + id + "/submit"
      )
    ).data
  );
}
export async function reviewRevision(
  row: Revision,
  action: "approve" | "revert"
) {
  return unpack(
    (
      await request.post<TResponse<{ id: number; status: string }>>(
        `/admin/course/${row.course_id}/revision/${row.id}/${action}`
      )
    ).data
  );
}
export function statusName(status: string, en: boolean) {
  const names: Record<string, [string, string]> = {
    draft: ["草稿", "Draft"],
    pending: ["待审核", "In review"],
    approved: ["已发布", "Published"],
    archived: ["已归档", "Archived"],
    restored: ["已恢复", "Restored"],
    reverted: ["已撤回", "Reverted"],
  };
  return names[status]?.[en ? 1 : 0] ?? status;
}

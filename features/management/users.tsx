import { useState } from "react";
import { adminRequest, Load, useAdmin, useManagement } from "./shared";
type Account = {
  id: number;
  username: string;
  nickname: string;
  role_id: number;
  role_name: string;
  activated: boolean;
};
type Role = { id: number; name: string };
export function Users() {
  const { user, t, can, busy, run } = useManagement(),
    q = useAdmin<{ list: Account[] }>("users", "user.list"),
    roles = useAdmin<{ list: Role[] }>("roles", "role.list");
  const [filter, setFilter] = useState(""),
    [page, setPage] = useState(0);
  const allowed =
    roles.data?.list?.filter((r) => r.id > user.role_id && r.id > 1) || [];
  if (!q.data) return <Load query={q} />;
  const rows = q.data.list.filter((r) =>
    (r.username + " " + r.nickname).toLowerCase().includes(filter.toLowerCase())
  );
  const current = Math.min(page, Math.max(0, Math.ceil(rows.length / 25) - 1));
  return (
    <section>
      <h2>{t("用户与角色", "Users and roles")}</h2>
      {roles.isError && <Load query={roles} />}
      {can("user.create") && allowed.length > 0 && (
        <details>
          <summary>{t("添加用户", "Add user")}</summary>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget,
                fields = new FormData(form);
              void run(
                async () => {
                  const login = String(fields.get("login")).trim();
                  let githubID = Number(login);
                  if (!/^\d+$/.test(login)) {
                    if (!can("github.search"))
                      throw Error(
                        t("请填写 GitHub 数字 ID", "Enter a numeric GitHub ID")
                      );
                    githubID = (
                      await adminRequest<{ id: number }>(
                        "github/search/" + encodeURIComponent(login)
                      )
                    ).id;
                  }
                  if (!Number.isSafeInteger(githubID) || githubID <= 0)
                    throw Error(t("GitHub ID 无效", "Invalid GitHub ID"));
                  await adminRequest("user", "POST", {
                    github_id: githubID,
                    role_id: Number(fields.get("role")),
                  });
                },
                () => form.reset()
              );
            }}
          >
            <label>
              {t("GitHub 用户名或 ID", "GitHub username or ID")}
              <input name="login" required />
            </label>
            <label>
              {t("角色", "Role")}
              <select
                aria-label={t("角色", "Role")}
                name="role"
                defaultValue={
                  allowed.find((r) => r.id === 4)?.id ||
                  allowed[allowed.length - 1].id
                }
              >
                {allowed.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <button disabled={busy}>{t("创建用户", "Create user")}</button>
          </form>
        </details>
      )}
      <label>
        {t("搜索用户", "Search users")}
        <input
          type="search"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(0);
          }}
        />
      </label>
      {rows.slice(current * 25, current * 25 + 25).map((r) => (
        <div className="row" key={r.id}>
          <div>
            <strong>{r.username}</strong>
            <small>
              {r.role_name} ·{" "}
              {r.activated ? t("已激活", "Active") : t("未激活", "Inactive")}
            </small>
          </div>
          {r.role_id > user.role_id && r.id !== user.id && (
            <div>
              {can("user.update") && (
                <details>
                  <summary>{t("编辑", "Edit")}</summary>
                  <form
                    key={r.role_id + ":" + r.activated}
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fields = new FormData(e.currentTarget);
                      const body: Record<string, unknown> = {
                        activated: fields.get("activated") === "on",
                      };
                      if (fields.has("role"))
                        body.role_id = Number(fields.get("role"));
                      if (
                        confirm(t("确认更新此账户？", "Update this account?"))
                      )
                        void run(() =>
                          adminRequest("user/" + r.id, "PUT", body)
                        );
                    }}
                  >
                    {allowed.some((role) => role.id === r.role_id) && (
                      <label>
                        {t("角色", "Role")}
                        <select
                          aria-label={t("角色", "Role")}
                          name="role"
                          defaultValue={r.role_id}
                        >
                          {allowed.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <label>
                      {t("已激活", "Active")}
                      <input
                        type="checkbox"
                        name="activated"
                        defaultChecked={r.activated}
                      />
                    </label>
                    <button disabled={busy}>
                      {t("保存用户", "Save user")}
                    </button>
                  </form>
                </details>
              )}
              {can("user.delete") && (
                <button
                  disabled={busy}
                  onClick={() => {
                    if (
                      confirm(
                        t("确定删除用户 ", "Delete user ") + r.username + "?"
                      )
                    )
                      void run(() => adminRequest("user/" + r.id, "DELETE"));
                  }}
                >
                  {t("删除用户", "Delete user")}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      <div className="actions">
        <button disabled={!current} onClick={() => setPage(current - 1)}>
          ←
        </button>
        <span>
          {current + 1} / {Math.max(1, Math.ceil(rows.length / 25))}
        </span>
        <button
          disabled={(current + 1) * 25 >= rows.length}
          onClick={() => setPage(current + 1)}
        >
          →
        </button>
      </div>
    </section>
  );
}

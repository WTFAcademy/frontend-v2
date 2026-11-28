// Runs against a disposable backend bootstrapped by tools/smokedb.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const site = new URL(process.env.MANAGEMENT_SITE || "http://127.0.0.1:4353");
const api = new URL(process.env.MANAGEMENT_API || "http://127.0.0.1:18092");
const token = process.env.MANAGEMENT_FIXTURE_SESSION;
if (
  !token ||
  [site, api].some((u) => u.hostname !== "127.0.0.1" || u.protocol !== "http:")
)
  throw Error("Use a loopback fixture and MANAGEMENT_FIXTURE_SESSION");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN,
    headless: true,
  });
  try {
    const ctx = await browser.newContext();
    await ctx.addCookies([
      { name: "wtf_token", value: token, url: site.origin },
    ]);
    await ctx.route(site.origin + "/v1/**", async (r) => {
      const u = new URL(r.request().url());
      const response = await r.fetch({
        url: api.origin + u.pathname + u.search,
      });
      if (u.pathname.startsWith("/v1/admin/")) {
        const data = await response.json();
        if (data.code !== 0)
          console.error(r.request().method(), u.pathname, data.code, data.msg);
      }
      await r.fulfill({ response });
    });
    const p = await ctx.newPage();
    p.setDefaultTimeout(25000);
    p.on("pageerror", (e) => console.error("Page error:", e.message));
    const goto = (path) =>
      p.goto(site.origin + path, { waitUntil: "domcontentloaded" });
    const btn = (name) => p.getByRole("button", { name, exact: true });
    const field = (name) => p.getByLabel(name, { exact: true });
    const slug = "management-fixture-" + Date.now();
    await goto("/zh/personal");
    await p.getByRole("link", { name: "管理后台" }).click();
    await p.getByRole("link", { name: "新建课程" }).click();
    await field("路径").fill(slug);
    await field("标题").fill("迁移验收");
    await btn("保存").click();
    await p.waitForURL(/course=\d+$/);
    const courseURL = p.url();
    await p.getByRole("heading", { name: "迁移验收", exact: true }).waitFor();
    await field("GitHub 用户名或 ID").fill("10017");
    await btn("添加协作者").click();
    const contributor = p
      .locator(".row")
      .filter({ hasText: "fixture-learner" });
    await contributor.waitFor();
    p.once("dialog", (d) => d.accept());
    await contributor.getByRole("button", { name: "移除" }).click();
    await contributor.waitFor({ state: "detached" });
    await p.getByRole("link", { name: "新建章节" }).click();
    await field("章节正文").waitFor();
    await field("路径").fill("intro");
    await field("标题").fill("第一章");
    await field("章节正文").fill("# Markdown");
    await btn("保存").click();
    await p.waitForURL(/chapter=\d+$/);
    await field("排序").fill("3");
    await btn("保存").click();
    await p.getByRole("status").filter({ hasText: "操作成功" }).waitFor();
    await p.reload({ waitUntil: "domcontentloaded" });
    await field("章节正文").waitFor();
    assert.equal(await field("排序").inputValue(), "3");
    await p.getByText("zh · 0", { exact: true }).click();
    await btn("添加题目").click();
    await p.getByLabel("题目 1", { exact: true }).fill("答案是什么？");
    await field("选项内容").nth(0).fill("正确");
    await field("选项内容").nth(1).fill("错误");
    await field("答案（每行一个）").fill("a");
    await btn("保存测验").click();
    await p.getByRole("status").filter({ hasText: "操作成功" }).waitFor();
    await p.reload({ waitUntil: "domcontentloaded" });
    await p.getByText("zh · 1", { exact: true }).click();
    assert.equal(await field("选项内容").first().inputValue(), "正确");
    p.once("dialog", (d) => d.accept());
    await btn("发布").click();
    await btn("发布").waitFor({ state: "detached" });
    await p.goto(courseURL, { waitUntil: "domcontentloaded" });
    await field("标题").fill("迁移验收完成");
    await btn("保存").click();
    await p
      .getByRole("heading", { name: "迁移验收完成", exact: true })
      .waitFor();
    await p.getByRole("link", { name: "用户与角色" }).click();
    const learner = p.locator(".row").filter({ hasText: "fixture-learner" });
    await learner.getByText("编辑", { exact: true }).click();
    assert.deepEqual(
      (
        await learner
          .locator("select option")
          .evaluateAll((xs) => xs.map((x) => x.value))
      ).sort(),
      ["3", "4"]
    );
    await learner.getByLabel("角色", { exact: true }).selectOption("4");
    p.once("dialog", (d) => d.accept());
    await learner.getByRole("button", { name: "保存用户" }).click();
    await learner.getByText(/user · /).waitFor();
    await p.goto(courseURL, { waitUntil: "domcontentloaded" });
    p.once("dialog", (d) => d.accept());
    await btn("删除").click();
    await p.waitForURL(
      (url) => url.pathname.endsWith("/personal/manage") && !url.search
    );
    assert.equal(await p.getByText("迁移验收完成", { exact: true }).count(), 0);
    await ctx.clearCookies();
    await goto("/zh/personal/manage");
    await btn("登录 Academy").waitFor();
    console.log(
      "PASS course create/edit/delete, chapter create/reorder/publish, quiz save/reload, contributors, user roles and guest gate"
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

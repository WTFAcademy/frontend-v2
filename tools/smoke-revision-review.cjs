const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const site = process.env.PERSONAL_SITE || "http://127.0.0.1:4352";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN,
    headless: true,
  });
  try {
    for (const reviewer of [true, false]) {
      const ctx = await browser.newContext();
      await ctx.addCookies([
        { name: "wtf_token", value: "fixture", url: site },
      ]);
      let status = "pending";
      let conflict = true;
      const writes = [];
      const row = () => ({
        id: 17,
        course_id: 3,
        created_at: "2026-11-28",
        title: "Fixture",
        status,
        mine: !reviewer,
        reviewable: reviewer && status === "pending",
        revertible: reviewer && status === "approved",
      });
      await ctx.route("**/stub.png?preview=fixture", (route) =>
        route.fulfill({
          contentType: "image/png",
          body: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jhb0AAAAASUVORK5CYII=",
            "base64"
          ),
        })
      );
      await ctx.route("**/v1/**", async (route) => {
        const path = new URL(route.request().url()).pathname;
        let data;
        if (path.endsWith("/user/profile"))
          data = { id: reviewer ? 1 : 2, username: "Tester" };
        else if (path.endsWith("/user/courses"))
          data = { ongoing: [], completed: [], sbt: [] };
        else if (path.endsWith("/workspace/revisions"))
          data = status === "reverted" ? [] : [row()];
        else if (path.endsWith("/workspace/revisions/17"))
          data = {
            revision: row(),
            submission: { chapters: [] },
            preview_images: [site + "/stub.png?preview=fixture"],
          };
        else if (
          path.startsWith("/v1/admin/course/3/revision/17/") &&
          route.request().method() === "POST"
        ) {
          const action = path.split("/").pop();
          writes.push(action);
          if (action === "approve" && conflict) {
            conflict = false;
            return route.fulfill({
              status: 409,
              json: { code: 409, msg: "Course changed" },
            });
          }
          status = action === "approve" ? "approved" : "reverted";
          data = { id: 17, status };
        } else return route.fulfill({ status: 404 });
        return route.fulfill({ json: { code: 0, data } });
      });
      const p = await ctx.newPage();
      await p.goto(site + "/zh/personal/studio/17", {
        waitUntil: "domcontentloaded",
      });
      const approve = p.getByRole("button", { name: "批准发布" });
      const revert = p.getByRole("button", { name: "撤回发布" });
      await p.getByRole("heading", { name: "Fixture" }).waitFor();
      await p.waitForFunction(
        () =>
          document.querySelector('img[src*="preview=fixture"]')?.naturalWidth >
          0
      );
      if (reviewer) {
        p.once("dialog", (d) => d.dismiss());
        await approve.click();
        assert.deepEqual(writes, []);
        p.once("dialog", (d) => d.accept());
        await approve.click();
        await p
          .getByRole("alert")
          .filter({ hasText: "Course changed" })
          .waitFor();
        p.once("dialog", (d) => d.accept());
        await approve.click();
        await revert.waitFor();
        await p.goto(site + "/zh/personal?tab=review", {
          waitUntil: "domcontentloaded",
        });
        await p.getByRole("link").filter({ hasText: "Fixture" }).click();
        p.once("dialog", (d) => d.accept());
        await revert.click();
        await p.waitForURL("**/personal?tab=review");
        await p.getByText("没有待处理的版本", { exact: true }).waitFor();
        assert.deepEqual(writes, ["approve", "approve", "revert"]);
      } else {
        assert.equal(await approve.count(), 0);
        assert.equal(await revert.count(), 0);
        assert.deepEqual(writes, []);
      }
      await ctx.close();
    }
    console.log(
      "PASS reviewer preview, cancellation, approval, reload and rollback; author read-only"
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

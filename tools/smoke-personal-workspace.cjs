const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const site = process.env.PERSONAL_SITE || "http://127.0.0.1:4343";
const capture = process.env.CAPTURE_DIR;
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROME_BIN,
    headless: true,
  });
  try {
    for (const mobile of [false, true]) {
      const ctx = await b.newContext({
        viewport: mobile
          ? { width: 390, height: 844 }
          : { width: 1440, height: 1000 },
        colorScheme: "light",
        reducedMotion: "reduce",
      });
      await ctx.addCookies([
        { name: "wtf_token", value: "visual-fixture", url: site },
      ]);
      await ctx.route("**/v1/user/profile", (r) =>
        r.fulfill({
          json: {
            code: 0,
            data: {
              id: 501,
              username: "Academy-Learner",
              nickname: "Alex",
              avatar: "",
              wallet_address: "",
            },
          },
        })
      );
      await ctx.route("**/v1/user/courses", (r) =>
        r.fulfill({
          json: {
            code: 0,
            data: {
              ongoing: [
                {
                  id: 1,
                  title: "Solidity 101",
                  path: "solidity101",
                  updated_at: "2026-11-27",
                  progress: 32,
                },
              ],
              completed: [],
              sbt: [],
            },
          },
        })
      );
      await ctx.route("**/v1/course/solidity101/chapters", (r) =>
        r.fulfill({
          json: {
            code: 0,
            data: {
              list: [
                { path: "HelloWeb3", title: "Hello Web3", progress: 100 },
                { path: "ValueTypes", title: "值类型", progress: 0 },
              ],
            },
          },
        })
      );
      await ctx.route("**/v1/user/workspace/revisions", (r) =>
        r.fulfill({
          json: {
            code: 0,
            data: [
              {
                id: 50,
                course_id: 51,
                title: "以太坊开发入门",
                status: "draft",
                created_at: "2026-11-27",
                mine: true,
                editable: true,
              },
            ],
          },
        })
      );
      const p = await ctx.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto(site + "/zh/personal", {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await p
        .getByRole("link", { name: "继续学习" })
        .waitFor({ timeout: 60000 });
      await p.getByText("值类型", { exact: true }).waitFor();
      assert.match(
        await p.getByRole("link", { name: "继续学习" }).getAttribute("href"),
        /ValueTypes$/
      );
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth
        ),
        false
      );
      if (capture)
        await p.screenshot({
          path: capture + "/" + (mobile ? "mobile" : "desktop") + ".png",
        });
      await p.getByRole("button", { name: "我的创作" }).click();
      await p.getByText("以太坊开发入门").waitFor();
      assert.match(
        await p
          .getByRole("link", { name: /以太坊开发入门/ })
          .getAttribute("href"),
        /studio\/50$/
      );
      assert.deepEqual(errors, []);
      console.log(mobile ? "mobile PASS" : "desktop PASS");
      await ctx.close();
    }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});

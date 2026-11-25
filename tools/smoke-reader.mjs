// Run from the repository root after a production build with
// NEXT_PUBLIC_API_URL=http://127.0.0.1:43871/v1. Uses only loopback fixtures.
import http from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import assert from "node:assert/strict";
const course = {
  id: 1,
  path: "abi",
  lang: "zh",
  title: "存储课",
  status: "published",
  description: "示例",
  cover: "/images/banner.jpeg",
  contributors: [],
  chapters: [1],
};
const chapter = {
  id: 1,
  path: "slots",
  lang: "zh",
  title: "槽位",
  content:
    "## 读取\n\n这是测试正文。\n\n## 写入\n\n第二节。\n\n[源码](demo.sol)",
  content_url:
    "https://raw.githubusercontent.com/example/course/" +
    "a".repeat(40) +
    "/chapters/slots/zh.md",
  updated_at: "2026-07-01 12:00:00",
  author: { username: "editor" },
  study_time: 5,
};
const api = http.createServer((req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "*");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  const p = new URL(req.url, "http://localhost").pathname;
  const data = p.endsWith("/courses")
    ? { published: [course], unpublished: [] }
    : p.endsWith("/chapters")
    ? { list: [chapter] }
    : p.endsWith("/chapter/slots")
    ? chapter
    : p.endsWith("/course/abi")
    ? course
    : undefined;
  res.setHeader("content-type", "application/json");
  res.end(
    JSON.stringify(
      data ? { code: 0, data } : { code: 10001, msg: "Chapter not found" }
    )
  );
});
api.listen(43871, "127.0.0.1");
await once(api, "listening");
const web = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "-H",
    "127.0.0.1",
    "-p",
    "43872",
  ],
  { stdio: ["ignore", "pipe", "pipe"] }
);
web.stderr.on("data", (b) => process.stderr.write(b));
try {
  await new Promise((ok, fail) => {
    const t = setTimeout(() => fail(Error("start timeout")), 20000);
    web.stdout.on("data", (b) => {
      if (b.includes("Ready")) {
        clearTimeout(t);
        ok();
      }
    });
  });
  const checks = [
    ["/zh/course/abi/slots", 200, "<p>这是测试正文。</p>"],
    ["/zh/course/abi/slots/source", 200, "## 读取"],
    ["/en/course/abi/slots", 307, ""],
    ["/zh/course/abi/none", 404, ""],
    ["/sitemap.xml", 200, "/zh/course/abi/slots"],
  ];
  for (const ua of ["Googlebot", "Mozilla/5.0"])
    for (const [path, status, needle] of checks) {
      const r = await fetch("http://127.0.0.1:43872" + path, {
        redirect: "manual",
        headers: { "user-agent": ua },
      });
      const body = await r.text();
      console.log(
        ua,
        path,
        r.status,
        body.includes(needle),
        r.headers.get("location"),
        body.includes("NEXT_HTTP_ERROR_FALLBACK;404")
      );
      assert.equal(r.status, status, path);
      assert(body.includes(needle), path);
      if (path === "/zh/course/abi/slots") {
        const data = JSON.parse(
          body.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]
        );
        assert.equal(data.inLanguage, "zh");
        assert.equal(data.name, "槽位");
      }
      if (status === 307)
        assert.equal(r.headers.get("location"), "/zh/course/abi/slots");
      if (path.endsWith("/source")) {
        assert.match(r.headers.get("content-type"), /^text\/markdown/);
        assert(body.includes("/chapters/slots/demo.sol"));
      }
      if (path === "/sitemap.xml")
        assert(!body.includes("/en/course/abi/slots"));
    }
} finally {
  web.kill();
  api.close();
}

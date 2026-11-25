import { expect, it } from "vitest";
import { catalogSitemap } from "./catalog-sitemap";

const courses = async () => ({ published: [{ path: "abi", lang: "zh" }], unpublished: [] });

it("only advertises actual translations and uses the editorial date", async () => {
  const entries = await catalogSitemap(courses, async () => [
    { path: "slots", lang: "zh", updated_at: "2026-07-01 12:22:31" },
  ]);
  const chapter = entries.filter(e => e.url.endsWith("/slots"));
  expect(chapter).toHaveLength(1);
  expect(chapter[0].url).toContain("/zh/course/abi/");
  expect(chapter[0].lastModified).toBe("2026-07-01");
  expect(Object.keys(chapter[0].alternates!.languages!)).toEqual(["zh"]);
});

it("rejects a partial catalog so it cannot replace a complete cached sitemap", async () => {
  await expect(catalogSitemap(courses, async () => { throw Error("offline"); }))
    .rejects.toThrow("offline");
});

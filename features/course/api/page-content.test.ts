import { it, expect } from "vitest";
import { pageContent } from "./page-content";

it("resolves missing content separately from upstream failures", () => {
  const result = { code: 10001, data: {lang: ""}, msg: "Chapter not found" };
  expect(() => pageContent(result, "zh")).toThrow(/NEXT_(HTTP_ERROR_FALLBACK;404|NOT_FOUND)/);
  expect(() => pageContent({...result, msg: "Failed to get chapter"}, "zh"))
    .toThrow("Course service returned an error");
});

it("redirects only when the requested edition is missing", () => {
  const result = {code: 0, data: {lang: "zh"}, msg: ""};
  expect(pageContent(result, "zh", "/course/abi")).toEqual(result.data);
  expect(() => pageContent(result, "en", "/course/abi")).toThrow("NEXT_REDIRECT");
});

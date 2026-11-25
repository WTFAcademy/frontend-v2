import { describe, expect, it } from "vitest";

import {
  checkBudgets,
  findAdminLeaks,
  parseImports,
  resolveSpecifier,
} from "./bundle-guard.mjs";

/**
 * SPEC-admin-port §4: "管理端代码不进入学员端首包".
 *
 * These tests are the proof that the guard is a real check and not a stub:
 * every one of them builds a graph/manifest that DOES violate the constraint
 * and asserts the guard reports it, alongside the clean case.
 */

// --- a tiny in-memory repo, so the guard is tested without touching disk ---
const repo = (files: Record<string, string>) => ({
  exists: (p: string) => Object.prototype.hasOwnProperty.call(files, p),
  readFile: (p: string) => files[p],
  entries: Object.keys(files).filter((p) => p.startsWith("app/")),
});

describe("parseImports", () => {
  it("finds a static named import", () => {
    expect(parseImports(`import { a } from "@/lib/a";`)).toEqual(["@/lib/a"]);
  });

  it("finds a default import with single quotes", () => {
    expect(parseImports(`import A from './a'`)).toEqual(["./a"]);
  });

  it("finds a side-effect import", () => {
    expect(parseImports(`import "@/styles/globals.css";`)).toEqual(["@/styles/globals.css"]);
  });

  it("finds a re-export", () => {
    expect(parseImports(`export { a } from "./a";`)).toEqual(["./a"]);
  });

  it("finds a star re-export", () => {
    expect(parseImports(`export * from "./a";`)).toEqual(["./a"]);
  });

  it("finds a dynamic import (the lazy-loading escape hatch)", () => {
    expect(parseImports(`const M = dynamic(() => import("@/features/admin/x"));`)).toEqual([
      "@/features/admin/x",
    ]);
  });

  it("finds a require call", () => {
    expect(parseImports(`const x = require("monaco-editor");`)).toEqual(["monaco-editor"]);
  });

  it("finds several imports in one file, in order", () => {
    expect(
      parseImports(`import a from "a";\nimport b from "b";\nawait import("c");`)
    ).toEqual(["a", "b", "c"]);
  });

  it("returns an empty list for a file with no imports", () => {
    expect(parseImports(`export const x = 1;`)).toEqual([]);
  });

  it("does not treat the word import inside a string as an import", () => {
    expect(parseImports(`const s = "please import from somewhere";`)).toEqual([]);
  });
});

describe("resolveSpecifier", () => {
  const { exists } = repo({
    "lib/a.ts": "",
    "components/b.tsx": "",
    "features/c/index.ts": "",
    "styles/x.css": "",
  });

  it("resolves the @/ alias to a repo-relative .ts file", () => {
    expect(resolveSpecifier("@/lib/a", "app/page.tsx", exists)).toEqual({
      kind: "internal",
      path: "lib/a.ts",
    });
  });

  it("resolves the @/ alias to a .tsx file", () => {
    expect(resolveSpecifier("@/components/b", "app/page.tsx", exists)).toEqual({
      kind: "internal",
      path: "components/b.tsx",
    });
  });

  it("resolves a directory to its index file", () => {
    expect(resolveSpecifier("@/features/c", "app/page.tsx", exists)).toEqual({
      kind: "internal",
      path: "features/c/index.ts",
    });
  });

  it("resolves a relative specifier against the importing file's directory", () => {
    // app/sub/page.tsx -> dirname app/sub -> ../../lib/a -> lib/a(.ts)
    expect(resolveSpecifier("../../lib/a", "app/sub/page.tsx", exists)).toEqual({
      kind: "internal",
      path: "lib/a.ts",
    });
  });

  it("resolves ./ against the importing file's own directory", () => {
    const local = repo({ "app/sub/helper.ts": "" });
    expect(resolveSpecifier("./helper", "app/sub/page.tsx", local.exists)).toEqual({
      kind: "internal",
      path: "app/sub/helper.ts",
    });
  });

  it("resolves a specifier that already carries its extension", () => {
    expect(resolveSpecifier("@/styles/x.css", "app/page.tsx", exists)).toEqual({
      kind: "internal",
      path: "styles/x.css",
    });
  });

  it("classifies a bare specifier as an external package", () => {
    expect(resolveSpecifier("@tanstack/react-table", "app/page.tsx", exists)).toEqual({
      kind: "external",
      pkg: "@tanstack/react-table",
    });
  });

  it("reduces a deep package path to the package name", () => {
    expect(resolveSpecifier("monaco-editor/esm/vs/editor/editor.api", "app/page.tsx", exists)).toEqual(
      { kind: "external", pkg: "monaco-editor" }
    );
  });

  it("reduces a deep scoped package path to the scoped package name", () => {
    expect(resolveSpecifier("@monaco-editor/react/lib/x", "app/page.tsx", exists)).toEqual({
      kind: "external",
      pkg: "@monaco-editor/react",
    });
  });

  it("returns null for an internal-looking path that does not exist", () => {
    expect(resolveSpecifier("@/lib/nope", "app/page.tsx", exists)).toBeNull();
  });
});

describe("findAdminLeaks", () => {
  const adminDirs = ["features/admin/", "components/data-table/"];
  const adminPkgs = ["@tanstack/react-table", "monaco-editor"];
  const opts = { adminDirs, adminPkgs };

  it("reports nothing when learner routes touch no admin code", () => {
    const r = repo({
      "app/[lang]/(main)/page.tsx": `import { Card } from "@/components/card";`,
      "components/card.tsx": `import { cn } from "@/lib/utils";`,
      "lib/utils.ts": ``,
    });
    expect(findAdminLeaks(r, opts)).toEqual([]);
  });

  it("reports a learner page importing an admin module directly", () => {
    const r = repo({
      "app/[lang]/(main)/page.tsx": `import { DataTable } from "@/components/data-table/data-table";`,
      "components/data-table/data-table.tsx": ``,
    });
    const leaks = findAdminLeaks(r, opts);
    expect(leaks).toHaveLength(1);
    expect(leaks[0].module).toBe("components/data-table/data-table.tsx");
    expect(leaks[0].chain).toEqual([
      "app/[lang]/(main)/page.tsx",
      "components/data-table/data-table.tsx",
    ]);
  });

  it("reports an admin module reached transitively through a shared component", () => {
    const r = repo({
      "app/[lang]/(main)/course/page.tsx": `import { Shared } from "@/components/shared";`,
      "components/shared.tsx": `import { X } from "@/features/admin/x";`,
      "features/admin/x.ts": ``,
    });
    const leaks = findAdminLeaks(r, opts);
    expect(leaks).toHaveLength(1);
    expect(leaks[0].chain).toEqual([
      "app/[lang]/(main)/course/page.tsx",
      "components/shared.tsx",
      "features/admin/x.ts",
    ]);
  });

  it("reports an admin-only package imported from a learner route", () => {
    const r = repo({
      "app/[lang]/(main)/page.tsx": `import { useReactTable } from "@tanstack/react-table";`,
    });
    const leaks = findAdminLeaks(r, opts);
    expect(leaks).toHaveLength(1);
    expect(leaks[0].module).toBe("@tanstack/react-table");
  });

  it("catches the dynamic-import escape hatch too", () => {
    const r = repo({
      "app/[lang]/(main)/page.tsx": `const E = dynamic(() => import("monaco-editor"));`,
    });
    expect(findAdminLeaks(r, opts)).toHaveLength(1);
  });

  it("allows admin routes to import admin code", () => {
    const r = repo({
      "app/[lang]/(admin)/courses/page.tsx": `import { DataTable } from "@/components/data-table/data-table";`,
      "components/data-table/data-table.tsx": `import { useReactTable } from "@tanstack/react-table";`,
    });
    expect(findAdminLeaks(r, opts)).toEqual([]);
  });

  it("does not blame an admin route for code a learner route also reaches", () => {
    const r = repo({
      "app/[lang]/(admin)/page.tsx": `import { X } from "@/features/admin/x";`,
      "app/[lang]/(main)/page.tsx": `import { cn } from "@/lib/utils";`,
      "features/admin/x.ts": ``,
      "lib/utils.ts": ``,
    });
    expect(findAdminLeaks(r, opts)).toEqual([]);
  });

  it("matches an admin directory as a path PREFIX, not anywhere in the path", () => {
    // A learner-side directory that merely ends with the same name is not the
    // admin component; flagging it would be a false positive that trains
    // people to ignore the guard.
    const r = repo({
      "app/[lang]/(main)/course/page.tsx": `import "@/features/course/components/data-table/row";`,
      "features/course/components/data-table/row.tsx": ``,
    });
    expect(findAdminLeaks(r, opts)).toEqual([]);
  });

  it("does not flag ordinary third-party packages", () => {
    const r = repo({
      "app/[lang]/(main)/page.tsx": `import React from "react";\nimport { motion } from "framer-motion";`,
    });
    expect(findAdminLeaks(r, opts)).toEqual([]);
  });

  it("reports one admin module once even when several learner routes reach it", () => {
    const r = repo({
      "app/[lang]/(main)/a/page.tsx": `import "@/features/admin/x";`,
      "app/[lang]/(main)/b/page.tsx": `import "@/features/admin/x";`,
      "features/admin/x.ts": ``,
    });
    const leaks = findAdminLeaks(r, opts);
    expect(leaks).toHaveLength(1);
    expect(leaks[0].chain[0]).toBe("app/[lang]/(main)/a/page.tsx");
  });

  it("terminates on a circular import graph", () => {
    const r = repo({
      "app/[lang]/(main)/page.tsx": `import "@/lib/a";`,
      "lib/a.ts": `import "@/lib/b";`,
      "lib/b.ts": `import "@/lib/a";`,
    });
    expect(findAdminLeaks(r, opts)).toEqual([]);
  });

  it("ignores imports that resolve to nothing", () => {
    const r = repo({ "app/[lang]/(main)/page.tsx": `import "@/lib/ghost";` });
    expect(findAdminLeaks(r, opts)).toEqual([]);
  });

  it("reports every distinct leaking module, not just the first", () => {
    const r = repo({
      "app/[lang]/(main)/page.tsx": `import "@/features/admin/a";\nimport "monaco-editor";`,
      "features/admin/a.ts": ``,
    });
    expect(findAdminLeaks(r, opts)).toHaveLength(2);
  });
});

describe("checkBudgets", () => {
  const manifest = {
    pages: {
      "/[lang]/(main)/page": ["static/chunks/a.js", "static/css/a.css"],
      "/[lang]/(admin)/page": ["static/chunks/big.js"],
    },
  };
  const sizeOf = (f: string) =>
    ({ "static/chunks/a.js": 1000, "static/css/a.css": 5000, "static/chunks/big.js": 900000 })[f]!;

  it("passes when every learner route is inside its budget", () => {
    expect(checkBudgets(manifest, sizeOf, { "/[lang]/(main)/page": 1200 })).toEqual([]);
  });

  it("counts only JS, not CSS", () => {
    // 1000 B of JS + 5000 B of CSS; a 1200 B budget passes only if CSS is excluded.
    expect(checkBudgets(manifest, sizeOf, { "/[lang]/(main)/page": 1200 })).toEqual([]);
  });

  it("reports a learner route that grew past its budget", () => {
    const v = checkBudgets(manifest, sizeOf, { "/[lang]/(main)/page": 900 });
    expect(v).toHaveLength(1);
    expect(v[0]).toMatchObject({ route: "/[lang]/(main)/page", bytes: 1000, budget: 900 });
  });

  it("passes a route sitting exactly on its budget", () => {
    expect(checkBudgets(manifest, sizeOf, { "/[lang]/(main)/page": 1000 })).toEqual([]);
  });

  it("reports a learner route with no recorded budget", () => {
    const v = checkBudgets(manifest, sizeOf, {});
    expect(v).toHaveLength(1);
    expect(v[0].budget).toBeNull();
  });

  it("reports a budgetless route even when it ships zero JS bytes", () => {
    // A route whose manifest entry is CSS-only weighs 0 B. It still needs a
    // recorded budget, otherwise a new route could be added with no ceiling
    // and later grow unnoticed.
    const cssOnly = { pages: { "/[lang]/(main)/x/page": ["static/css/a.css"] } };
    const v = checkBudgets(cssOnly, sizeOf, {});
    expect(v).toEqual([{ route: "/[lang]/(main)/x/page", bytes: 0, budget: null }]);
  });

  it("ignores admin routes entirely", () => {
    const v = checkBudgets(manifest, sizeOf, { "/[lang]/(main)/page": 1200 });
    expect(v.some((x) => x.route.includes("(admin)"))).toBe(false);
  });
});

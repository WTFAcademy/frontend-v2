#!/usr/bin/env node
/**
 * CLI for tools/bundle-guard.mjs — the SPEC-admin-port §4 negative constraint
 * "管理端代码不进入学员端首包", run against this repo and its real build.
 *
 *   node tools/check-bundles.mjs                    # both layers, non-zero on violation
 *   node tools/check-bundles.mjs --update-budgets   # re-record the byte ceilings
 *
 * Layer 2 needs `next build` to have run (.next/app-build-manifest.json); it is
 * reported as skipped, not silently passed, when the build is absent.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ADMIN_DIRS, ADMIN_PACKAGES, checkBudgets, findAdminLeaks } from "./bundle-guard.mjs";

const ROOT = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const BUDGETS_FILE = path.join(ROOT, "tools", "bundle-budgets.json");
const SOURCE_ROOTS = ["app", "components", "features", "hooks", "lib"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".js", ".jsx", ".mjs"]);
/** Absolute slack over the recorded ceiling, in bytes. Smaller than any admin dep. */
const HEADROOM = 20 * 1024;

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(rel, out);
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name)) && !rel.includes(".test.")) out.push(rel);
  }
  return out;
};

const files = SOURCE_ROOTS.filter((d) => fs.existsSync(path.join(ROOT, d))).flatMap((d) => walk(d));
const fileSet = new Set(files);

const repo = {
  entries: files.filter((f) => f.startsWith("app/")),
  exists: (p) => fileSet.has(p),
  readFile: (p) => fs.readFileSync(path.join(ROOT, p), "utf8"),
};

let failed = false;

console.log("--- layer 1: source import graph");
console.log(`    entries: ${repo.entries.length} under app/, ${files.length} source files indexed`);
console.log(`    admin dirs: ${ADMIN_DIRS.join(", ")}`);
console.log(`    admin packages: ${ADMIN_PACKAGES.join(", ")}`);
const leaks = findAdminLeaks(repo);
if (leaks.length > 0) {
  failed = true;
  for (const leak of leaks) console.error(`    LEAK ${leak.module}\n      via ${leak.chain.join(" -> ")}`);
} else {
  console.log("    0 admin modules reachable from learner routes");
}

console.log("--- layer 2: build artifact byte budgets");
const manifestPath = path.join(ROOT, ".next", "app-build-manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.log("    SKIPPED: no .next/app-build-manifest.json (run `next build` first)");
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const sizeOf = (f) => fs.statSync(path.join(ROOT, ".next", f)).size;

  if (process.argv.includes("--update-budgets")) {
    const measured = checkBudgets(manifest, sizeOf, {});
    const budgets = Object.fromEntries(
      measured.map((m) => [m.route, m.bytes + HEADROOM]).sort((a, b) => a[0].localeCompare(b[0]))
    );
    fs.writeFileSync(BUDGETS_FILE, `${JSON.stringify(budgets, null, 2)}\n`);
    console.log(`    wrote ${Object.keys(budgets).length} budgets to tools/bundle-budgets.json`);
  } else {
    const budgets = JSON.parse(fs.readFileSync(BUDGETS_FILE, "utf8"));
    const over = checkBudgets(manifest, sizeOf, budgets);
    if (over.length > 0) {
      failed = true;
      for (const v of over) {
        console.error(
          v.budget === null
            ? `    NO BUDGET ${v.route} (${v.bytes} B) — add it with --update-budgets`
            : `    OVER BUDGET ${v.route}: ${v.bytes} B > ${v.budget} B (+${v.bytes - v.budget})`
        );
      }
    } else {
      console.log(`    ${Object.keys(budgets).length} learner routes within budget`);
    }
  }
}

process.exit(failed ? 1 : 0);

/**
 * Bundle guard — enforcement for SPEC-admin-port §4:
 * "管理端代码不进入学员端首包" (no admin JS in learner bundles).
 *
 * Two independent layers, because neither alone is sufficient:
 *
 *  1. SOURCE GRAPH (`findAdminLeaks`) — walks the static import graph from
 *     every non-admin entry under app/ and fails if it can reach an admin-only
 *     directory or an admin-only npm package. Precise, names the import chain,
 *     runs without a build.
 *
 *  2. BUILD ARTIFACT (`checkBudgets`) — sums the real per-route client JS bytes
 *     from .next/app-build-manifest.json and fails if a learner route exceeds
 *     its recorded ceiling in tools/bundle-budgets.json. This is the layer that
 *     survives dynamic/indirect imports the source walk cannot see, and it is
 *     stated in the units of the actual harm (learner first-load weight).
 *
 * Why the artifact layer is a byte budget rather than a "chunk must not contain
 * the string @tanstack/react-table" scan: measured on this repo's own
 * production build, package identifiers do NOT survive minification — grepping
 * .next/static/chunks for "framer-motion", "@reown/appkit", "canvas-confetti"
 * or "getCoreRowModel" returns zero files, though all four are bundled. A name
 * scan would therefore be a check that can never fire. See SPEC §6 R1.
 *
 * Pure functions take their filesystem and manifest as arguments so the guard
 * itself is unit-testable (tools/bundle-guard.test.mts) against graphs that
 * really do violate the constraint.
 */

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".jsx", ".mjs"];
const INDEX_SUFFIXES = SOURCE_EXTENSIONS.map((ext) => `/index${ext}`);

/** Route-group segment marking an admin-only entry point. */
export const ADMIN_ROUTE_SEGMENT = "(admin)";

/** Directories only the admin app may reach. */
export const ADMIN_DIRS = ["features/admin/", "components/data-table/"];

/** Packages only the admin app may pull in. */
export const ADMIN_PACKAGES = [
  "@tanstack/react-table",
  "monaco-editor",
  "@monaco-editor/react",
];

// `from "x"` / `import "x"` / `import("x")` / `require("x")`, single or double
// quoted. Deliberately anchored on the keyword so quoted prose is not matched.
const IMPORT_RE =
  /(?:\bfrom\s*|\bimport\s*|\brequire\s*)\(?\s*["']([^"']+)["']/g;

/** Every module specifier a source file imports, in source order. */
export function parseImports(source) {
  return [...source.matchAll(IMPORT_RE)].map((m) => m[1]);
}

const normalize = (p) => {
  const out = [];
  for (const part of p.split("/")) {
    if (part === "." || part === "") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
};

const packageName = (specifier) => {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
};

/**
 * Resolve one specifier to `{kind:"internal", path}`, `{kind:"external", pkg}`,
 * or null when an internal-looking path matches no file.
 */
export function resolveSpecifier(specifier, fromFile, exists) {
  let base;
  if (specifier.startsWith("@/")) {
    base = normalize(specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    const dir = fromFile.split("/").slice(0, -1).join("/");
    base = normalize(`${dir}/${specifier}`);
  } else {
    return { kind: "external", pkg: packageName(specifier) };
  }

  const candidates = [base, ...SOURCE_EXTENSIONS.map((e) => base + e), ...INDEX_SUFFIXES.map((s) => base + s)];
  const hit = candidates.find((c) => exists(c));
  return hit ? { kind: "internal", path: hit } : null;
}

const isAdminEntry = (file) => file.includes(ADMIN_ROUTE_SEGMENT);

/**
 * Walk the import graph from every learner entry and report each admin module
 * or admin package it can reach, with the chain that got there.
 *
 * @param repo {{entries: string[], exists: (p:string)=>boolean, readFile: (p:string)=>string}}
 */
export function findAdminLeaks(repo, { adminDirs = ADMIN_DIRS, adminPkgs = ADMIN_PACKAGES } = {}) {
  const leaks = new Map();
  const seen = new Set();
  const record = (module, chain) => {
    if (!leaks.has(module)) leaks.set(module, { module, chain });
  };

  const queue = repo.entries
    .filter((entry) => !isAdminEntry(entry))
    .map((entry) => ({ file: entry, chain: [entry] }));

  while (queue.length > 0) {
    const { file, chain } = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);

    for (const specifier of parseImports(repo.readFile(file))) {
      const resolved = resolveSpecifier(specifier, file, repo.exists);
      if (resolved === null) continue;

      if (resolved.kind === "external") {
        if (adminPkgs.includes(resolved.pkg)) record(resolved.pkg, [...chain, resolved.pkg]);
        continue;
      }

      const next = [...chain, resolved.path];
      if (adminDirs.some((dir) => resolved.path.startsWith(dir))) {
        record(resolved.path, next);
        continue;
      }
      queue.push({ file: resolved.path, chain: next });
    }
  }

  return [...leaks.values()];
}

/**
 * Compare each learner route's client JS weight against its recorded budget.
 *
 * @param manifest  parsed .next/app-build-manifest.json
 * @param sizeOf    (file) => bytes, relative to .next/
 * @param budgets   route -> max bytes (tools/bundle-budgets.json)
 */
export function checkBudgets(manifest, sizeOf, budgets) {
  const violations = [];

  for (const [route, files] of Object.entries(manifest.pages)) {
    if (isAdminEntry(route)) continue;

    const bytes = files
      .filter((f) => f.endsWith(".js"))
      .reduce((total, f) => total + sizeOf(f), 0);

    const budget = Object.prototype.hasOwnProperty.call(budgets, route) ? budgets[route] : null;
    if (budget === null || bytes > budget) violations.push({ route, bytes, budget });
  }

  return violations;
}

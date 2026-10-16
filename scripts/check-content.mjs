import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = (p) => resolve(root, "src", p);
const read = (p) => readFileSync(p, "utf8");
const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

const walk = (d, acc = []) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(jsx?|mjs)$/.test(p)) acc.push(p);
  }
  return acc;
};

// 1. Check Routes & Imports
const app = read(src("App.jsx"));
const imports = new Map();
for (const m of app.matchAll(/(?:const (\w+) = lazy\(\(\) => import\(|import (\w+) from )"(\.\/pages\/[^"]+)"/g)) {
  imports.set(m[1] ?? m[2], m[3]);
}

const routes = [...app.matchAll(/<Route path="([^"]+)" element={<(\w+)\s*\/>}/g)].map((m) => ({
  path: m[1],
  comp: m[2],
}));
const routePaths = new Set(routes.map((r) => r.path));

const pageFile = (rel) => src(rel.replace("./", "") + ".jsx");
for (const [comp, rel] of imports) {
  if (!existsSync(pageFile(rel))) {
    fail("App.jsx", `${comp} imports missing file ${rel}.jsx`);
  }
}

for (const r of routes) {
  if (!imports.has(r.comp)) {
    fail("App.jsx", `route ${r.path} renders ${r.comp}, which is not imported`);
  }
}

// 2. Dead Code Check
const allFiles = walk(src("."));
const corpus = allFiles.map((f) => [f, read(f)]);

for (const f of walk(src("pages"))) {
  const base = relative(src("."), f).replace(/\.jsx$/, "");
  const name = base.split("/").pop();
  const used = corpus.some(
    ([g, s]) => g !== f && (s.includes(`"./${base}"`) || s.includes(`"./${name}"`))
  );
  if (!used) fail(relative(root, f), "page file is not imported anywhere");
}

// 3. Internal Links Check
const okRoute = (p) => {
  const bare = p.split("#")[0].split("?")[0].replace(/(.)\/$/, "$1");
  return routePaths.has(bare);
};

const LINK_RE = /(?:\bto=|\bhref=|\bpath:)\s*\{?\s*["'`](#?\/[a-z0-9][^"'`\s$]*)["'`]/gi;
for (const [f, s] of corpus) {
  if (f.endsWith("searchIndex.json")) continue;
  for (const m of s.matchAll(LINK_RE)) {
    const target = m[1].replace(/^#/, "");
    if (!okRoute(target)) {
      fail(relative(root, f), `link to unknown route ${m[1]}`);
    }
  }
}

// 4. TOC Hashes Match Element IDs
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
for (const r of routes) {
  const rel = imports.get(r.comp);
  if (!rel || !existsSync(pageFile(rel))) continue;
  const file = pageFile(rel);
  const text = read(file);

  let scope = text;
  for (const m of text.matchAll(/from\s+["'](\.\.?\/[^"']+)["']/g)) {
    for (const ext of ["", ".jsx", ".js"]) {
      const p = resolve(dirname(file), m[1] + ext);
      if (existsSync(p) && statSync(p).isFile()) {
        scope += read(p);
        break;
      }
    }
  }

  const tocBlock = text.match(/(?:const toc\s*=|toc=\{)\s*\[([\s\S]*?)\]/)?.[1] ?? "";
  for (const m of tocBlock.matchAll(/hash:\s*["'`]#?([^"'`$]+)["'`]/g)) {
    const h = m[1];
    const re = new RegExp(`\\bid\\s*[=:]\\s*\\{?\\s*["'\`]${escape(h)}["'\`]`);
    if (!re.test(scope)) {
      fail(relative(root, file), `TOC entry #${h} has no matching DOM element id="${h}"`);
    }
  }
}

// Report
if (problems.length) {
  console.error(`❌ Content check failed with ${problems.length} problem${problems.length === 1 ? "" : "s"}:`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}

console.log(`✅ Content OK: ${routes.length} routes checked, 0 dead pages, 0 broken links, 0 orphaned TOC hashes.`);

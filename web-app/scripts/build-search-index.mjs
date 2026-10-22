import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = readFileSync(resolve(root, "src/App.jsx"), "utf8");

// component -> file path
const imports = new Map();
for (const m of app.matchAll(/(?:const (\w+) = lazy\(\(\) => import\(|import (\w+) from )"(\.\/pages\/[^"]+)"/g)) {
  imports.set(m[1] ?? m[2], m[3]);
}

// route -> component
const routes = [];
for (const m of app.matchAll(/<Route path="([^"]+)" element={<(\w+)\s*\/>}/g)) {
  if (m[1] !== "*") routes.push({ path: m[1], comp: m[2] });
}

const strip = (s) => s.replace(/\s+/g, " ").replace(/[`*]/g, "").trim();

const entries = [];
for (const { path, comp } of routes) {
  const rel = imports.get(comp);
  if (!rel) continue;
  const file = resolve(root, "src", rel.replace("./", "") + ".jsx");
  if (!existsSync(file)) continue;
  const src = readFileSync(file, "utf8");

  const layout = src.match(/<GuideLayout\b([\s\S]*?)>/)?.[1] ?? "";
  const attr = (name) =>
    layout.match(new RegExp(`\\b${name}=(?:"([^"]+)"|\\{\\s*["'\`]([^"'\`]+)["'\`]\\s*\\})`))?.slice(1).find(Boolean);

  const title =
    attr("title") ??
    src.match(/title="([^"]+)"/)?.[1] ??
    comp.replace(/([a-z])([A-Z])/g, "$1 $2");

  let intro = attr("intro") ?? src.match(/intro="([^"]+)"/)?.[1] ?? "";
  if (intro.includes("${")) intro = "";

  const sections = [];
  for (const m of src.matchAll(/\{\s*label:\s*["'`]([^"'`]+)["'`],\s*hash:\s*["'`]#?([^"'`]+)["'`]/g)) {
    sections.push({ label: strip(m[1]), hash: m[2].replace(/^#/, "") });
  }

  const kwBlock = src.match(/SEARCH_KEYWORDS\s*=\s*\[([\s\S]*?)\]/)?.[1] ?? "";
  const keywords = [...kwBlock.matchAll(/["'`]([^"'`]+)["'`]/g)].map((m) => strip(m[1]));

  entries.push({ path, title: strip(title), intro: strip(intro), sections, keywords });
}

entries.sort((a, b) => a.path.localeCompare(b.path));

const dataDir = resolve(root, "src/data");
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

writeFileSync(
  resolve(dataDir, "searchIndex.json"),
  JSON.stringify(entries, null, 2) + "\n"
);

const secs = entries.reduce((n, e) => n + e.sections.length, 0);
const kws = entries.reduce((n, e) => n + e.keywords.length, 0);
console.log(`Search Index Generated: ${entries.length} pages, ${secs} sections, ${kws} keywords.`);

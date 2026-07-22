// Phase 4 migration, driven by blog-audit.md so KEEP/DELETE can't drift.
//   KEEP   -> git mv blogs/<slug>.md drafts/<slug>.md  (+ status/aiAssisted frontmatter)
//   DELETE -> git rm blogs/<slug>.md
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const AUDIT = "blog-audit.md";
const BLOG_DIR = "blogs";
const DRAFT_DIR = "drafts";

const git = (...args) => execFileSync("git", args, { stdio: "pipe" }).toString();

// Parse the "Full verdict table" rows: | KEEP | `slug` | ...
const audit = fs.readFileSync(AUDIT, "utf-8");
const keep = [];
const del = [];
for (const line of audit.split("\n")) {
  const m = line.match(/^\|\s*(KEEP|DELETE)\s*\|\s*`([^`]+)`\s*\|/);
  if (!m) continue;
  (m[1] === "KEEP" ? keep : del).push(m[2]);
}
console.log(`Parsed audit: ${keep.length} KEEP, ${del.length} DELETE`);
if (keep.length !== 22 || del.length !== 69) {
  console.error("Unexpected counts; aborting.");
  process.exit(1);
}

// Sanity: every referenced file must exist in blogs/ right now.
const present = new Set(fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")));
const missing = [...keep, ...del].filter((s) => !present.has(s));
if (missing.length) {
  console.error("These audit slugs are not in blogs/:", missing);
  process.exit(1);
}

fs.mkdirSync(DRAFT_DIR, { recursive: true });

// Insert `status: draft` / `aiAssisted: true` into the frontmatter block if absent,
// preserving every existing line (including the original date) verbatim.
function ensureFrontmatter(file) {
  const raw = fs.readFileSync(file, "utf-8");
  const fm = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fm) throw new Error(`No frontmatter in ${file}`);
  const [, open, body, close] = fm;
  const rest = raw.slice(fm[0].length);
  const lines = body.split(/\r?\n/);
  const hasKey = (k) => lines.some((l) => new RegExp(`^${k}\\s*:`).test(l));
  const additions = [];
  if (!hasKey("status")) additions.push("status: draft");
  else lines.forEach((l, i) => { if (/^status\s*:/.test(l)) lines[i] = "status: draft"; });
  if (!hasKey("aiAssisted")) additions.push("aiAssisted: true");
  const newBody = [...lines, ...additions].join("\n");
  if (newBody !== body) fs.writeFileSync(file, open + newBody + close + rest);
}

for (const slug of keep) {
  const from = path.join(BLOG_DIR, `${slug}.md`);
  const to = path.join(DRAFT_DIR, `${slug}.md`);
  git("mv", from, to);
  ensureFrontmatter(to);
  git("add", to);
}
console.log(`Moved ${keep.length} posts to ${DRAFT_DIR}/ with status+aiAssisted.`);

for (const slug of del) {
  git("rm", "--quiet", path.join(BLOG_DIR, `${slug}.md`));
}
console.log(`Deleted ${del.length} posts from ${BLOG_DIR}/.`);

// blogs/ is now empty of markdown; keep the dir in git.
fs.writeFileSync(path.join(BLOG_DIR, ".gitkeep"), "");
git("add", path.join(BLOG_DIR, ".gitkeep"));

const remaining = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).length;
const drafts = fs.readdirSync(DRAFT_DIR).filter((f) => f.endsWith(".md")).length;
console.log(`Done. blogs/ md files: ${remaining}, drafts/ md files: ${drafts}`);

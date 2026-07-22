// One-off: rewrite the `title:` line of every blog to a JSON-quoted string.
// Usage: node fixTitles.mjs [--check]   (repo root as cwd)
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = "blogs";
const checkOnly = process.argv.includes("--check");

function parseCounts() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  let ok = 0;
  let fail = 0;
  const failed = [];
  for (const f of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
    try {
      matter(raw);
      ok++;
    } catch {
      fail++;
      failed.push(f);
    }
  }
  return { total: files.length, ok, fail, failed, files };
}

const before = parseCounts();
console.log(`BEFORE:  ${before.ok}/${before.total} parse, ${before.fail} failing`);

if (checkOnly) {
  process.exit(before.fail === 0 ? 0 : 1);
}

let rewritten = 0;
for (const f of before.files) {
  const p = path.join(BLOG_DIR, f);
  const raw = fs.readFileSync(p, "utf-8");

  // Only touch the frontmatter block (between the first two `---` fences).
  const fm = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fm) continue;

  const [, open, body, close] = fm;
  const rest = raw.slice(fm[0].length);

  const lines = body.split(/\r?\n/);
  let changed = false;
  // Both `title` and `description` are free-text values that the old generator
  // wrote unquoted, so a colon in the topic breaks YAML parsing on both lines.
  const newLines = lines.map((line) => {
    const m = line.match(/^(title|description):\s*(.*)$/);
    if (!m) return line;
    const key = m[1];
    let value = m[2].trim();
    // If already a valid JSON-quoted string, decode it first so we don't double-quote.
    if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
      try {
        value = JSON.parse(value);
      } catch {
        /* leave as-is; treat the whole thing as a raw string below */
      }
    }
    const quoted = `${key}: ${JSON.stringify(value)}`;
    if (quoted !== line) changed = true;
    return quoted;
  });

  if (changed) {
    const out = open + newLines.join("\n") + close + rest;
    fs.writeFileSync(p, out);
    rewritten++;
  }
}

const after = parseCounts();
console.log(`Rewritten titles in ${rewritten} file(s)`);
console.log(`AFTER:   ${after.ok}/${after.total} parse, ${after.fail} failing`);
if (after.failed.length) {
  console.log("Still failing:");
  after.failed.forEach((f) => console.log("  " + f));
}
process.exit(after.fail === 0 ? 0 : 1);

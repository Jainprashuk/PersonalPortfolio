#!/usr/bin/env node
//
// Publish a draft: node scripts/publish.js <slug>
// Run with no arguments to list what is waiting in drafts/.
//
// Moves drafts/<slug>.md -> blogs/<slug>.md, flips status to published,
// and refuses to publish anything still carrying unresolved author markers.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DRAFT_DIR = "drafts";
const BLOG_DIR = "blogs";

function listDrafts() {
  if (!fs.existsSync(DRAFT_DIR)) return [];
  return fs.readdirSync(DRAFT_DIR).filter((f) => f.endsWith(".md"));
}

function showDrafts() {
  const drafts = listDrafts();

  if (drafts.length === 0) {
    console.log("No drafts waiting.");
    return;
  }

  console.log(`${drafts.length} draft(s) waiting:\n`);

  for (const file of drafts) {
    const raw = fs.readFileSync(path.join(DRAFT_DIR, file), "utf-8");
    const markers = (raw.match(/\[AUTHOR:/g) || []).length;
    const words = raw.split(/\s+/).length;
    const flag = markers > 0 ? `  ${markers} unresolved [AUTHOR:] marker(s)` : "  ready";

    console.log(`  ${file.replace(/\.md$/, "")}`);
    console.log(`    ~${words} words${flag}`);
  }

  console.log("\nPublish with: node scripts/publish.js <slug>");
}

function publish(slug) {
  const from = path.join(DRAFT_DIR, `${slug}.md`);
  const to = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(from)) {
    console.error(`No draft at ${from}`);
    process.exit(1);
  }

  if (fs.existsSync(to)) {
    console.error(`${to} already exists. Refusing to overwrite.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(from, "utf-8");

  // Unresolved markers mean the piece still has holes only the author can
  // fill. Publishing with them visible is worse than not publishing.
  const markers = (raw.match(/\[AUTHOR:[^\]]*\]/g) || []);
  if (markers.length > 0 && !process.argv.includes("--force")) {
    console.error(`${markers.length} unresolved marker(s) in this draft:\n`);
    markers.forEach((m) => console.error(`  ${m}`));
    console.error("\nFill these in, or re-run with --force to publish anyway.");
    process.exit(1);
  }

  // Verify the frontmatter is valid YAML before it goes live. If this throws,
  // the title almost certainly contains an unquoted colon.
  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    console.error("Frontmatter does not parse as YAML:");
    console.error(`  ${err.message}`);
    console.error("\nMost likely an unquoted colon in the title. Quote it:");
    console.error('  title: "Some Title: With a Colon"');
    process.exit(1);
  }

  if (!parsed.data.title) {
    console.error("Draft has no title in its frontmatter.");
    process.exit(1);
  }

  const updated = raw.replace(/^status:\s*draft\s*$/m, "status: published");

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.writeFileSync(to, updated);
  fs.unlinkSync(from);

  const total = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).length;

  console.log(`Published: ${parsed.data.title}`);
  console.log(`  ${from} -> ${to}`);
  console.log(`  ${total} posts total\n`);
  console.log("Now commit and push:");
  console.log(`  git add ${BLOG_DIR} ${DRAFT_DIR}`);
  console.log(`  git commit -m "Publish: ${parsed.data.title}"`);
  console.log("  git push");
}

const slug = process.argv[2];

if (!slug || slug.startsWith("--")) {
  showDrafts();
} else {
  publish(slug.replace(/\.md$/, ""));
}

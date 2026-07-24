// One-off migration: push every post into the backend Post collection.
//   blogs/*.md  -> status: published
//   drafts/*.md -> status: draft
// Idempotent: slugs that already exist are skipped (409).
// Usage:
//   BACKEND_URL=http://localhost:5099 ADMIN_KEY=<secret> node scripts/importDraftsToBackend.mjs
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SOURCES = [
  { dir: "blogs", status: "published" },
  { dir: "drafts", status: "draft" },
];
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5099";
const ADMIN_KEY = process.env.ADMIN_KEY;

if (!ADMIN_KEY) {
  console.error("Set ADMIN_KEY (must match the backend ADMIN_SECRET).");
  process.exit(1);
}

const files = SOURCES.flatMap(({ dir, status }) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => ({ dir, status, file: f }))
    : []
);

if (files.length === 0) {
  console.log("No posts to import.");
  process.exit(0);
}

let created = 0;
let skipped = 0;
let failed = 0;

for (const { dir, status, file } of files) {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  const { data, content } = matter(raw);

  const payload = {
    slug,
    title: data.title || slug.replaceAll("-", " "),
    description: data.description || "",
    content,
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    aiAssisted: data.aiAssisted !== false,
    // Prefer the file's own frontmatter status, else the directory default.
    status: data.status === "published" || data.status === "draft" ? data.status : status,
  };

  try {
    const res = await fetch(`${BACKEND_URL}/admin/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
      body: JSON.stringify(payload),
    });
    if (res.status === 201) {
      created++;
      console.log(`  created  ${slug}`);
    } else if (res.status === 409) {
      skipped++;
      console.log(`  exists   ${slug}`);
    } else {
      failed++;
      const t = await res.text();
      console.log(`  FAIL(${res.status}) ${slug} :: ${t.slice(0, 120)}`);
    }
  } catch (err) {
    failed++;
    console.log(`  ERROR    ${slug} :: ${err.message}`);
  }
}

console.log(`\nDone: ${created} created, ${skipped} already existed, ${failed} failed (of ${files.length}).`);
process.exit(failed ? 1 : 0);

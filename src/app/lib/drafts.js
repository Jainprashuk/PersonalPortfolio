// Server-only helpers for the development draft-review workflow.
// Everything here writes to disk, so callers MUST be dev-gated (see isDev()).
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { estimateReadTime } from "./blog";

export const DRAFT_DIR = path.join(process.cwd(), "drafts");
export const BLOG_DIR = path.join(process.cwd(), "blogs");

// Vercel's runtime filesystem is read-only and this UI writes to disk, so the
// whole admin surface only exists in local development.
export function isDev() {
  return process.env.NODE_ENV === "development";
}

const SLUG_RE = /^[a-z0-9-]+$/;

// Reject anything that isn't a bare slug — no separators, no traversal.
export function isValidSlug(slug) {
  return typeof slug === "string" && SLUG_RE.test(slug) && !slug.includes("..");
}

function authorMarkers(raw) {
  return raw.match(/\[AUTHOR:[^\]]*\]/g) || [];
}

// Metadata for one draft. Never throws on bad frontmatter — reports it instead.
export function readDraft(file) {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(DRAFT_DIR, file), "utf-8");

  let data = {};
  let content = raw;
  let parseError = null;
  try {
    const parsed = matter(raw);
    data = parsed.data;
    content = parsed.content;
  } catch (err) {
    parseError = err.message;
  }

  const markers = authorMarkers(raw);
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: data.title || slug.replaceAll("-", " "),
    date: data.date ? new Date(data.date).toISOString() : null,
    status: data.status || null,
    aiAssisted: data.aiAssisted ?? null,
    words,
    readTime: estimateReadTime(content),
    markers,
    markerCount: markers.length,
    parseError,
    content,
  };
}

export function listDrafts() {
  if (!fs.existsSync(DRAFT_DIR)) return [];
  return fs
    .readdirSync(DRAFT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readDraft(f))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

// Move drafts/<slug>.md -> blogs/<slug>.md, flipping status to published.
// Returns { ok, error, code, blockers, gitCommands }.
export function approveDraft(slug, { force = false } = {}) {
  if (!isValidSlug(slug)) return { ok: false, code: "bad_slug", error: "Invalid slug." };

  const from = path.join(DRAFT_DIR, `${slug}.md`);
  const to = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(from)) return { ok: false, code: "not_found", error: `No draft at drafts/${slug}.md` };
  if (fs.existsSync(to)) return { ok: false, code: "exists", error: `blogs/${slug}.md already exists; refusing to overwrite.` };

  const raw = fs.readFileSync(from, "utf-8");

  // Frontmatter must parse before we publish.
  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    return { ok: false, code: "parse_error", error: `Frontmatter does not parse as YAML: ${err.message}` };
  }
  if (!parsed.data.title) {
    return { ok: false, code: "no_title", error: "Draft has no title in its frontmatter." };
  }

  // Unresolved author markers block publishing unless explicitly overridden.
  const markers = authorMarkers(raw);
  if (markers.length > 0 && !force) {
    return { ok: false, code: "markers", error: `${markers.length} unresolved [AUTHOR:] marker(s).`, blockers: markers };
  }

  const updated = raw.replace(/^status:\s*draft\s*$/m, "status: published");

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.writeFileSync(to, updated);
  fs.unlinkSync(from);

  return {
    ok: true,
    slug,
    title: parsed.data.title,
    forced: markers.length > 0 && force,
    gitCommands: [
      `git add blogs/${slug}.md drafts/${slug}.md`,
      `git commit -m ${JSON.stringify(`Publish: ${parsed.data.title}`)}`,
      "git push",
    ],
  };
}

export function deleteDraft(slug) {
  if (!isValidSlug(slug)) return { ok: false, code: "bad_slug", error: "Invalid slug." };
  const from = path.join(DRAFT_DIR, `${slug}.md`);
  if (!fs.existsSync(from)) return { ok: false, code: "not_found", error: `No draft at drafts/${slug}.md` };
  fs.unlinkSync(from);
  return { ok: true, slug, gitCommands: [`git add drafts/${slug}.md`, `git commit -m ${JSON.stringify(`Delete draft: ${slug}`)}`, "git push"] };
}

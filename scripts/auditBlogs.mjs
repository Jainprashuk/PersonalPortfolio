// One-off analysis for the blog audit (Phase 3). Read-only: prints data only.
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = "blogs";

const STOP = new Set(
  ("a an and the of for to in on with vs versus your you i we how why when what " +
    "guide building build using use practical real world advanced modern beyond " +
    "mastering scalable strategies patterns into from is are that this it its " +
    "into apps app application applications dev developer developers into into " +
    "not as at be or by")
    .split(/\s+/)
);

// domain synonyms collapsed to a canonical token so near-duplicate topics group
const CANON = {
  rerenders: "rerender", rerender: "rerender", "re-renders": "rerender",
  memoization: "memo", memo: "memo", usememo: "memo", usecallback: "memo",
  nextjs: "nextjs", "next.js": "nextjs",
  treeshaking: "bundle", "tree-shaking": "bundle", bundle: "bundle",
  codesplitting: "bundle", "code-splitting": "bundle", splitting: "bundle",
  tbt: "bundle", size: "bundle",
  tailwind: "tailwind", cva: "tailwind",
  compound: "compound", components: "component", component: "component",
  server: "rsc", rsc: "rsc",
  "core-web-vitals": "cwv", lcp: "cwv", cls: "cwv", inp: "cwv", vitals: "cwv",
  hydration: "cwv",
  "design-system": "designsystem", "design-systems": "designsystem", system: "designsystem",
  "app-router": "approuter", router: "approuter",
  architecture: "arch", architecting: "arch", "feature-based": "arch",
  "folder-structures": "arch", monorepos: "arch", monorepo: "arch",
  typesafe: "types", typescript: "types",
};

function tokens(title) {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => CANON[t] || t)
      .filter((t) => !STOP.has(t) && t.length > 2)
  );
}

function jaccard(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length;
  const uni = new Set([...a, ...b]).size;
  return uni === 0 ? 0 : inter / uni;
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
const posts = files.map((f) => {
  const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
  const { content, data } = matter(raw);
  const slug = f.replace(/\.md$/, "");
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const codeBlocks = (content.match(/```/g) || []).length / 2;
  const authorMarkers = (raw.match(/\[AUTHOR:[^\]]*\]/g) || []).length;
  // fabricated first-person anecdotes the old prompt asked for
  const fabPhrases = [
    /in one of my projects/i,
    /i ran into this (issue|problem) when/i,
    /what worked for me was/i,
    /on (my|a) (recent|previous) (team|project)/i,
    /at my (company|job|previous)/i,
    /we reduced .* by \d/i,
    /in my experience (building|working)/i,
    /a project i (built|worked)/i,
  ];
  const fabHits = fabPhrases.reduce(
    (n, re) => n + (content.match(new RegExp(re, "gi"))?.length || 0),
    0
  );
  // invented precise performance numbers (e.g. "by 40%", "300ms", "2.3s")
  const numberClaims = (
    content.match(/\bby \d{1,3}%|\b\d{2,4}\s?ms\b|\b\d(\.\d+)?\s?s(econds)?\b\s?(faster|improvement|reduction)?/gi) || []
  ).length;
  const authorityTitle = /senior (engineer|developer)'?s? (guide|approach)/i.test(
    data.title || slug
  );
  return {
    slug,
    title: data.title || slug,
    date: data.date || null,
    words,
    codeBlocks,
    authorMarkers,
    fabHits,
    numberClaims,
    authorityTitle,
    tok: tokens(data.title || slug),
  };
});

// build similarity groups (union-find over pairs >= 0.35)
const parent = posts.map((_, i) => i);
const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
const union = (a, b) => { parent[find(a)] = find(b); };
const THRESH = 0.35;
const pairs = [];
for (let i = 0; i < posts.length; i++) {
  for (let j = i + 1; j < posts.length; j++) {
    const s = jaccard(posts[i].tok, posts[j].tok);
    if (s >= THRESH) {
      pairs.push([i, j, s.toFixed(2)]);
      union(i, j);
    }
  }
}
const groups = {};
posts.forEach((p, i) => {
  const r = find(i);
  (groups[r] ||= []).push(i);
});

console.log("### GROUPS (size > 1) ###");
Object.values(groups)
  .filter((g) => g.length > 1)
  .sort((a, b) => b.length - a.length)
  .forEach((g, gi) => {
    console.log(`\n-- group ${gi + 1} (${g.length}) --`);
    g.map((i) => posts[i])
      .sort((a, b) => b.words - a.words)
      .forEach((p) => {
        console.log(
          `  ${p.words}w code:${p.codeBlocks} fab:${p.fabHits} num:${p.numberClaims} auth:${p.authorityTitle ? 1 : 0} mk:${p.authorMarkers} | ${p.slug}`
        );
      });
  });

console.log("\n### SINGLETONS ###");
Object.values(groups)
  .filter((g) => g.length === 1)
  .map((g) => posts[g[0]])
  .sort((a, b) => a.words - b.words)
  .forEach((p) => {
    console.log(
      `  ${p.words}w code:${p.codeBlocks} fab:${p.fabHits} num:${p.numberClaims} auth:${p.authorityTitle ? 1 : 0} mk:${p.authorMarkers} | ${p.slug}`
    );
  });

console.log("\n### FLAGS ###");
console.log("authority-claim titles:");
posts.filter((p) => p.authorityTitle).forEach((p) => console.log("  " + p.slug));
console.log("fabricated first-person hits (top):");
posts.filter((p) => p.fabHits > 0).sort((a, b) => b.fabHits - a.fabHits)
  .forEach((p) => console.log(`  ${p.fabHits}x ${p.slug}`));
console.log("thin (<500w, no code):");
posts.filter((p) => p.words < 500 && p.codeBlocks === 0)
  .forEach((p) => console.log(`  ${p.words}w ${p.slug}`));
console.log(`\nTOTAL: ${posts.length}`);

// Generates blog-audit.md from an explicit verdict map, asserting all 91 covered.
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = "blogs";

// slug -> { cluster, reason }  (everything not listed as KEEP is DELETE)
const KEEP = {
  "advanced-tailwind-css-building-a-scalable-design-system-with-cva-and-tailwind-merge":
    ["Tailwind design system", "Strongest of 10 near-dupes: real CVA + tailwind-merge + `cn` helper code, named APIs."],
  "mastering-compound-components-building-flexible-and-reusable-ui-systems-in-react":
    ["Compound components", "Strongest of 7 near-dupes: fullest compound-component example with context wiring."],
  "advanced-image-optimization-strategies-for-improving-lcp-in-nextjs-applications":
    ["Core Web Vitals / LCP", "Best LCP post: concrete `next/image` `priority`/`sizes`/AVIF code, no invented metrics in title."],
  "solving-cumulative-layout-shift-cls-best-practices-for-responsive-images-in-tailwind-css":
    ["Core Web Vitals / CLS", "Distinct CLS sub-topic with concrete responsive-image guidance."],
  "automating-frontend-performance-budgets-integrating-lighthouse-ci-into-your-pull-request-workflow":
    ["Perf tooling", "Distinct, concrete: Lighthouse CI wired into PR workflow. No invented numbers."],
  "frontend-resilience-implementing-robust-error-boundaries-and-skeleton-patterns-for-better-ux":
    ["Resilience / loading UX", "Covers error boundaries + skeletons; broader than the pure skeleton post."],
  "effective-data-prefetching-strategies-in-nextjs-for-instant-page-transitions":
    ["Prefetching", "Best of 3 prefetch posts; concrete Next.js prefetch strategies."],
  "beyond-memoization-5-architectural-patterns-to-eliminate-unnecessary-rerenders-in-large-react-apps":
    ["Re-renders / memoization", "Strongest of 5+ re-render posts: most concrete patterns, 2 code blocks."],
  "practical-treeshaking-how-to-audit-and-eliminate-thirdparty-bloat-from-react-production-bundles":
    ["Bundle size / tree-shaking", "Best of the large bundle/code-split cluster: actionable audit workflow, no invented numbers."],
  "scalable-react-architecture-implementing-a-featurebased-folder-structure-for-large-teams":
    ["App architecture", "Strongest of 6 architecture posts: concrete feature-folder tree + `index.ts` public API, most code."],
  "architecting-nextjs-14-apps-when-to-use-server-components-vs-client-components":
    ["React Server Components", "Best of 6 RSC posts: practical server-vs-client decision framework."],
  "architecting-typesafe-component-interfaces-advanced-typescript-patterns-for-senior-react-developers":
    ["TypeScript patterns", "Concrete advanced TS component-typing patterns; audience label, not a self-authority claim."],
  "building-highperformance-forms-in-react-controlled-vs-uncontrolled-strategies-for-large-datasets":
    ["Forms", "Stronger of 2 form posts: controlled-vs-uncontrolled with a large-dataset angle."],
  "building-accessible-and-highperformance-data-tables-with-react-virtualization":
    ["Virtualization / tables", "Stronger of 2 virtualization posts: adds accessibility + concrete table virtualization."],
  "scaling-state-management-when-to-move-from-context-api-to-atomic-state-or-signals":
    ["State management", "Distinct topic: Context vs atomic state vs signals; concrete decision guidance."],
  "advanced-tanstack-query-handling-complex-cache-invalidation-and-optimistic-ui-updates":
    ["Data fetching (TanStack Query)", "Distinct topic with specific TanStack Query cache-invalidation APIs."],
  "refactoring-for-performance-how-to-safely-decouple-complex-ui-logic-into-testable-custom-hooks":
    ["Custom hooks / refactoring", "Distinct angle: extracting UI logic into testable custom hooks."],
  "microfrontends-with-nextjs-solving-crossapplication-state-and-style-isolation":
    ["Micro-frontends", "Distinct advanced topic; longest post with concrete state/style-isolation discussion."],
  "handling-authentication-in-mern-apps-using-jwt":
    ["Auth / MERN", "Distinct practical topic: JWT auth in MERN. Concrete."],
  "component-composition-vs-configuration-solving-the-megaprops-antipattern-in-large-react-apps":
    ["Composition", "Distinct concept (mega-props anti-pattern); concrete though shorter."],
  "react-singletons-arent-as-evil-as-you-think":
    ["Opinion (technical)", "Clean, distinct opinion+technical piece; no fabricated anecdotes."],
  "common-mistakes-i-made-while-learning-react-and-how-i-fixed-them":
    ["Authentic junior post", "On-brand for ~1yr experience; honest learning framing, minimal fabrication, no false authority."],
};

// Explicit reasons for the notable standalone deletes (fabrication / authority / off-topic / filler).
const DELETE_REASON = {
  "universal-vaccine-against-respiratory-infections-and-allergens":
    "OFF-TOPIC: vaccinology essay, unrelated to a frontend portfolio.",
  "thinking-fast-slow-and-artificial-how-ai-is-reshaping-human-reasoning":
    "FABRICATION + persona conflict: invented projects ('MERN dashboard', 'real-time task manager') and claims 'final year CS student' (contradicts your ~1yr professional experience).",
  "why-are-we-still-doing-gpu-work-in-javascript-live-webgpu-benchmark-demo":
    "FALSE AUTHORITY + fake artifact: 'As a senior engineer...' and a 'Live Benchmark & Demo' that does not exist.",
  "the-real-skill-in-programming-is-debugging-everything-else-is-copypaste":
    "GENERIC FILLER: no specific technical content; healthcare/finance/aerospace padding.",
  "the-old-seniority-definition-is-collapsing":
    "OFF-BRAND career opinion; not frontend, generic.",
  "tech-employment-now-significantly-worse-than-the-2008-or-2020-recessions":
    "OFF-TOPIC macro-economics opinion.",
  "the-agent-buddy-system-when-prompt-engineering-isnt-enough":
    "OFF-BRAND AI-agents opinion piece.",
  "when-ai-writes-the-code-who-takes-responsibility":
    "OFF-BRAND AI opinion essay.",
  "in-the-ai-era-code-is-cheap-reputation-isnt":
    "OFF-BRAND AI opinion essay.",
  "when-projects-fail-why-companies-should-treat-open-source-as-infrastructure":
    "OFF-TOPIC open-source/business opinion.",
  "how-i-built-a-scalable-react-app-with-tailwind-and-redux":
    "FABRICATION-BUILT: entire post is a fabricated 'how I built X' project narrative (4 invented-anecdote hits).",
  "optimizing-react-performance-in-realworld-apps":
    "FABRICATION-HEAVY (4 hits) and redundant with the kept re-render post.",
  "building-typesafe-custom-hooks-a-senior-engineers-guide-to-frontend-logic-reusability":
    "FALSE AUTHORITY: 'A Senior Engineer's Guide' — authority you do not have at ~1yr experience.",
  "pragmatic-memoization-a-senior-engineers-guide-on-when-to-actually-use-usememo-and-usecallback":
    "FALSE AUTHORITY: 'A Senior Engineer's Guide' + redundant with kept re-render post.",
  "cutting-your-bundle-size-by-40-advanced-code-splitting-and-tree-shaking-strategies":
    "INVENTED BENCHMARK in title ('by 40%') + redundant with kept tree-shaking post.",
};

const CLUSTER_OF_DELETE = {
  // Tailwind design system dupes
  "scaling-tailwind-css-architecting-a-maintainable-design-system-for-enterprise-applications": "Tailwind design system",
  "scaling-tailwind-css-building-a-consistent-design-system-for-enterprise-applications": "Tailwind design system",
  "scaling-tailwind-css-architecting-a-maintainable-design-system-for-enterprise-monorepos": "Tailwind design system",
  "scaling-tailwind-css-architecting-a-maintainable-design-system-in-large-monorepos": "Tailwind design system",
  "scaling-tailwind-css-architecting-a-maintainable-design-system-in-largescale-react-monorepos": "Tailwind design system",
  "scaling-tailwind-css-building-a-typesafe-design-system-with-cva-and-tailwind-merge": "Tailwind design system",
  "building-a-robust-design-system-with-tailwind-css-and-headless-ui": "Tailwind design system",
  "building-a-highly-extensible-design-system-with-tailwind-css-and-cva": "Tailwind design system",
  "beyond-the-basics-leveraging-tailwind-css-config-for-a-truly-scalable-design-system": "Tailwind design system",
  "design-systems-with-tailwind-css-strategies-for-themeable-and-maintainable-component-libraries": "Tailwind design system",
  "zerobundlesize-ui-logic-leveraging-modern-css-and-tailwind-for-highperformance-interactions": "Tailwind design system",
  // Compound components dupes
  "compound-components-and-inversion-of-control-building-flexible-lowmaintenance-ui-kits": "Compound components",
  "beyond-the-basics-implementing-compound-components-for-highly-reusable-ui-libraries": "Compound components",
  "mastering-compound-components-building-flexible-and-reusable-ui-kits-in-react": "Compound components",
  "the-compound-component-pattern-building-highly-reusable-and-flexible-ui-components-in-react": "Compound components",
  "the-architecture-of-headless-ui-building-highly-reusable-components-with-react-aria": "Compound components",
  "building-reusable-ui-components-with-react-and-tailwind": "Compound components",
  // CWV dupes
  "optimizing-core-web-vitals-a-deep-dive-into-nextjs-app-router-performance": "Core Web Vitals",
  "finetuning-core-web-vitals-advanced-strategies-for-optimizing-lcp-and-cls-in-nextjs": "Core Web Vitals",
  "optimizing-core-web-vitals-in-2024-a-deep-dive-into-lcp-and-cls-in-nextjs-app-router": "Core Web Vitals",
  "optimizing-core-web-vitals-a-deep-dive-into-lcp-and-cls-improvements-in-nextjs": "Core Web Vitals",
  "optimizing-core-web-vitals-a-deep-dive-into-nextjs-image-and-font-optimization-strategies": "Core Web Vitals",
  "optimizing-hydration-preventing-content-mismatch-and-improving-first-input-delay": "Core Web Vitals",
  "optimizing-interaction-to-next-paint-inp-practical-strategies-for-react-18-applications": "Core Web Vitals",
  "optimizing-the-critical-rendering-path-preloading-prefetching-and-priority-hints-in-modern-react": "Core Web Vitals",
  "implementing-efficient-skeletal-loading-states-in-nextjs-app-router": "Resilience / loading UX",
  "beyond-lighthouse-implementing-realuser-monitoring-rum-to-track-actual-frontend-performance": "Perf tooling",
  "predictive-preloading-boosting-perceived-performance-in-nextjs-with-intentbased-prefetching": "Prefetching",
  "implementing-optimistic-ui-and-prefetching-strategies-for-instant-page-transitions": "Prefetching",
  // Re-render / memo dupes
  "eliminating-unnecessary-rerenders-advanced-memoization-patterns-in-react-18": "Re-renders / memoization",
  "optimizing-react-performance-eliminating-unnecessary-rerenders-with-composition-patterns": "Re-renders / memoization",
  "beyond-usememo-a-practical-guide-to-identifying-and-fixing-redundant-rerenders-in-react": "Re-renders / memoization",
  "the-cost-of-rerenders-using-the-react-profiler-to-fix-performance-bottlenecks-in-complex-forms": "Re-renders / memoization",
  // Bundle / tree-shaking / code-split dupes
  "the-art-of-treeshaking-practical-techniques-for-auditing-and-reducing-bundle-size-in-react-applications": "Bundle size / tree-shaking",
  "reducing-total-blocking-time-tbt-strategies-for-granular-code-splitting-in-large-nextjs-projects": "Bundle size / tree-shaking",
  "treeshaking-and-code-splitting-strategies-for-reducing-react-bundle-size-in-enterprise-apps": "Bundle size / tree-shaking",
  "microoptimizing-react-bundles-codesplitting-strategies-that-actually-reduce-tbt-total-blocking-time": "Bundle size / tree-shaking",
  "modern-code-splitting-strategies-for-reducing-initial-bundle-size-in-complex-nextjs-apps": "Bundle size / tree-shaking",
  "mastering-code-splitting-in-react-strategic-dynamic-imports-for-reducing-total-blocking-time": "Bundle size / tree-shaking",
  "radical-bundle-size-reduction-identifying-and-eliminating-treeshaking-bottlenecks-in-react-apps": "Bundle size / tree-shaking",
  "the-three-pillars-of-javascript-bloat": "Bundle size / tree-shaking",
  // Architecture dupes
  "architecting-scalable-nextjs-apps-transitioning-from-layered-folders-to-featurebased-modules": "App architecture",
  "architecting-scalable-react-apps-folder-structures-and-patterns-for-largescale-monorepos": "App architecture",
  "architecting-scalable-nextjs-apps-mastering-the-app-router-and-shared-layouts": "App architecture",
  "the-clean-code-guide-for-react-structuring-largescale-frontend-projects-for-maintainability": "App architecture",
  "the-clean-code-frontend-applying-solid-principles-to-react-component-architecture": "App architecture",
  // RSC dupes
  "mastering-react-server-components-architecture-patterns-for-highperformance-apps": "React Server Components",
  "optimizing-react-server-components-best-practices-for-data-fetching-and-hydration-performance": "React Server Components",
  "react-server-components-vs-clientside-fetching-a-performance-comparison-for-dataheavy-uis": "React Server Components",
  "mastering-react-server-components-a-guide-to-reducing-clientside-bundle-size-in-nextjs": "React Server Components",
  "the-react-server-components-mental-model-decoupling-data-fetching-from-client-logic": "React Server Components",
  // TypeScript dupes
  "typesafe-frontend-architecture-leveraging-typescript-and-tailwind-for-bulletproof-ui-development": "TypeScript patterns",
  // Forms dupes
  "building-highperformance-forms-balancing-clientside-validation-and-render-efficiency": "Forms",
  // Virtualization dupes
  "virtualization-vs-pagination-solving-rendering-bottlenecks-in-dataheavy-react-dashboards": "Virtualization / tables",
};

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
const rows = files.map((f) => {
  const slug = f.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
  const { content, data } = matter(raw);
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const keep = KEEP[slug];
  let verdict, cluster, reason;
  if (keep) {
    verdict = "KEEP";
    [cluster, reason] = keep;
  } else {
    verdict = "DELETE";
    cluster = CLUSTER_OF_DELETE[slug] || "Standalone";
    const clusterCoveredBy = {
      "Core Web Vitals": 'redundant with the kept LCP + CLS posts; a generic "deep dive" often padded with invented metrics',
    };
    reason =
      DELETE_REASON[slug] ||
      (cluster === "Standalone"
        ? "Standalone — see notes."
        : clusterCoveredBy[cluster]
        ? `Duplicate — ${clusterCoveredBy[cluster]}.`
        : `Duplicate of the kept "${cluster}" post; weaker on concrete detail.`);
  }
  return { slug, title: data.title, words, verdict, cluster, reason };
});

const keeps = rows.filter((r) => r.verdict === "KEEP");
const dels = rows.filter((r) => r.verdict === "DELETE");

// Coverage assertion
if (rows.length !== 91) console.error(`WARN: expected 91, got ${rows.length}`);
const keepMisses = Object.keys(KEEP).filter((s) => !files.includes(s + ".md"));
if (keepMisses.length) {
  console.error("KEEP slugs not found on disk:", keepMisses);
  process.exit(1);
}

const clusters = [...new Set(rows.map((r) => r.cluster))].filter((c) => c !== "Standalone");
const esc = (s) => (s || "").replace(/\|/g, "\\|");

let md = `# Blog audit — ${rows.length} posts\n\n`;
md += `**Proposal: keep ${keeps.length}, delete ${dels.length}.** Nothing is deleted until you confirm.\n\n`;
md += `Method: title tokens (stopwords + domain synonyms collapsed), pairwise Jaccard, grouped at ≥ 0.35, ` +
  `then within each topical cluster keep the single strongest post (most concrete code / named APIs; penalise ` +
  `invented numbers, fabricated anecdotes, and false-authority framing). "KEEP" means keep as a **draft to review** ` +
  `(Phase 4), not publish as-is — the surviving posts still carry throwaway fabricated lines that draft review + ` +
  `\`[AUTHOR:]\` cleanup will strip.\n\n`;

md += `## Standalone deletions (independent of duplication)\n\n`;
md += `These are deleted on their own merits — fabrication, false authority, off-topic, or filler:\n\n`;
md += `| Post | Reason |\n|---|---|\n`;
for (const slug of Object.keys(DELETE_REASON)) {
  const r = rows.find((x) => x.slug === slug);
  md += `| \`${slug}\` | ${esc(r.reason)} |\n`;
}

md += `\n## Duplicate clusters\n\n`;
for (const c of clusters) {
  const inC = rows.filter((r) => r.cluster === c).sort((a, b) => b.words - a.words);
  if (inC.length < 2 && !inC.some((r) => r.verdict === "KEEP")) continue;
  const kept = inC.find((r) => r.verdict === "KEEP");
  md += `### ${c}  — keep 1 / ${inC.length}\n\n`;
  md += kept ? `**KEEP:** \`${kept.slug}\` — ${esc(kept.reason)}\n\n` : `_(no single winner)_\n\n`;
  const others = inC.filter((r) => r.verdict === "DELETE");
  if (others.length) {
    md += `DELETE (${others.length}):\n`;
    for (const r of others) md += `- \`${r.slug}\` (${r.words}w)${DELETE_REASON[r.slug] ? " — " + esc(DELETE_REASON[r.slug]) : ""}\n`;
    md += `\n`;
  }
}

md += `## Full verdict table (all ${rows.length})\n\n`;
md += `| Verdict | Post | Words | Cluster | Reason |\n|---|---|---|---|---|\n`;
for (const r of rows.sort((a, b) => (a.verdict === b.verdict ? a.cluster.localeCompare(b.cluster) : a.verdict === "KEEP" ? -1 : 1))) {
  md += `| ${r.verdict} | \`${r.slug}\` | ${r.words} | ${esc(r.cluster)} | ${esc(r.reason)} |\n`;
}

md += `\n---\n\n**Next step:** reply to confirm (or edit the KEEP/DELETE set). On approval I run Phase 4: ` +
  `\`git mv\` the ${keeps.length} survivors into \`drafts/\`, add \`status: draft\` + \`aiAssisted: true\`, ` +
  `and \`git rm\` the ${dels.length} deletions.\n`;

fs.writeFileSync("blog-audit.md", md);
console.log(`Wrote blog-audit.md: ${keeps.length} KEEP, ${dels.length} DELETE, ${rows.length} total.`);

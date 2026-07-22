# Blog audit — 91 posts

**Proposal: keep 22, delete 69.** Nothing is deleted until you confirm.

Method: title tokens (stopwords + domain synonyms collapsed), pairwise Jaccard, grouped at ≥ 0.35, then within each topical cluster keep the single strongest post (most concrete code / named APIs; penalise invented numbers, fabricated anecdotes, and false-authority framing). "KEEP" means keep as a **draft to review** (Phase 4), not publish as-is — the surviving posts still carry throwaway fabricated lines that draft review + `[AUTHOR:]` cleanup will strip.

## Standalone deletions (independent of duplication)

These are deleted on their own merits — fabrication, false authority, off-topic, or filler:

| Post | Reason |
|---|---|
| `universal-vaccine-against-respiratory-infections-and-allergens` | OFF-TOPIC: vaccinology essay, unrelated to a frontend portfolio. |
| `thinking-fast-slow-and-artificial-how-ai-is-reshaping-human-reasoning` | FABRICATION + persona conflict: invented projects ('MERN dashboard', 'real-time task manager') and claims 'final year CS student' (contradicts your ~1yr professional experience). |
| `why-are-we-still-doing-gpu-work-in-javascript-live-webgpu-benchmark-demo` | FALSE AUTHORITY + fake artifact: 'As a senior engineer...' and a 'Live Benchmark & Demo' that does not exist. |
| `the-real-skill-in-programming-is-debugging-everything-else-is-copypaste` | GENERIC FILLER: no specific technical content; healthcare/finance/aerospace padding. |
| `the-old-seniority-definition-is-collapsing` | OFF-BRAND career opinion; not frontend, generic. |
| `tech-employment-now-significantly-worse-than-the-2008-or-2020-recessions` | OFF-TOPIC macro-economics opinion. |
| `the-agent-buddy-system-when-prompt-engineering-isnt-enough` | OFF-BRAND AI-agents opinion piece. |
| `when-ai-writes-the-code-who-takes-responsibility` | OFF-BRAND AI opinion essay. |
| `in-the-ai-era-code-is-cheap-reputation-isnt` | OFF-BRAND AI opinion essay. |
| `when-projects-fail-why-companies-should-treat-open-source-as-infrastructure` | OFF-TOPIC open-source/business opinion. |
| `how-i-built-a-scalable-react-app-with-tailwind-and-redux` | FABRICATION-BUILT: entire post is a fabricated 'how I built X' project narrative (4 invented-anecdote hits). |
| `optimizing-react-performance-in-realworld-apps` | FABRICATION-HEAVY (4 hits) and redundant with the kept re-render post. |
| `building-typesafe-custom-hooks-a-senior-engineers-guide-to-frontend-logic-reusability` | FALSE AUTHORITY: 'A Senior Engineer's Guide' — authority you do not have at ~1yr experience. |
| `pragmatic-memoization-a-senior-engineers-guide-on-when-to-actually-use-usememo-and-usecallback` | FALSE AUTHORITY: 'A Senior Engineer's Guide' + redundant with kept re-render post. |
| `cutting-your-bundle-size-by-40-advanced-code-splitting-and-tree-shaking-strategies` | INVENTED BENCHMARK in title ('by 40%') + redundant with kept tree-shaking post. |

## Duplicate clusters

### Core Web Vitals / LCP  — keep 1 / 1

**KEEP:** `advanced-image-optimization-strategies-for-improving-lcp-in-nextjs-applications` — Best LCP post: concrete `next/image` `priority`/`sizes`/AVIF code, no invented metrics in title.

### Tailwind design system  — keep 1 / 12

**KEEP:** `advanced-tailwind-css-building-a-scalable-design-system-with-cva-and-tailwind-merge` — Strongest of 10 near-dupes: real CVA + tailwind-merge + `cn` helper code, named APIs.

DELETE (11):
- `scaling-tailwind-css-architecting-a-maintainable-design-system-for-enterprise-applications` (850w)
- `scaling-tailwind-css-building-a-consistent-design-system-for-enterprise-applications` (849w)
- `scaling-tailwind-css-architecting-a-maintainable-design-system-for-enterprise-monorepos` (803w)
- `scaling-tailwind-css-architecting-a-maintainable-design-system-in-large-monorepos` (803w)
- `building-a-robust-design-system-with-tailwind-css-and-headless-ui` (799w)
- `design-systems-with-tailwind-css-strategies-for-themeable-and-maintainable-component-libraries` (788w)
- `building-a-highly-extensible-design-system-with-tailwind-css-and-cva` (776w)
- `zerobundlesize-ui-logic-leveraging-modern-css-and-tailwind-for-highperformance-interactions` (766w)
- `scaling-tailwind-css-architecting-a-maintainable-design-system-in-largescale-react-monorepos` (754w)
- `scaling-tailwind-css-building-a-typesafe-design-system-with-cva-and-tailwind-merge` (746w)
- `beyond-the-basics-leveraging-tailwind-css-config-for-a-truly-scalable-design-system` (686w)

### Data fetching (TanStack Query)  — keep 1 / 1

**KEEP:** `advanced-tanstack-query-handling-complex-cache-invalidation-and-optimistic-ui-updates` — Distinct topic with specific TanStack Query cache-invalidation APIs.

### React Server Components  — keep 1 / 6

**KEEP:** `architecting-nextjs-14-apps-when-to-use-server-components-vs-client-components` — Best of 6 RSC posts: practical server-vs-client decision framework.

DELETE (5):
- `the-react-server-components-mental-model-decoupling-data-fetching-from-client-logic` (799w)
- `optimizing-react-server-components-best-practices-for-data-fetching-and-hydration-performance` (797w)
- `mastering-react-server-components-architecture-patterns-for-highperformance-apps` (793w)
- `mastering-react-server-components-a-guide-to-reducing-clientside-bundle-size-in-nextjs` (790w)
- `react-server-components-vs-clientside-fetching-a-performance-comparison-for-dataheavy-uis` (620w)

### App architecture  — keep 1 / 6

**KEEP:** `scalable-react-architecture-implementing-a-featurebased-folder-structure-for-large-teams` — Strongest of 6 architecture posts: concrete feature-folder tree + `index.ts` public API, most code.

DELETE (5):
- `the-clean-code-guide-for-react-structuring-largescale-frontend-projects-for-maintainability` (780w)
- `architecting-scalable-nextjs-apps-mastering-the-app-router-and-shared-layouts` (757w)
- `architecting-scalable-nextjs-apps-transitioning-from-layered-folders-to-featurebased-modules` (746w)
- `architecting-scalable-react-apps-folder-structures-and-patterns-for-largescale-monorepos` (746w)
- `the-clean-code-frontend-applying-solid-principles-to-react-component-architecture` (732w)

### TypeScript patterns  — keep 1 / 2

**KEEP:** `architecting-typesafe-component-interfaces-advanced-typescript-patterns-for-senior-react-developers` — Concrete advanced TS component-typing patterns; audience label, not a self-authority claim.

DELETE (1):
- `typesafe-frontend-architecture-leveraging-typescript-and-tailwind-for-bulletproof-ui-development` (736w)

### Perf tooling  — keep 1 / 2

**KEEP:** `automating-frontend-performance-budgets-integrating-lighthouse-ci-into-your-pull-request-workflow` — Distinct, concrete: Lighthouse CI wired into PR workflow. No invented numbers.

DELETE (1):
- `beyond-lighthouse-implementing-realuser-monitoring-rum-to-track-actual-frontend-performance` (811w)

### Re-renders / memoization  — keep 1 / 5

**KEEP:** `beyond-memoization-5-architectural-patterns-to-eliminate-unnecessary-rerenders-in-large-react-apps` — Strongest of 5+ re-render posts: most concrete patterns, 2 code blocks.

DELETE (4):
- `the-cost-of-rerenders-using-the-react-profiler-to-fix-performance-bottlenecks-in-complex-forms` (825w)
- `eliminating-unnecessary-rerenders-advanced-memoization-patterns-in-react-18` (799w)
- `optimizing-react-performance-eliminating-unnecessary-rerenders-with-composition-patterns` (769w)
- `beyond-usememo-a-practical-guide-to-identifying-and-fixing-redundant-rerenders-in-react` (542w)

### Compound components  — keep 1 / 7

**KEEP:** `mastering-compound-components-building-flexible-and-reusable-ui-systems-in-react` — Strongest of 7 near-dupes: fullest compound-component example with context wiring.

DELETE (6):
- `compound-components-and-inversion-of-control-building-flexible-lowmaintenance-ui-kits` (791w)
- `beyond-the-basics-implementing-compound-components-for-highly-reusable-ui-libraries` (767w)
- `mastering-compound-components-building-flexible-and-reusable-ui-kits-in-react` (751w)
- `the-compound-component-pattern-building-highly-reusable-and-flexible-ui-components-in-react` (683w)
- `the-architecture-of-headless-ui-building-highly-reusable-components-with-react-aria` (536w)
- `building-reusable-ui-components-with-react-and-tailwind` (453w)

### Virtualization / tables  — keep 1 / 2

**KEEP:** `building-accessible-and-highperformance-data-tables-with-react-virtualization` — Stronger of 2 virtualization posts: adds accessibility + concrete table virtualization.

DELETE (1):
- `virtualization-vs-pagination-solving-rendering-bottlenecks-in-dataheavy-react-dashboards` (716w)

### Forms  — keep 1 / 2

**KEEP:** `building-highperformance-forms-in-react-controlled-vs-uncontrolled-strategies-for-large-datasets` — Stronger of 2 form posts: controlled-vs-uncontrolled with a large-dataset angle.

DELETE (1):
- `building-highperformance-forms-balancing-clientside-validation-and-render-efficiency` (797w)

### Authentic junior post  — keep 1 / 1

**KEEP:** `common-mistakes-i-made-while-learning-react-and-how-i-fixed-them` — On-brand for ~1yr experience; honest learning framing, minimal fabrication, no false authority.

### Composition  — keep 1 / 1

**KEEP:** `component-composition-vs-configuration-solving-the-megaprops-antipattern-in-large-react-apps` — Distinct concept (mega-props anti-pattern); concrete though shorter.

### Prefetching  — keep 1 / 3

**KEEP:** `effective-data-prefetching-strategies-in-nextjs-for-instant-page-transitions` — Best of 3 prefetch posts; concrete Next.js prefetch strategies.

DELETE (2):
- `implementing-optimistic-ui-and-prefetching-strategies-for-instant-page-transitions` (733w)
- `predictive-preloading-boosting-perceived-performance-in-nextjs-with-intentbased-prefetching` (726w)

### Core Web Vitals  — keep 1 / 8

_(no single winner)_

DELETE (8):
- `optimizing-core-web-vitals-a-deep-dive-into-nextjs-app-router-performance` (945w)
- `finetuning-core-web-vitals-advanced-strategies-for-optimizing-lcp-and-cls-in-nextjs` (815w)
- `optimizing-core-web-vitals-in-2024-a-deep-dive-into-lcp-and-cls-in-nextjs-app-router` (786w)
- `optimizing-core-web-vitals-a-deep-dive-into-lcp-and-cls-improvements-in-nextjs` (785w)
- `optimizing-the-critical-rendering-path-preloading-prefetching-and-priority-hints-in-modern-react` (780w)
- `optimizing-hydration-preventing-content-mismatch-and-improving-first-input-delay` (777w)
- `optimizing-interaction-to-next-paint-inp-practical-strategies-for-react-18-applications` (773w)
- `optimizing-core-web-vitals-a-deep-dive-into-nextjs-image-and-font-optimization-strategies` (762w)

### Resilience / loading UX  — keep 1 / 2

**KEEP:** `frontend-resilience-implementing-robust-error-boundaries-and-skeleton-patterns-for-better-ux` — Covers error boundaries + skeletons; broader than the pure skeleton post.

DELETE (1):
- `implementing-efficient-skeletal-loading-states-in-nextjs-app-router` (658w)

### Auth / MERN  — keep 1 / 1

**KEEP:** `handling-authentication-in-mern-apps-using-jwt` — Distinct practical topic: JWT auth in MERN. Concrete.

### Bundle size / tree-shaking  — keep 1 / 9

**KEEP:** `practical-treeshaking-how-to-audit-and-eliminate-thirdparty-bloat-from-react-production-bundles` — Best of the large bundle/code-split cluster: actionable audit workflow, no invented numbers.

DELETE (8):
- `the-art-of-treeshaking-practical-techniques-for-auditing-and-reducing-bundle-size-in-react-applications` (854w)
- `reducing-total-blocking-time-tbt-strategies-for-granular-code-splitting-in-large-nextjs-projects` (806w)
- `radical-bundle-size-reduction-identifying-and-eliminating-treeshaking-bottlenecks-in-react-apps` (803w)
- `treeshaking-and-code-splitting-strategies-for-reducing-react-bundle-size-in-enterprise-apps` (788w)
- `microoptimizing-react-bundles-codesplitting-strategies-that-actually-reduce-tbt-total-blocking-time` (736w)
- `modern-code-splitting-strategies-for-reducing-initial-bundle-size-in-complex-nextjs-apps` (715w)
- `the-three-pillars-of-javascript-bloat` (712w)
- `mastering-code-splitting-in-react-strategic-dynamic-imports-for-reducing-total-blocking-time` (686w)

### Micro-frontends  — keep 1 / 1

**KEEP:** `microfrontends-with-nextjs-solving-crossapplication-state-and-style-isolation` — Distinct advanced topic; longest post with concrete state/style-isolation discussion.

### Opinion (technical)  — keep 1 / 1

**KEEP:** `react-singletons-arent-as-evil-as-you-think` — Clean, distinct opinion+technical piece; no fabricated anecdotes.

### Custom hooks / refactoring  — keep 1 / 1

**KEEP:** `refactoring-for-performance-how-to-safely-decouple-complex-ui-logic-into-testable-custom-hooks` — Distinct angle: extracting UI logic into testable custom hooks.

### State management  — keep 1 / 1

**KEEP:** `scaling-state-management-when-to-move-from-context-api-to-atomic-state-or-signals` — Distinct topic: Context vs atomic state vs signals; concrete decision guidance.

### Core Web Vitals / CLS  — keep 1 / 1

**KEEP:** `solving-cumulative-layout-shift-cls-best-practices-for-responsive-images-in-tailwind-css` — Distinct CLS sub-topic with concrete responsive-image guidance.

## Full verdict table (all 91)

| Verdict | Post | Words | Cluster | Reason |
|---|---|---|---|---|
| KEEP | `scalable-react-architecture-implementing-a-featurebased-folder-structure-for-large-teams` | 748 | App architecture | Strongest of 6 architecture posts: concrete feature-folder tree + `index.ts` public API, most code. |
| KEEP | `handling-authentication-in-mern-apps-using-jwt` | 753 | Auth / MERN | Distinct practical topic: JWT auth in MERN. Concrete. |
| KEEP | `common-mistakes-i-made-while-learning-react-and-how-i-fixed-them` | 847 | Authentic junior post | On-brand for ~1yr experience; honest learning framing, minimal fabrication, no false authority. |
| KEEP | `practical-treeshaking-how-to-audit-and-eliminate-thirdparty-bloat-from-react-production-bundles` | 753 | Bundle size / tree-shaking | Best of the large bundle/code-split cluster: actionable audit workflow, no invented numbers. |
| KEEP | `component-composition-vs-configuration-solving-the-megaprops-antipattern-in-large-react-apps` | 510 | Composition | Distinct concept (mega-props anti-pattern); concrete though shorter. |
| KEEP | `mastering-compound-components-building-flexible-and-reusable-ui-systems-in-react` | 836 | Compound components | Strongest of 7 near-dupes: fullest compound-component example with context wiring. |
| KEEP | `solving-cumulative-layout-shift-cls-best-practices-for-responsive-images-in-tailwind-css` | 739 | Core Web Vitals / CLS | Distinct CLS sub-topic with concrete responsive-image guidance. |
| KEEP | `advanced-image-optimization-strategies-for-improving-lcp-in-nextjs-applications` | 715 | Core Web Vitals / LCP | Best LCP post: concrete `next/image` `priority`/`sizes`/AVIF code, no invented metrics in title. |
| KEEP | `refactoring-for-performance-how-to-safely-decouple-complex-ui-logic-into-testable-custom-hooks` | 810 | Custom hooks / refactoring | Distinct angle: extracting UI logic into testable custom hooks. |
| KEEP | `advanced-tanstack-query-handling-complex-cache-invalidation-and-optimistic-ui-updates` | 746 | Data fetching (TanStack Query) | Distinct topic with specific TanStack Query cache-invalidation APIs. |
| KEEP | `building-highperformance-forms-in-react-controlled-vs-uncontrolled-strategies-for-large-datasets` | 808 | Forms | Stronger of 2 form posts: controlled-vs-uncontrolled with a large-dataset angle. |
| KEEP | `microfrontends-with-nextjs-solving-crossapplication-state-and-style-isolation` | 868 | Micro-frontends | Distinct advanced topic; longest post with concrete state/style-isolation discussion. |
| KEEP | `react-singletons-arent-as-evil-as-you-think` | 560 | Opinion (technical) | Clean, distinct opinion+technical piece; no fabricated anecdotes. |
| KEEP | `automating-frontend-performance-budgets-integrating-lighthouse-ci-into-your-pull-request-workflow` | 732 | Perf tooling | Distinct, concrete: Lighthouse CI wired into PR workflow. No invented numbers. |
| KEEP | `effective-data-prefetching-strategies-in-nextjs-for-instant-page-transitions` | 786 | Prefetching | Best of 3 prefetch posts; concrete Next.js prefetch strategies. |
| KEEP | `beyond-memoization-5-architectural-patterns-to-eliminate-unnecessary-rerenders-in-large-react-apps` | 877 | Re-renders / memoization | Strongest of 5+ re-render posts: most concrete patterns, 2 code blocks. |
| KEEP | `architecting-nextjs-14-apps-when-to-use-server-components-vs-client-components` | 737 | React Server Components | Best of 6 RSC posts: practical server-vs-client decision framework. |
| KEEP | `frontend-resilience-implementing-robust-error-boundaries-and-skeleton-patterns-for-better-ux` | 726 | Resilience / loading UX | Covers error boundaries + skeletons; broader than the pure skeleton post. |
| KEEP | `scaling-state-management-when-to-move-from-context-api-to-atomic-state-or-signals` | 896 | State management | Distinct topic: Context vs atomic state vs signals; concrete decision guidance. |
| KEEP | `advanced-tailwind-css-building-a-scalable-design-system-with-cva-and-tailwind-merge` | 755 | Tailwind design system | Strongest of 10 near-dupes: real CVA + tailwind-merge + `cn` helper code, named APIs. |
| KEEP | `architecting-typesafe-component-interfaces-advanced-typescript-patterns-for-senior-react-developers` | 745 | TypeScript patterns | Concrete advanced TS component-typing patterns; audience label, not a self-authority claim. |
| KEEP | `building-accessible-and-highperformance-data-tables-with-react-virtualization` | 758 | Virtualization / tables | Stronger of 2 virtualization posts: adds accessibility + concrete table virtualization. |
| DELETE | `architecting-scalable-nextjs-apps-mastering-the-app-router-and-shared-layouts` | 757 | App architecture | Duplicate of the kept "App architecture" post; weaker on concrete detail. |
| DELETE | `architecting-scalable-nextjs-apps-transitioning-from-layered-folders-to-featurebased-modules` | 746 | App architecture | Duplicate of the kept "App architecture" post; weaker on concrete detail. |
| DELETE | `architecting-scalable-react-apps-folder-structures-and-patterns-for-largescale-monorepos` | 746 | App architecture | Duplicate of the kept "App architecture" post; weaker on concrete detail. |
| DELETE | `the-clean-code-frontend-applying-solid-principles-to-react-component-architecture` | 732 | App architecture | Duplicate of the kept "App architecture" post; weaker on concrete detail. |
| DELETE | `the-clean-code-guide-for-react-structuring-largescale-frontend-projects-for-maintainability` | 780 | App architecture | Duplicate of the kept "App architecture" post; weaker on concrete detail. |
| DELETE | `mastering-code-splitting-in-react-strategic-dynamic-imports-for-reducing-total-blocking-time` | 686 | Bundle size / tree-shaking | Duplicate of the kept "Bundle size / tree-shaking" post; weaker on concrete detail. |
| DELETE | `microoptimizing-react-bundles-codesplitting-strategies-that-actually-reduce-tbt-total-blocking-time` | 736 | Bundle size / tree-shaking | Duplicate of the kept "Bundle size / tree-shaking" post; weaker on concrete detail. |
| DELETE | `modern-code-splitting-strategies-for-reducing-initial-bundle-size-in-complex-nextjs-apps` | 715 | Bundle size / tree-shaking | Duplicate of the kept "Bundle size / tree-shaking" post; weaker on concrete detail. |
| DELETE | `radical-bundle-size-reduction-identifying-and-eliminating-treeshaking-bottlenecks-in-react-apps` | 803 | Bundle size / tree-shaking | Duplicate of the kept "Bundle size / tree-shaking" post; weaker on concrete detail. |
| DELETE | `reducing-total-blocking-time-tbt-strategies-for-granular-code-splitting-in-large-nextjs-projects` | 806 | Bundle size / tree-shaking | Duplicate of the kept "Bundle size / tree-shaking" post; weaker on concrete detail. |
| DELETE | `the-art-of-treeshaking-practical-techniques-for-auditing-and-reducing-bundle-size-in-react-applications` | 854 | Bundle size / tree-shaking | Duplicate of the kept "Bundle size / tree-shaking" post; weaker on concrete detail. |
| DELETE | `the-three-pillars-of-javascript-bloat` | 712 | Bundle size / tree-shaking | Duplicate of the kept "Bundle size / tree-shaking" post; weaker on concrete detail. |
| DELETE | `treeshaking-and-code-splitting-strategies-for-reducing-react-bundle-size-in-enterprise-apps` | 788 | Bundle size / tree-shaking | Duplicate of the kept "Bundle size / tree-shaking" post; weaker on concrete detail. |
| DELETE | `beyond-the-basics-implementing-compound-components-for-highly-reusable-ui-libraries` | 767 | Compound components | Duplicate of the kept "Compound components" post; weaker on concrete detail. |
| DELETE | `building-reusable-ui-components-with-react-and-tailwind` | 453 | Compound components | Duplicate of the kept "Compound components" post; weaker on concrete detail. |
| DELETE | `compound-components-and-inversion-of-control-building-flexible-lowmaintenance-ui-kits` | 791 | Compound components | Duplicate of the kept "Compound components" post; weaker on concrete detail. |
| DELETE | `mastering-compound-components-building-flexible-and-reusable-ui-kits-in-react` | 751 | Compound components | Duplicate of the kept "Compound components" post; weaker on concrete detail. |
| DELETE | `the-architecture-of-headless-ui-building-highly-reusable-components-with-react-aria` | 536 | Compound components | Duplicate of the kept "Compound components" post; weaker on concrete detail. |
| DELETE | `the-compound-component-pattern-building-highly-reusable-and-flexible-ui-components-in-react` | 683 | Compound components | Duplicate of the kept "Compound components" post; weaker on concrete detail. |
| DELETE | `finetuning-core-web-vitals-advanced-strategies-for-optimizing-lcp-and-cls-in-nextjs` | 815 | Core Web Vitals | Duplicate — redundant with the kept LCP + CLS posts; a generic "deep dive" often padded with invented metrics. |
| DELETE | `optimizing-core-web-vitals-a-deep-dive-into-lcp-and-cls-improvements-in-nextjs` | 785 | Core Web Vitals | Duplicate — redundant with the kept LCP + CLS posts; a generic "deep dive" often padded with invented metrics. |
| DELETE | `optimizing-core-web-vitals-a-deep-dive-into-nextjs-app-router-performance` | 945 | Core Web Vitals | Duplicate — redundant with the kept LCP + CLS posts; a generic "deep dive" often padded with invented metrics. |
| DELETE | `optimizing-core-web-vitals-a-deep-dive-into-nextjs-image-and-font-optimization-strategies` | 762 | Core Web Vitals | Duplicate — redundant with the kept LCP + CLS posts; a generic "deep dive" often padded with invented metrics. |
| DELETE | `optimizing-core-web-vitals-in-2024-a-deep-dive-into-lcp-and-cls-in-nextjs-app-router` | 786 | Core Web Vitals | Duplicate — redundant with the kept LCP + CLS posts; a generic "deep dive" often padded with invented metrics. |
| DELETE | `optimizing-hydration-preventing-content-mismatch-and-improving-first-input-delay` | 777 | Core Web Vitals | Duplicate — redundant with the kept LCP + CLS posts; a generic "deep dive" often padded with invented metrics. |
| DELETE | `optimizing-interaction-to-next-paint-inp-practical-strategies-for-react-18-applications` | 773 | Core Web Vitals | Duplicate — redundant with the kept LCP + CLS posts; a generic "deep dive" often padded with invented metrics. |
| DELETE | `optimizing-the-critical-rendering-path-preloading-prefetching-and-priority-hints-in-modern-react` | 780 | Core Web Vitals | Duplicate — redundant with the kept LCP + CLS posts; a generic "deep dive" often padded with invented metrics. |
| DELETE | `building-highperformance-forms-balancing-clientside-validation-and-render-efficiency` | 797 | Forms | Duplicate of the kept "Forms" post; weaker on concrete detail. |
| DELETE | `beyond-lighthouse-implementing-realuser-monitoring-rum-to-track-actual-frontend-performance` | 811 | Perf tooling | Duplicate of the kept "Perf tooling" post; weaker on concrete detail. |
| DELETE | `implementing-optimistic-ui-and-prefetching-strategies-for-instant-page-transitions` | 733 | Prefetching | Duplicate of the kept "Prefetching" post; weaker on concrete detail. |
| DELETE | `predictive-preloading-boosting-perceived-performance-in-nextjs-with-intentbased-prefetching` | 726 | Prefetching | Duplicate of the kept "Prefetching" post; weaker on concrete detail. |
| DELETE | `beyond-usememo-a-practical-guide-to-identifying-and-fixing-redundant-rerenders-in-react` | 542 | Re-renders / memoization | Duplicate of the kept "Re-renders / memoization" post; weaker on concrete detail. |
| DELETE | `eliminating-unnecessary-rerenders-advanced-memoization-patterns-in-react-18` | 799 | Re-renders / memoization | Duplicate of the kept "Re-renders / memoization" post; weaker on concrete detail. |
| DELETE | `optimizing-react-performance-eliminating-unnecessary-rerenders-with-composition-patterns` | 769 | Re-renders / memoization | Duplicate of the kept "Re-renders / memoization" post; weaker on concrete detail. |
| DELETE | `the-cost-of-rerenders-using-the-react-profiler-to-fix-performance-bottlenecks-in-complex-forms` | 825 | Re-renders / memoization | Duplicate of the kept "Re-renders / memoization" post; weaker on concrete detail. |
| DELETE | `mastering-react-server-components-a-guide-to-reducing-clientside-bundle-size-in-nextjs` | 790 | React Server Components | Duplicate of the kept "React Server Components" post; weaker on concrete detail. |
| DELETE | `mastering-react-server-components-architecture-patterns-for-highperformance-apps` | 793 | React Server Components | Duplicate of the kept "React Server Components" post; weaker on concrete detail. |
| DELETE | `optimizing-react-server-components-best-practices-for-data-fetching-and-hydration-performance` | 797 | React Server Components | Duplicate of the kept "React Server Components" post; weaker on concrete detail. |
| DELETE | `react-server-components-vs-clientside-fetching-a-performance-comparison-for-dataheavy-uis` | 620 | React Server Components | Duplicate of the kept "React Server Components" post; weaker on concrete detail. |
| DELETE | `the-react-server-components-mental-model-decoupling-data-fetching-from-client-logic` | 799 | React Server Components | Duplicate of the kept "React Server Components" post; weaker on concrete detail. |
| DELETE | `implementing-efficient-skeletal-loading-states-in-nextjs-app-router` | 658 | Resilience / loading UX | Duplicate of the kept "Resilience / loading UX" post; weaker on concrete detail. |
| DELETE | `building-typesafe-custom-hooks-a-senior-engineers-guide-to-frontend-logic-reusability` | 876 | Standalone | FALSE AUTHORITY: 'A Senior Engineer's Guide' — authority you do not have at ~1yr experience. |
| DELETE | `cutting-your-bundle-size-by-40-advanced-code-splitting-and-tree-shaking-strategies` | 787 | Standalone | INVENTED BENCHMARK in title ('by 40%') + redundant with kept tree-shaking post. |
| DELETE | `how-i-built-a-scalable-react-app-with-tailwind-and-redux` | 768 | Standalone | FABRICATION-BUILT: entire post is a fabricated 'how I built X' project narrative (4 invented-anecdote hits). |
| DELETE | `in-the-ai-era-code-is-cheap-reputation-isnt` | 1533 | Standalone | OFF-BRAND AI opinion essay. |
| DELETE | `optimizing-react-performance-in-realworld-apps` | 465 | Standalone | FABRICATION-HEAVY (4 hits) and redundant with the kept re-render post. |
| DELETE | `pragmatic-memoization-a-senior-engineers-guide-on-when-to-actually-use-usememo-and-usecallback` | 720 | Standalone | FALSE AUTHORITY: 'A Senior Engineer's Guide' + redundant with kept re-render post. |
| DELETE | `tech-employment-now-significantly-worse-than-the-2008-or-2020-recessions` | 1096 | Standalone | OFF-TOPIC macro-economics opinion. |
| DELETE | `the-agent-buddy-system-when-prompt-engineering-isnt-enough` | 1270 | Standalone | OFF-BRAND AI-agents opinion piece. |
| DELETE | `the-old-seniority-definition-is-collapsing` | 625 | Standalone | OFF-BRAND career opinion; not frontend, generic. |
| DELETE | `the-real-skill-in-programming-is-debugging-everything-else-is-copypaste` | 604 | Standalone | GENERIC FILLER: no specific technical content; healthcare/finance/aerospace padding. |
| DELETE | `thinking-fast-slow-and-artificial-how-ai-is-reshaping-human-reasoning` | 798 | Standalone | FABRICATION + persona conflict: invented projects ('MERN dashboard', 'real-time task manager') and claims 'final year CS student' (contradicts your ~1yr professional experience). |
| DELETE | `universal-vaccine-against-respiratory-infections-and-allergens` | 1350 | Standalone | OFF-TOPIC: vaccinology essay, unrelated to a frontend portfolio. |
| DELETE | `when-ai-writes-the-code-who-takes-responsibility` | 1494 | Standalone | OFF-BRAND AI opinion essay. |
| DELETE | `when-projects-fail-why-companies-should-treat-open-source-as-infrastructure` | 1363 | Standalone | OFF-TOPIC open-source/business opinion. |
| DELETE | `why-are-we-still-doing-gpu-work-in-javascript-live-webgpu-benchmark-demo` | 1295 | Standalone | FALSE AUTHORITY + fake artifact: 'As a senior engineer...' and a 'Live Benchmark & Demo' that does not exist. |
| DELETE | `beyond-the-basics-leveraging-tailwind-css-config-for-a-truly-scalable-design-system` | 686 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `building-a-highly-extensible-design-system-with-tailwind-css-and-cva` | 776 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `building-a-robust-design-system-with-tailwind-css-and-headless-ui` | 799 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `design-systems-with-tailwind-css-strategies-for-themeable-and-maintainable-component-libraries` | 788 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `scaling-tailwind-css-architecting-a-maintainable-design-system-for-enterprise-applications` | 850 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `scaling-tailwind-css-architecting-a-maintainable-design-system-for-enterprise-monorepos` | 803 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `scaling-tailwind-css-architecting-a-maintainable-design-system-in-large-monorepos` | 803 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `scaling-tailwind-css-architecting-a-maintainable-design-system-in-largescale-react-monorepos` | 754 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `scaling-tailwind-css-building-a-consistent-design-system-for-enterprise-applications` | 849 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `scaling-tailwind-css-building-a-typesafe-design-system-with-cva-and-tailwind-merge` | 746 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `zerobundlesize-ui-logic-leveraging-modern-css-and-tailwind-for-highperformance-interactions` | 766 | Tailwind design system | Duplicate of the kept "Tailwind design system" post; weaker on concrete detail. |
| DELETE | `typesafe-frontend-architecture-leveraging-typescript-and-tailwind-for-bulletproof-ui-development` | 736 | TypeScript patterns | Duplicate of the kept "TypeScript patterns" post; weaker on concrete detail. |
| DELETE | `virtualization-vs-pagination-solving-rendering-bottlenecks-in-dataheavy-react-dashboards` | 716 | Virtualization / tables | Duplicate of the kept "Virtualization / tables" post; weaker on concrete detail. |

---

**Next step:** reply to confirm (or edit the KEEP/DELETE set). On approval I run Phase 4: `git mv` the 22 survivors into `drafts/`, add `status: draft` + `aiAssisted: true`, and `git rm` the 69 deletions.

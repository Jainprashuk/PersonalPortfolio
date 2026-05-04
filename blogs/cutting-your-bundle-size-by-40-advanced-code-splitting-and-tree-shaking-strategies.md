---
title: Cutting Your Bundle Size by 40%: Advanced Code Splitting and Tree Shaking Strategies
date: 2026-05-04T07:49:33.024Z
description: Blog about Cutting Your Bundle Size by 40%: Advanced Code Splitting and Tree Shaking Strategies
---

Hey everyone, Prashuk here.

If you’re like me, you probably obsess over Lighthouse scores. There’s nothing that kills the vibe of a clean UI faster than a "janky" loading experience or a three-second white screen because the browser is choking on a 2MB JavaScript bundle.

In one of my recent projects—a pretty complex SaaS dashboard—I noticed the initial load felt... heavy. I checked the network tab and realized our main bundle was huge. We had all these heavy charts, date pickers, and PDF exporters loading right on the landing page, even though the user hadn't even logged in yet.

I managed to cut that bundle size by about 40%, and honestly, it wasn't as hard as I thought. Here’s how I did it.

### 1. Stop Guessing, Start Analyzing
Before I touch a single line of code, I need to see the "bloat." I always reach for `webpack-bundle-analyzer` (or the Vite equivalent if I'm on a newer stack).

I ran into this issue where I thought a specific UI library was the culprit, but the analyzer showed that a single, poorly imported icon library was actually taking up 15% of the total size. Seeing that visual map of your code is a reality check. If you aren't looking at your bundle map, you're just stabbing in the dark.

### 2. The "Lazy" Way is the Better Way
We often talk about Code Splitting like it’s some high-level architectural decision, but in React/Next.js, it’s literally just a wrapper.

What worked for me was identifying "heavy hitters"—components that are code-heavy but not immediately visible. Think:
*   Modals and Dialogs
*   Complex Data Tables
*   Rich Text Editors (looking at you, Quill/Tiptap)

Instead of importing them at the top of the file, I switched to dynamic imports.

```javascript
// Instead of this:
// import HeavyChart from './components/HeavyChart';

// I did this:
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./components/HeavyChart'), {
  loading: () => <p>Loading Chart...</p>,
  ssr: false // Only load on the client side
});
```

By doing this, I took about 200KB off the initial "Critical Path" and moved it to a separate chunk that only loads when the user actually needs that chart.

### 3. The "Barrel File" Trap
I used to love barrel files (`index.ts` files that export everything from a folder). They make imports look clean: `import { Button, Input, Modal } from '@/components'`. 

But here’s the problem: sometimes, your bundler gets confused and pulls in *everything* in that folder even if you only wanted the Button. I noticed this when our login page started importing heavy D3.js utilities just because they lived in the same "utils" folder.

Now, I’m much more careful. If a utility is massive, I import it directly from the file path. It's a bit more typing, but the performance gain is worth the extra five seconds of work.

### 4. Auditing Your Dependencies (The Lodash Problem)
We’ve all been there. You need one function to deep-clone an object, so you install `lodash`. 

In my experience, 90% of the time, you don't need the whole library. I started swapping out big libraries for smaller, modular ones. 
*   Need date formatting? Use `date-fns` instead of `moment.js`. 
*   Need utility functions? Just write them yourself or import specific lodash methods like `lodash/cloneDeep` instead of the whole package.

Modern browsers have native APIs for almost everything now. I’ve started asking myself: "Do I actually need a library for this, or can I write a 5-line helper function?" Usually, it's the latter.

### 5. My Best Practices for a Lean App
After breaking things and fixing them over the years, here is my personal checklist:

*   **Route-based splitting:** Every route should be its own chunk. Next.js does this by default, which is why I love it.
*   **Tree-shaking friendly libraries:** Before adding a dependency, I check [BundlePhobia](https://bundlephobia.com/). If a library isn't tree-shakeable, I look for an alternative.
*   **Image Optimization:** It’s not just JS. Large unoptimized images make the bundle *feel* slow. Use `next/image`—it’s a lifesaver.
*   **Purge your CSS:** If you use Tailwind, this is handled, but if you’re using CSS Modules or old-school SCSS, make sure you aren't shipping dead styles.

### The Result?
By the time I finished these tweaks, our main bundle dropped from roughly 1.2MB to around 700KB. The "Time to Interactive" felt instant, and the UI was much snappier on mobile devices.

At the end of the day, clean code isn't just about how it looks to you; it's about how it performs for the user. Don't let your features drown in their own weight.

What are you guys using to keep your bundles small? Let me know, I’m always looking to optimize my workflow.

Keep coding,
**Prashuk**

---
title: Reducing Total Blocking Time (TBT): Strategies for Granular Code Splitting in Large Next.js Projects
date: 2026-05-25T09:00:42.359Z
description: Blog about Reducing Total Blocking Time (TBT): Strategies for Granular Code Splitting in Large Next.js Projects
---

Hey everyone, I’m Prashuk. 

If you’ve been working with Next.js for a while, you know the drill: you build a feature, it looks great on your local machine, but then you run a Lighthouse report and see that dreaded red bar for **Total Blocking Time (TBT)**. 

I’m obsessed with performance because, honestly, a beautiful UI is useless if the button feels "stuck" when a user clicks it. I’ve spent a lot of time digging into why my apps felt sluggish, and it almost always came down to the main thread being choked by too much JavaScript execution at once.

Here’s how I’ve been handling granular code splitting to keep my projects snappy.

---

### 1. The "Hidden" TBT Killer: Heavy Third-Party Components
I ran into this issue when I was building a data-heavy dashboard. We had these beautiful, complex charts and a full-blown rich text editor. The problem? Even though they were "below the fold," the browser was trying to parse all that JS immediately on load.

What worked for me was being ruthless with `next/dynamic`. I stopped thinking about "pages" and started thinking about "interaction chunks." If a user isn't seeing a chart or using an editor the second the page loads, that code shouldn't be in the main bundle.

### 2. Don’t Just Dynamic Import—Lazy Load on Interaction
Standard dynamic imports are cool, but they still fire off a network request when the component *might* be rendered. In one of my recent projects, I took it a step further. 

I had a heavy "Settings Modal" that pulled in a bunch of form libraries (like Yup and Formik). Instead of just dynamic importing the modal, I wrapped the import in a state trigger. 

**My rule of thumb:** If it’s a modal, a slide-over, or a complex dropdown—don't load it until the user actually hovers over the trigger button or clicks it.

### 3. The Code: Real-World Splitting
Here’s a quick look at how I structure a "heavy" component now to keep the TBT low.

```javascript
import { useState } from 'react';
import dynamic from 'next/dynamic';

// We don't want this taking up main thread time on initial load
const HeavyChart = dynamic(() => import('../components/Visuals/HighChartsWrapper'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-100" /> 
});

export default function AnalyticsSection() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <h3>Quick Stats</h3>
      <p>This part is light and fast.</p>

      {showDetails ? (
        <HeavyChart />
      ) : (
        <button 
          onClick={() => setShowDetails(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          View Detailed Analytics
        </button>
      )}
    </div>
  );
}
```
*Tip: Always use a skeleton loader in the `loading` property. It makes the "pop-in" feel intentional rather than like a bug.*

### 4. Beware of the "Barrel File" Trap
I used to love barrel files (`index.ts` files that export everything from a folder). I thought it made my imports look cleaner. 

But I realized that in some configurations, especially with older Webpack setups in Next.js, importing even one small utility from a barrel file could occasionally pull in more than you bargained for, bloating the chunk size. Now, I prefer direct imports for heavy hitters. It's a bit more typing, but the bundle stays lean.

### 5. Moving Logic to the Edge (or just off the Main Thread)
Sometimes TBT isn't about loading code; it's about *running* it. I had a project where I had to process a massive JSON object to filter some results. Doing that on the main thread caused a 400ms lag—totally unacceptable.

What I did was move that logic into a `Web Worker` or, where possible, handled the transformation in `getStaticProps` or an API route. If the browser doesn't have to calculate it, the main thread stays free to handle user clicks.

---

### My "Checklist" for Reducing TBT

*   **Audit your `_app.js`**: If you have global components (like Modals or Toasts) there, make sure they aren't importing heavy libraries until needed.
*   **Use `ssr: false`**: For components that rely on window or browser APIs, this prevents the server from doing double work and keeps the hydration light.
*   **Look at your icons**: I once realized a project was shipping the entire FontAwesome library. Switching to individual SVG imports reduced my TBT significantly.
*   **Throttle/Debounce**: If you have heavy logic tied to scroll or resize events, for the love of clean code, wrap them in a throttle function.

### Final Thoughts
At the end of the day, reducing TBT is about being "lazy" in the best way possible. Don't make the browser work for things the user hasn't asked for yet. 

When I started being granular with my code splitting, my Lighthouse scores jumped from the 60s to the high 90s, but more importantly, the site *felt* better to use. And that's what actually matters.

Keep it clean, keep it fast. Catch you in the next one!

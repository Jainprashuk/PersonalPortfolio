---
title: Micro-Optimizing React Bundles: Code-Splitting Strategies That Actually Reduce TBT (Total Blocking Time)
date: 2026-06-19T09:47:23.616Z
description: Blog about Micro-Optimizing React Bundles: Code-Splitting Strategies That Actually Reduce TBT (Total Blocking Time)
---

Hey everyone, I’m Prashuk. I spend most of my time building interfaces with React and Next.js. If you’re like me, you’ve probably stared at a Lighthouse report and wondered why your "Total Blocking Time" (TBT) is in the red, even though you think you’ve "optimized" everything.

Theory tells you to just "code-split." But in the real world, if you code-split the wrong way, you just trade one problem for another. 

Here’s how I actually approach shrinking bundles and keeping the main thread free, based on what’s worked in my own projects.

### 1. The Route-Level Trap
Most tutorials tell you to wrap your routes in `React.lazy()`. That’s fine for a start, but it’s rarely enough. 

In one of my recent projects—a complex SaaS dashboard—I noticed that even with route-based splitting, my "Settings" page was taking forever to become interactive. Why? Because that one route was importing three different heavy charting libraries and two massive modal components. 

**What worked for me was splitting *inside* the route.** I stopped thinking of pages as the smallest unit of splitting. Now, I look for "Heavy Islands"—things like complex tables, editors, or visualization tools—and lazy load them individually within the page.

### 2. Death by "Import Everything"
I ran into this issue when I was using a popular UI library. We were importing a massive `Icon` or `Utility` bundle at the top level of a component. Even if we only used one icon, the whole chunk got bloated.

Be careful with barrel files (those `index.js` files that export everything from a folder). They are convenient, but they are often the reason your bundle is leaking weight. I’ve started being very surgical about my imports. If a library doesn't support tree-shaking properly, I’m looking for an alternative or writing a custom hook to handle that specific logic.

### 3. The "Interaction-Based" Split
This is my favorite trick. Why load a "Delete Account" modal and all its validation logic when the user hasn't even clicked the "Settings" button?

Instead of loading everything on mount, I load heavy components on *interaction*. You can trigger a dynamic import when a user hovers over a button or clicks a menu.

```javascript
// What I usually do for heavy components
const [showHeavyModal, setShowHeavyModal] = useState(false);

// Dynamically import only when needed
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

return (
  <>
    <button 
      onMouseEnter={() => import('./HeavyComponent')} // Prefetch on hover
      onClick={() => setShowHeavyModal(true)}
    >
      Open Massive Editor
    </button>

    {showHeavyModal && (
      <Suspense fallback={<Spinner />}>
        <HeavyComponent />
      </Suspense>
    )}
  </>
);
```

### 4. Scrolling is the Signal
I’ve realized that the footer of a site is often the most useless thing to load initially. It usually contains social media widgets, newsletter forms, and links that nobody looks at in the first 2 seconds.

I started using the `Intersection Observer` API to lazy-load components that are "below the fold." If the user doesn't scroll down, that JS never hits the browser. It’s a massive win for TBT because the browser isn't busy parsing code for a footer while the user is trying to read the hero section.

### 5. Audit Your Packages (Honestly)
We developers love installing packages. But `moment.js` or some unoptimized "Date Picker" can add 100kb+ to your bundle instantly. 

Every few weeks, I run `webpack-bundle-analyzer` (or the Vite equivalent). If I see a giant square in that chart that I don't recognize, I investigate. Replacing `moment` with `date-fns` or even native `Intl` APIs has saved me more bundle size than any clever code-splitting trick ever could.

### My Best Practices for Clean, Fast Code:
*   **Don't over-split:** Making 50 tiny chunks is worse than 5 medium ones because of the overhead of HTTP requests. 
*   **Placeholder UI is key:** If you’re lazy loading, make sure your `fallback` in `<Suspense>` matches the layout so the UI doesn't "jump" (Layout Shift).
*   **Measure on slow devices:** I always test on "6x CPU Throttling" in Chrome DevTools. If it feels snappy there, it’ll be lightning-fast for a regular user.

### Conclusion
At the end of the day, performance isn't about a single "magic" setting in your config. It's about being mindful of what you're forcing the user's browser to download and execute. 

Start small. Look at your biggest route, find the heaviest component that isn't immediately visible, and `React.lazy` it. You’ll see that TBT score drop almost immediately.

What’s the biggest "bundle-killer" you’ve found in your projects? Let me know.

---
title: Pragmatic Memoization: A Senior Engineer’s Guide on When to Actually Use useMemo and useCallback
date: 2026-04-15T06:56:42.934Z
description: Blog about Pragmatic Memoization: A Senior Engineer’s Guide on When to Actually Use useMemo and useCallback
---

Hey everyone, Prashuk here. 

If you’ve been in the React ecosystem for a while, you’ve probably seen codebases where every single function is wrapped in `useCallback` and every variable is tucked inside `useMemo`. I’ll be honest—early in my career, I was that guy. I thought I was being a "performance wizard." 

But after building and maintaining several production-grade MERN apps, I’ve realized that memoization is often a double-edged sword. Most of the time, you’re just making your code harder to read without any actual gain in frames per second.

Here’s my pragmatic take on how I actually handle memoization in my projects today.

---

### 1. The "Premature Optimization" Trap

In one of my earlier projects—a custom CRM dashboard—I remember wrapping a simple string formatting function in `useMemo`. I thought, "Hey, this runs on every render, better optimize it."

**What worked for me was realizing this:** React is incredibly fast at basic calculations. If you’re just filtering a list of 50 items or formatting a date, the overhead of React tracking dependencies in `useMemo` is literally more work for the browser than just re-running the function.

**My Rule:** Don't memoize unless you’re dealing with expensive data transformations (like processing thousands of rows of JSON) or you’re trying to maintain referential integrity.

### 2. When useMemo Actually Saved My UI

I ran into this issue when building a real-time analytics platform. We had a chart that re-rendered every time a user typed in a search box elsewhere on the page. The chart wasn't even changing, but the heavy "data-crunching" logic was firing on every keystroke. 

The UI felt laggy. The search input had a noticeable delay. 

That’s when I used `useMemo`. By wrapping the data processing logic, I ensured that the heavy lifting only happened when the actual *data* changed, not just because the parent component re-rendered.

```javascript
// What I did to fix the lag
const processedData = useMemo(() => {
  return heavyDataCrunching(rawData); // This only runs if rawData changes
}, [rawData]);
```

### 3. The Real Use Case for useCallback

A lot of devs think `useCallback` makes functions faster. It doesn't. In fact, it makes them slightly slower to define. 

The only reason I use `useCallback` is to prevent **unnecessary re-renders of child components** that are wrapped in `React.memo`.

I remember a project where a complex Map component was re-rendering 50 times a second. It turned out I was passing an inline function as a prop. Every time the parent state changed, a "new" function was created, and the Map (which was expensive to render) thought its props had changed. 

`useCallback` fixed that instantly because it kept the function "stable" between renders.

### 4. Referential Integrity: The Silent Bug Killer

This is a clean code thing I care about. Sometimes, you need `useMemo` not for performance, but to keep your `useEffect` from going infinite.

I once spent two hours debugging an infinite loop in a Next.js app. I was passing an object as a dependency to a `useEffect`. Because that object was recreated on every render, the effect kept firing, which updated state, which triggered a render... you get the point.

**What I do now:** If I have to pass an object or array into a dependency array, I wrap it in `useMemo`. It keeps the reference the same and keeps the "useEffect" stable.

### 5. My Pragmatic Checklist

Before I hit `cmd+s` on a new hook, I ask myself:

*   **Is it actually slow?** (I check the Chrome DevTools Profiler).
*   **Is this a "Heavy" computation?** (Sorting 1000+ items? Yes. Formatting a currency? No.)
*   **Am I passing this to a memoized child?** If the child isn't wrapped in `React.memo`, using `useCallback` on the prop is mostly useless.
*   **Is this for a Dependency Array?** If I need to keep a reference stable for a `useEffect`, then it's a green light.

---

### Conclusion

At the end of the day, clean code and a smooth UI are what matter. Over-memoizing makes your code look like a mess of brackets and dependency arrays that are a nightmare to maintain.

My advice? **Build it simple first.** If you notice a lag or a weird re-rendering bug, then reach for `useMemo` and `useCallback`. Don't solve problems you don't have yet.

Keep it pragmatic. See you in the next one!

**— Prashuk**

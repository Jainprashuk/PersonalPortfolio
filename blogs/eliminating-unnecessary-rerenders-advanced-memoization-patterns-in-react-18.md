---
title: Eliminating Unnecessary Re-renders: Advanced Memoization Patterns in React 18
date: 2026-03-31T06:18:35.818Z
description: Blog about Eliminating Unnecessary Re-renders: Advanced Memoization Patterns in React 18
---

Hey, I’m Prashuk. I spend most of my day building full-stack apps with the MERN stack and Next.js. If you're like me, you probably care more about how a button *feels* when you click it than the underlying Category Theory of React.

I’m obsessed with performance. Not the "benchmarking for fun" kind, but the "why is this text input lagging?" kind. 

Lately, I've been diving deep into React 18’s rendering behavior. We’ve all been told that React is fast, but if you're not careful with how you handle state and props, your app can quickly turn into a "janky" mess.

Here is how I actually handle re-renders in my projects.

### 1. The "Memoize Everything" Trap
When I first started out, I used to wrap literally every component in `React.memo()`. I thought I was being a performance wizard. 

**I was wrong.**

In one of my early projects—a project management tool—I realized that memoizing every small component actually made the initial load *slower*. React has to compare props every single time, and that overhead adds up. 

What worked for me was being selective. I only use `memo` now for:
*   Large lists or tables.
*   Components with heavy computations (like charts).
*   Components that stay static while their parent re-renders frequently (like a sidebar).

### 2. Stop Breaking Reference Equality
This is the silent killer. I ran into this issue when I was building a real-time data dashboard. I had a child component that was memoized, but it was still re-rendering every time the parent state changed.

The culprit? An inline object.

```javascript
// Don't do this
<ExpensiveComponent options={{ color: 'blue' }} />
```

In React, `{} === {}` is false. Every time the parent renders, that object is recreated, the reference changes, and `React.memo` thinks the props are new.

What I do now is use `useMemo` for objects/arrays and `useCallback` for functions. It keeps the reference stable, and the child component actually stays quiet.

### 3. The Power of `useDeferredValue` in React 18
React 18 gave us some cool toys, and `useDeferredValue` is probably my favorite for UI snappiness. 

I had a search feature in a recent project where the list was huge. Every keystroke triggered a state update, which triggered a heavy filter logic, making the input lag. 

Instead of traditional debouncing (which can feel disconnected), I used `useDeferredValue`. It allows React to prioritize the input typing first and then "catch up" with the list rendering in the background. It makes the UI feel incredibly smooth without much effort.

### 4. Moving State Down (The Cleanest Fix)
Before reaching for `useMemo`, I always ask myself: "Does this state need to be here?"

Often, we lift state up to the parent because it's "easier," but then the whole tree re-renders for no reason. In a settings page I was building, I moved the "Is Hovered" state from the main container down into the individual Card components. 

Result? The main container stopped re-rendering, and the code actually looked cleaner. No memoization needed.

### A Practical Example
Here’s a quick pattern I use when I have a parent updating frequently (like a timer) but a child that needs to stay static.

```javascript
import React, { useState, useMemo, useCallback } from 'react';

// Child only renders when 'data' or 'onAction' changes
const HeavyList = React.memo(({ data, onAction }) => {
  console.log("HeavyList rendered!");
  return (
    <ul>
      {data.map(item => <li key={item} onClick={onAction}>{item}</li>)}
    </ul>
  );
});

export default function Dashboard() {
  const [count, setCount] = useState(0);
  const [items] = useState(['React', 'Next.js', 'Node.js']);

  // Stable reference for the function
  const handleAction = useCallback(() => {
    console.log("Action clicked");
  }, []);

  return (
    <div>
      <h1>Performance Demo</h1>
      <p>Timer: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment Timer</button>
      
      {/* HeavyList won't re-render when the timer ticks */}
      <HeavyList data={items} onAction={handleAction} />
    </div>
  );
}
```

### Best Practices for Your Workflow
If you want to keep your React apps fast and your code clean, here’s my checklist:

*   **Profile, don't guess:** Use the React DevTools Profiler. It literally highlights what’s re-rendering and why. It’s a lifesaver.
*   **Composition over Memo:** Use the `children` prop. If a component wraps other components, the children won't re-render just because the wrapper does.
*   **Keep Context small:** If you use the Context API, don't put 50 different values in one provider. Split them up. Otherwise, every consumer re-renders when *any* value changes.

### Final Thoughts
At the end of the day, memoization is a tool, not a rule. My philosophy is: **Write clean code first, then optimize when you feel the lag.**

The goal isn't to have zero re-renders; it’s to have a UI that feels responsive and a codebase that doesn't make you want to quit your job.

What’s your biggest headache with React performance? Let’s chat in the comments.

— Prashuk

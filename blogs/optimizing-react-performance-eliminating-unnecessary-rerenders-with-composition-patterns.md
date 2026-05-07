---
title: Optimizing React Performance: Eliminating Unnecessary Re-renders with Composition Patterns
date: 2026-05-07T07:44:41.922Z
description: Blog about Optimizing React Performance: Eliminating Unnecessary Re-renders with Composition Patterns
---

Hey everyone, I’m Prashuk Jain. I spend most of my time building full-stack apps with the MERN stack and Next.js. If you've followed my work, you know I’m not a big fan of theoretical fluff. I like things that work in production and make the UI feel snappy.

Today, I want to talk about something that bugs almost every React developer: **unnecessary re-renders**.

### The "Memo" Trap

Most people, when they see a performance lag, immediately reach for `React.memo`, `useMemo`, or `useCallback`. Honestly? I think that’s often the wrong way to start. 

I’ve seen codebases littered with `memo` wrappers that don't actually do anything because the props being passed are new object references anyway. It makes the code messy and harder to read. 

In my experience, you can fix 80% of your re-render issues just by changing how you structure your components. This is where **Composition Patterns** come in.

### I ran into this issue when...

A few months ago, I was working on a project—a complex dashboard with a sidebar and a main content area. We had a "Theme Toggle" and a "User Profile" dropdown in the top navigation. 

Every single time the user opened the profile dropdown or toggled the theme, the *entire* dashboard (including a massive data table with 100+ rows) was re-rendering. You could actually see the slight frame drop. It felt heavy, and for a high-quality UI, that’s just not acceptable.

### Moving State Down

The first thing I realized was that we were keeping the "Open/Closed" state of the dropdown in the parent Layout component. 

**What worked for me was moving that state down.** If only the dropdown needs to know it’s open, why is the parent holding that state? By moving the state into a dedicated `UserMenu` component, the parent (and all its other children like the data table) stopped caring about those state updates.

### The "Children" Pattern (The Real Game Changer)

Sometimes you can't move state down because the state *has* to live in the parent. This is where I use the "Component as Props" or the `children` pattern.

When you pass a component as a prop (or as `children`), React doesn't re-render it when the parent's state changes, because that child component was actually created *outside* of the parent’s render cycle.

Here is a quick look at what I mean:

```javascript
// The "Bad" Way - Everything re-renders when 'count' changes
const Parent = () => {
  const [count, setCount] = useState(0);
  return (
    <div onClick={() => setCount(s => s + 1)}>
      <h1>Count: {count}</h1>
      <ExpensiveComponent /> 
    </div>
  );
};

// The "Practical" Way (Composition)
const LayoutWrapper = ({ children }) => {
  const [count, setCount] = useState(0);
  return (
    <div onClick={() => setCount(s => s + 1)}>
      <h1>Count: {count}</h1>
      {children} {/* This won't re-render! */}
    </div>
  );
};

// Implementation
const App = () => {
  return (
    <LayoutWrapper>
      <ExpensiveComponent />
    </LayoutWrapper>
  );
};
```

In the second example, `ExpensiveComponent` is passed as a child. Even when `LayoutWrapper` updates its state, React knows that `children` hasn't changed, so it skips re-rendering it. No `React.memo` needed. Clean and efficient.

### My Take on Performance

In one of my recent projects, I managed to cut down the render time of a page by almost 40% just by rearranging the component hierarchy. No complex logic, just moving things where they belong.

I’ve noticed that as developers, we often try to solve architectural problems with "optimization tools." But a tool can't fix a messy foundation. If your component tree is logically structured, React's reconciliation engine is actually incredibly fast on its own.

### Best Practices I Follow:

*   **State Colocation:** Keep state as close to where it’s used as possible. Don't lift state up unless you absolutely have to.
*   **Don't over-memoize:** If you use `memo`, make sure you're actually preventing a heavy render. Memoizing a simple `button` is just extra work for the engine.
*   **Use the Profiler:** Use the React DevTools Profiler. It’ll tell you exactly *why* a component re-rendered. Stop guessing.
*   **Composition over Props:** Instead of passing 20 props down a tree, see if you can pass a component instead.

### Conclusion

Optimization isn't about writing "smart" code; it's about writing "sensible" code. By using composition patterns like `children`, you're not just making your app faster—you're making your components more reusable and your codebase cleaner.

Next time your app feels a bit sluggish, don't reach for `useMemo` first. Look at your component tree and ask: "Does this component *really* need to know about this state change?"

That’s it for today. Keep it simple and focus on the user experience!

---
title: Optimizing Interaction to Next Paint (INP): Practical Strategies for React 18 Applications
date: 2026-06-05T08:45:21.174Z
description: Blog about Optimizing Interaction to Next Paint (INP): Practical Strategies for React 18 Applications
---

Hey everyone, Prashuk here.

If you’ve been keeping an eye on Core Web Vitals lately, you’ve probably noticed a new metric taking the spotlight: **Interaction to Next Paint (INP)**. It recently replaced First Input Delay (FID), and honestly, it’s a much better way to measure how "snappy" an app feels.

I’ve spent the last few months digging into this for a couple of client projects, and I’ll be real—React apps can get janky fast if you aren't careful with how you handle state updates.

Here is how I’ve been tackling INP in React 18 without getting lost in academic theory.

### 1. The "Heavy Task" Trap
I ran into this issue when I was building a complex dashboard for a logistics company. We had a massive data table, and whenever a user clicked a "Filter" button, the entire UI would freeze for about 500ms before showing the results.

The problem? React was trying to process the filter logic and re-render the entire list in one go. To the browser, this looks like a "long task," which kills your INP score.

**What worked for me was breaking things up.** Instead of letting React block the main thread, I started using `startTransition`. It tells React, "Hey, this update is important, but it's not *urgent*. Don't freeze the UI for it."

### 2. Using `useTransition` for Snappier UIs
This is arguably the best tool React 18 gives us for INP. In that same dashboard project, I wrapped the filtering logic in `useTransition`. 

This allowed the "Filter" button to show its active state immediately, while the actual list rendering happened in the background. The user gets instant visual feedback, even if the data takes a split second longer to appear.

```javascript
import { useState, useTransition } from 'react';

function SearchComponent({ items }) {
  const [isPending, startTransition] = useTransition();
  const [filteredItems, setFilteredItems] = useState(items);

  const handleFilter = (query) => {
    // Immediate feedback: Update the input field
    // (This happens outside the transition)
    
    startTransition(() => {
      // Non-urgent: The heavy lifting of filtering the list
      const results = items.filter(item => item.includes(query));
      setFilteredItems(results);
    });
  };

  return (
    <div>
      <input type="text" onChange={(e) => handleFilter(e.target.value)} />
      {isPending && <p>Updating list...</p>}
      <ul>
        {filteredItems.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
```

### 3. Avoiding "The Re-render Cascade"
I’m a big fan of clean code, but sometimes we get lazy with props. In one of my recent Next.js projects, I noticed that clicking a simple "Like" button was triggering a re-render of the entire feed.

INP measures the delay of *any* interaction. If a small click causes 50 components to check if they need to update, the main thread gets clogged.

**My rule of thumb:**
- Use `React.memo` for expensive components in a list.
- Keep state as local as possible. Don't lift state to a global provider if only one small component needs it.
- Use `useCallback` for event handlers that you pass down to memoized children.

### 4. Debouncing is still your friend
Even with React 18’s concurrent features, sometimes you just have too much happening. I recently worked on a project with a real-time search that hit an API. 

Initially, I didn't debounce the input. Every keystroke was firing an event, and the INP was through the roof because the browser was struggling to handle the rapid-fire UI updates. 

What worked for me was a simple 300ms debounce. It’s an old-school trick, but it’s still one of the most practical ways to keep the main thread clear for the "next paint."

### 5. Be careful with Third-Party Scripts
This is a silent killer for INP. You can optimize your React code all day, but if a heavy chat widget or an ad script is hogging the main thread, your INP will still suck.

In a recent performance audit, I found that a "simple" feedback popup was adding 200ms of delay to every click on the page. I moved that script to a `Web Worker` using Partytown, and the INP dropped instantly. 

### My Takeaway
Optimizing for INP isn't about some secret hack; it's about being respectful of the browser's main thread. 

**Quick checklist for your next project:**
- Use `useTransition` for any state update that triggers a large UI change.
- Look for "Long Tasks" (anything over 50ms) in the Chrome DevTools Performance tab.
- Don't let non-essential third-party scripts run on the main thread during user interactions.

At the end of the day, users don't care about your clean architecture if the button they click doesn't feel like it's working. Focus on that immediate feedback, and the INP scores will follow.

Catch you in the next one!
— Prashuk

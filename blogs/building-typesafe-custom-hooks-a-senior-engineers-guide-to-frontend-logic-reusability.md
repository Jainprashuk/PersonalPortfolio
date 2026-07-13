---
title: Building Type-Safe Custom Hooks: A Senior Engineer's Guide to Frontend Logic Reusability
date: 2026-07-13T08:19:50.945Z
description: Blog about Building Type-Safe Custom Hooks: A Senior Engineer's Guide to Frontend Logic Reusability
---

Hey everyone, Prashuk here. 

If you’ve been working with React for a while, you know that custom hooks are basically the bread and butter of keeping your components from turning into 500-line monsters. But there’s a big difference between a hook that "just works" and a hook that actually helps your team move faster without breaking things.

Lately, I’ve been doing a lot of heavy lifting in Next.js and MERN stack projects. One thing I’ve realized is that if your hooks aren't type-safe, you’re basically leaving landmines for your future self. 

Let's get into how I build these things in the real world.

### The "Any" Trap: Why generic types are non-negotiable

In one of my previous projects—a complex dashboard for an inventory system—we had a custom hook for fetching data. To save time, the developer (okay, it was me, early on) used `any` for the returned data type. 

Fast forward two months: we changed a field in the backend from `price` to `unit_price`. Since the hook was returning `any`, TypeScript didn't blink. The UI, however, just showed `undefined` across the entire production site. 

What worked for me was moving to **Generics**. Instead of guessing what the hook returns, you let the component calling the hook define it. It’s a simple shift, but it makes your code incredibly predictable.

### Real-world Example: The Type-Safe `useLocalStorage` Hook

I ran into this issue when I was building a dark mode toggle and a persistent user-settings sidebar. I needed a way to sync state with `localStorage` without manually writing `JSON.parse` and `JSON.stringify` every single time.

Here’s a practical implementation of a type-safe hook I use across my projects:

```typescript
import { useState, useEffect } from 'react';

// We use a generic <T> so the hook knows exactly what data it's handling
function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const; 
  // 'as const' is huge here—it tells TS this is a tuple, not an array of strings/functions
}

export default useLocalStorage;
```

### Thinking about Performance and UI

When I’m building these, I’m not just thinking about the logic. I care about the UI flickers. 

In that same inventory project, we had a hook that synced state across tabs. If you don't use `useEffect` properly or forget to clean up event listeners, your performance will tank. In the hook above, I usually add an event listener for the `storage` event. This way, if a user changes a setting in one tab, the other tab updates instantly. It’s that small attention to detail that makes an app feel "premium."

Also, notice the `as const` at the end of the return statement. Without it, TypeScript thinks your return value is `(T | ((val: T) => void))[]`, which is a nightmare to destructure. Using `as const` makes it behave exactly like `useState`.

### Clean Code: Don't Over-Engineer

One mistake I see senior engineers make is trying to make one hook do *everything*. 

I once tried to build a "God Hook" that handled fetching, caching, and local storage all in one. It was 300 lines long and impossible to test. To be honest, it was a mess. 

What I do now is **Compose Hooks**. 
- One hook for the API call (`useApi`)
- One hook for the storage (`useLocalStorage`)
- A third "Feature Hook" that combines them. 

Keep your logic pieces small. It makes debugging much easier when things inevitably break.

### Best Practices I Swear By

*   **Return Objects for 3+ values:** If your hook returns more than two things (like `data`, `loading`, `error`, `refetch`), return an object `{}` instead of an array `[]`. It makes it easier to add more returns later without breaking the order.
*   **Handle SSR:** If you're using Next.js like I do, always check `if (typeof window !== 'undefined')`. Your server will thank you.
*   **Infer, don't just declare:** Let TypeScript infer as much as possible, but use explicit types for your hook's arguments.

### Final Thoughts

Building hooks isn't about being clever; it's about being helpful. A good custom hook should feel like a built-in part of React. It should be so easy to use that your teammates don't even need to look at the source code to understand how to implement it.

I've found that spending an extra 10 minutes getting the types right saves hours of debugging "undefined is not an object" errors later on.

What’s a hook you’ve built recently that saved you a bunch of time? Let me know, I'm always looking to refine my workflow.

Catch you in the next one,
**Prashuk**

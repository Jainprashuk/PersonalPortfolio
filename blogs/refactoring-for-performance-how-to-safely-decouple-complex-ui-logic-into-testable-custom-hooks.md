---
title: Refactoring for Performance: How to Safely Decouple Complex UI Logic into Testable Custom Hooks
date: 2026-05-17T07:34:54.235Z
description: Blog about Refactoring for Performance: How to Safely Decouple Complex UI Logic into Testable Custom Hooks
---

Hey everyone, I’m Prashuk. 

If you’re anything like me, you love the feeling of shipping a feature fast. But we’ve all been there—three months later, you open that same component to fix a bug, and you’re greeted by a 700-line monster. It’s got three `useEffects`, five state variables, and logic for data fetching, filtering, and UI toggles all mashed together.

I’ve learned the hard way that "working code" isn't always "good code." Today I want to talk about how I handle complex UI logic by moving it into custom hooks. It’s not just about "cleaning up"; it’s about making your app actually perform better and saving your future self from a massive headache.

### The "Component Bloat" Reality Check

I ran into this issue when I was building a real-time analytics dashboard for a client. The main table component was doing everything: it fetched the data, formatted the timestamps, calculated the percentage growth, and handled the pagination. 

Every time I changed a simple CSS class, the entire calculation logic would re-run. The UI felt sluggish, and honestly, the code was a nightmare to read. 

What I’ve realized is that **UI components should be about the "How it looks," not the "How it works."** When you mix the two, your performance usually takes a hit because React has to track too many dependencies in one place.

### Why Decoupling is a Performance Win

What worked for me was a simple rule: **If it’s a calculation, a data filter, or a complex state transition, it doesn't belong in the JSX file.**

When you move logic into a custom hook, you gain two major performance advantages:
1.  **Selective Re-renders:** You can use `useMemo` and `useCallback` inside the hook more effectively without cluttering the component.
2.  **Logic Isolation:** You can update the logic without the risk of accidentally triggering UI-heavy side effects.

In that dashboard project, once I moved the filtering logic into a `useAnalyticsData` hook, the table felt instant. The UI only had to worry about mapping over an array, while the hook handled the heavy lifting in the background.

### Real-World Example: The "Searchable List"

Let’s look at a practical example. Instead of having all the search and filter logic inside your component, move it out. 

**Before (The Messy Way):**
Most people just dump `useState` and `useEffect` right at the top of the component. It looks okay at first, but it scales poorly.

**The "Prashuk Way" (Custom Hook):**
I like to create a separate file for the logic. It keeps the main component clean and readable.

```javascript
// useProductFilter.js (The Logic)
import { useState, useMemo } from 'react';

export const useProductFilter = (initialProducts) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, initialProducts]);

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts
  };
};

// ProductList.jsx (The UI)
const ProductList = ({ products }) => {
  const { searchQuery, setSearchQuery, filteredProducts } = useProductFilter(products);

  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Search products..." 
      />
      {filteredProducts.map(p => <ProductCard key={p.id} data={p} />)}
    </div>
  );
};
```

### Making Logic Actually Testable

One of my biggest pet peeves is trying to test UI components that are bloated with logic. You end up having to mock the entire DOM just to see if a sorting function works.

By moving logic to a hook, you can test the "brain" of your component in isolation. In one of my MERN projects, I had a complex multi-step form. Instead of testing the form buttons and inputs, I just tested the `useFormManager` hook. 

I could verify that "Step 2" only opened if "Step 1" was valid, without ever rendering a single `<input>` tag. That’s a huge win for reliability.

### My Best Practices for Hooks

If you're going to start refactoring, here’s what I usually stick to:

*   **Keep hooks focused:** Don't create a `useEverything`. If a hook handles both User Auth and Theme switching, split it up.
*   **Return an object, not an array:** Using `return { data, loading }` is better than `return [data, loading]` because you don't have to remember the order when importing.
*   **Don't over-abstract:** If the logic is only two lines of code, you probably don't need a custom hook. Use your judgment.
*   **UI stays "Dumb":** Aim for your UI components to have almost zero `useEffect` calls.

### Conclusion

At the end of the day, clean code is about making things manageable. In my experience, taking 20 minutes to decouple your logic into a custom hook saves you 5 hours of debugging down the road. 

Your UI will be snappier, your tests will be easier to write, and your codebase won't look like a bowl of spaghetti. 

What’s the messiest component you’ve ever worked on? I’d love to hear how you handled it—or if you’re still avoiding refactoring it! Catch you in the next one.

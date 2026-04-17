---
title: Optimizing Core Web Vitals: A Deep Dive into Next.js App Router Performance
date: 2026-04-17T06:59:07.902Z
description: Blog about Optimizing Core Web Vitals: A Deep Dive into Next.js App Router Performance
---

Hey everyone, I’m Prashuk. I’ve spent the last few years building stuff with the MERN stack and lately, I’ve been living and breathing Next.js. 

I’m not a fan of theoretical "best practices" that don’t work in the real world. I like things that actually move the needle on a PageSpeed Insights report. If you’ve ever moved a project to the Next.js App Router and wondered why your Core Web Vitals are still in the red, this one's for you.

### 1. The LCP Struggle: It’s Always the Hero Image
We’ve all been there. You build a beautiful landing page, run a Lighthouse test, and your Largest Contentful Paint (LCP) is sitting at 4 seconds. 

In one of my recent projects—a real estate platform—I ran into this issue when we had these massive, high-res property images at the top of the page. Even with `next/image`, the LCP was terrible. 

What worked for me was being aggressive with the `priority` attribute. I used to think `next/image` handled everything automatically, but it doesn't know what’s above the fold. 

**My rule of thumb:** If it's the first thing the user sees, add `priority`. Also, use the `sizes` attribute. If you don't define `sizes`, Next.js defaults to 100vw, which means it might serve a 2000px image to a mobile phone. That’s just a waste of bandwidth.

### 2. Fixing CLS (Layout Shift) is Just Good Manners
There is nothing more annoying than trying to click a button and having the page jump because an ad or a slow-loading image finally popped in. 

I had a mess on a dashboard project where I was fetching user data on the client side. The "Welcome, Prashuk" text would load late, pushing the entire navigation bar down by 20 pixels. It was a tiny shift, but it killed our Cumulative Layout Shift (CLS) score.

The fix was simple: **Skeletons.** But not just any skeleton—a skeleton that exactly matches the height of the final rendered content. If your font size is 24px with a 1.5 line height, your skeleton needs to be 36px tall. 

### 3. Fighting the "Too Much JavaScript" Battle
The App Router is great because it defaults to Server Components. But the moment you add `"use client"`, you’re sending JS to the browser.

I’ve seen devs (and I’m guilty of this too) wrap their entire layout in a huge Context Provider or a "Theme Wrapper" that makes everything a Client Component. Suddenly, you’re back to square one with a heavy bundle.

What I do now is "push the client down." If only a button needs to be interactive, only that button should be a Client Component. Keep the heavy data-fetching logic on the server. Your TBT (Total Blocking Time) will thank you.

### 4. INP: The New Boss in Town
Interaction to Next Paint (INP) is the new metric everyone's sweating over. It’s basically about how snappy your site feels when someone clicks something.

I ran into a performance bottleneck when building a complex filter for an e-commerce site. Every time someone clicked a checkbox, the whole list would re-render, and the UI would freeze for half a second.

To fix this, I used `useTransition`. It lets you mark a state update as non-urgent, so the UI stays responsive while the heavy filtering happens in the background.

```tsx
// How I handled heavy filtering without freezing the UI
import { useState, useTransition } from 'react';

function FilterComponent({ items }) {
  const [isPending, startTransition] = useTransition();
  const [filteredItems, setFilteredItems] = useState(items);

  const handleFilter = (category) => {
    // This keeps the UI responsive (checkbox clicks immediately)
    startTransition(() => {
      const result = items.filter(item => item.category === category);
      setFilteredItems(result);
    });
  };

  return (
    <div>
      <input type="checkbox" onChange={() => handleFilter('electronics')} />
      {isPending && <p>Updating list...</p>}
      {/* render list */}
    </div>
  );
}
```

### 5. Font Optimization is Underestimated
Fonts are often the silent killer of performance. I used to just import Google Fonts in my CSS and call it a day. Then I realized it was causing major "Flash of Unstyled Text" (FOUT).

In the App Router, `next/font` is a lifesaver. It self-hosts the fonts and handles the display swapping. 

**Pro tip:** Always use a fallback font that looks somewhat similar to your main font. It prevents the page from jumping around when the custom font finally kicks in.

---

### My Practical Checklist for Better Performance:

*   **Images:** Use `priority` for anything above the fold and always set a `sizes` attribute.
*   **Dynamic Imports:** If you have a heavy library (like a chart or a map) that’s below the fold, use `next/dynamic` to lazy load it.
*   **Server Components:** Keep 90% of your logic in Server Components. Only use "use client" for interactivity.
*   **Streaming:** Use `loading.tsx` files. It’s better to show a partial page immediately than a blank screen for 2 seconds.
*   **Prefetching:** Next.js `<Link>` tags prefetch pages by default, which is great, but if you have 50 links on a page, it can actually slow things down. Sometimes it's better to set `prefetch={false}` for less important links.

### Wrapping Up
At the end of the day, performance isn't about chasing a 100/100 score just for the sake of it. It’s about the person using your app not getting frustrated because the UI is jumping around or the page is taking forever to respond.

The App Router gives us a lot of tools for free, but you still have to be intentional about how you build. Start small—fix your images, use skeletons, and stop shipping unnecessary JS. You'll see the difference.

Let me know if you’ve run into any weird performance issues in Next.js—I'd love to hear how you fixed them!

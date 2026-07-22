---
title: Mastering React Server Components: A Guide to Reducing Client-Side Bundle Size in Next.js
date: 2026-07-22T07:36:52.219Z
description: Blog about Mastering React Server Components: A Guide to Reducing Client-Side Bundle Size in Next.js
---

Hey everyone, I’m Prashuk. If you’ve been following my work, you know I’m obsessed with performance. I don't just mean "it feels fast" performance; I mean the kind where you open the network tab and actually see a tiny bundle size.

For a long time, React apps had this massive problem: the more features we added, the more JavaScript we shipped to the user. It was a losing battle. But then React Server Components (RSC) came along with Next.js, and honestly, it changed how I architect everything.

Here’s a breakdown of how I use RSCs to keep my apps lean, based on what I’ve actually built.

### 1. The "Aha!" Moment with Bundle Sizes
In one of my projects—a heavy content dashboard—I noticed our Lighthouse score was tanking. The Total Blocking Time (TBT) was through the roof. When I dug into the bundle, I realized we were shipping 80KB of data-fetching libraries and Markdown parsers to the client just to show a static article.

That’s when it clicked. Why send the "parser" to the user if the server can just send the final HTML? With RSCs, you can keep the heavy libraries on the server. The user gets the result, not the tools used to make it.

### 2. The Habit of "Use Client" (And how to break it)
I ran into this issue when I first transitioned to the Next.js App Router. I was so used to `useState` and `useEffect` that I’d reflexively type `'use client'` at the top of every file. 

What worked for me was a simple rule: **Default to Server.** 
I start every component as a Server Component. I only add `'use client'` when I absolutely need an event listener (like `onClick`) or a hook. If a component is just displaying data fetched from a database, it has no business being a Client Component.

### 3. Move the Logic, Not the Library
In a recent project, I had to format a lot of complex dates and currencies. Usually, I’d pull in `date-fns` or a similar library. 

Instead of importing that library into a Client Component (where the user has to download it), I did all the formatting inside a Server Component. 

*   **Old way:** Send raw date + `date-fns` library → Client formats it.
*   **New way:** Server formats date → Send simple string "2 hours ago" to Client.

The user gets the same UI, but their browser does zero work.

### 4. Practical Implementation: The Product List
Here’s a real-world example. Imagine a product page. You want to fetch data and have a "Favorite" button. 

```tsx
// ProductCard.tsx (Server Component by default)
import { formatCurrency } from '@/lib/utils';
import FavoriteButton from './FavoriteButton';

export default async function ProductCard({ productId }) {
  // This fetch happens on the server. No 'useEffect' needed.
  const product = await db.product.findUnique({ where: { id: productId } });

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <h2 className="text-xl font-bold">{product.name}</h2>
      
      {/* 
         We format the price here on the server. 
         The client never sees the formatting logic.
      */}
      <p>{formatCurrency(product.price)}</p>

      {/* 
         Only this tiny button is a Client Component 
         because it needs interactivity.
      */}
      <FavoriteButton productId={product.id} />
    </div>
  );
}
```

By nesting the `FavoriteButton` (Client) inside the `ProductCard` (Server), I’ve kept 90% of the code off the client’s main thread.

### 5. My Best Practices for RSCs
If you want to keep your code clean and your UI snappy, keep these in mind:

*   **Fetch data where you use it:** Don't pass data through five layers of props. If a component needs data, let it fetch it. Next.js handles the memoization so you won't hit your DB twice for the same call.
*   **Keep Client Components at the leaves:** Think of your component tree like a tree. Keep the "Server" stuff in the trunk and branches, and push the "Client" interactivity out to the leaves (buttons, inputs, toggles).
*   **UI over Theory:** Don't get bogged down in the "correct" way to do things. If moving a component to the server makes the UI laggy because of a slow network, maybe a client-side skeleton is better. Practicality wins.

### Conclusion
Transitioning to React Server Components isn't just about a new API; it’s a shift in mindset. You start thinking about the user’s device as a precious resource that shouldn't be wasted on heavy JS.

The biggest thing I learned? **Less code on the client = fewer bugs for the user.** When there's less JavaScript running in the browser, there's less that can go wrong with different browser versions or slow CPUs.

Keep it simple, keep it on the server when you can, and your users will thank you for the speed. 

Catch you in the next one!
— **Prashuk**

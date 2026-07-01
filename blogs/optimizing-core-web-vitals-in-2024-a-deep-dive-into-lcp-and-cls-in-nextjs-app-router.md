---
title: Optimizing Core Web Vitals in 2024: A Deep Dive into LCP and CLS in Next.js App Router
date: 2026-07-01T08:53:05.915Z
description: Blog about Optimizing Core Web Vitals in 2024: A Deep Dive into LCP and CLS in Next.js App Router
---

Hey everyone, I’m Prashuk. 

If you’re building with Next.js right now, you know the App Router is a beast, but it’s a double-edged sword. On one hand, you get server components out of the box; on the other, if you aren't careful, your Core Web Vitals (CWV) can tank faster than you can say "npm run build."

I’ve spent the last few months obsessed with performance—mostly because I hate seeing a red score on PageSpeed Insights. For me, it’s not about the theory; it’s about making sure the user doesn't see a jumpy UI or wait three seconds for a hero image to load.

Here’s how I’ve been tackling LCP and CLS in my recent projects.

### 1. The LCP Image Trap
Largest Contentful Paint (LCP) is almost always about your hero image. In one of my recent projects—a landing page for a client—I was scratching my head because my LCP was sitting at 3.2s. I was using the `next/image` component, so I thought I was safe.

**I ran into this issue when** I realized that even though Next.js optimizes the image, it doesn't know *when* to prioritize it. By default, images are lazy-loaded. 

**What worked for me was** being aggressive with the `priority` attribute. If an image is above the fold, it gets `priority`. Period. Also, I started using `fetchPriority="high"` on the underlying tag. It tells the browser, "Hey, don't wait for other scripts; get this image now."

### 2. Fixing the "Jumpy" UI (CLS)
Cumulative Layout Shift (CLS) is my biggest pet peeve. There is nothing worse than trying to click a button and having it move 20 pixels down because a font or a banner loaded late.

I noticed a massive shift in a dashboard I was building. The culprit? Dynamic content loading inside a client component. 

To fix this, I stopped letting my containers be "auto" height. If I know a component is going to load a list of items, I give it a `min-height` or use a skeleton loader that matches the exact dimensions of the expected content. 

Another trick: **Stop using Google Fonts via standard CSS imports.** Use `next/font`. It automatically hosts the font files with your deployment, which means no layout shift while the fallback font swaps to the custom one.

### 3. Server Components vs. The Loading Spinner
In the App Router, we love `loading.js`, but it can actually hurt your LCP if you're not careful. If your entire page is wrapped in a heavy loading state, your LCP won't trigger until that spinner disappears.

Instead of a global `loading.js`, I’ve started using React `Suspense` around specific, heavy components. This way, the "Shell" of the page (the header, the hero text) loads instantly. The user gets a visual confirmation that the site is working, and the LCP happens much earlier.

### 4. Real-world Implementation: The Hero Section
Here is a quick look at how I structure a hero image now to ensure it’s performant. This isn't just "clean code"—it’s code that passes the field data.

```tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero-container">
      {/* 
         1. 'priority' for LCP 
         2. 'sizes' to prevent downloading a 3000px image on mobile
         3. aspect-ratio in CSS to prevent CLS
      */}
      <div className="relative w-full aspect-video md:aspect-[21/9]">
        <Image
          src="/hero-banner.jpg"
          alt="Our Project Launch"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
          placeholder="blur" 
          blurDataURL="data:image/jpeg;base64,..." // Low-res placeholder
        />
      </div>
      <h1>Building the future of the web.</h1>
    </section>
  );
}
```

### 5. Third-Party Scripts are Performance Killers
We all need analytics or chat widgets, but they are LCP killers. I had a project where a single tracking script was delaying the main thread for 1.5 seconds.

I shifted to using the `next/script` component with the `strategy="afterInteractive"` or even `lazyOnload`. Honestly, does your chatbot really need to be interactive the millisecond the page loads? Usually, no. Delaying it gives the browser room to breathe and finish the LCP-critical tasks first.

### My Learnings from the Trenches
After optimizing a dozen Next.js sites this year, here are my non-negotiables:

*   **Test on 4G throttling:** Everything looks fast on my MacBook Pro. It’s a different story on a mid-range Android phone.
*   **Keep CSS lean:** I’m a big fan of Tailwind because it keeps the bundle size small. Unused CSS is a hidden LCP drain.
*   **The 100ms Rule:** If a layout shift is more than 0.1, I treat it as a bug, not a "minor issue."

At the end of the day, users don't care about your tech stack. They care about how fast they can get what they came for. Optimization isn't a "one-and-done" task; it’s a habit.

What’s been your biggest headache with the App Router performance? Let’s chat in the comments.

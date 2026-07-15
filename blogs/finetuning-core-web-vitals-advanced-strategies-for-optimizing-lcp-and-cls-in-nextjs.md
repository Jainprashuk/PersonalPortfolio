---
title: Fine-Tuning Core Web Vitals: Advanced Strategies for Optimizing LCP and CLS in Next.js
date: 2026-07-15T07:17:48.370Z
description: Blog about Fine-Tuning Core Web Vitals: Advanced Strategies for Optimizing LCP and CLS in Next.js
---

Hey everyone, I’m Prashuk. 

If you’ve been building with Next.js for a while, you know the drill. You build a beautiful UI, everything looks perfect on your local machine, and then you run a Lighthouse report only to see a bunch of red numbers. Specifically, **LCP (Largest Contentful Paint)** and **CLS (Cumulative Layout Shift)** are usually the ones that keep developers up at night.

I’ve spent the last couple of years obsessing over performance in my own projects. To me, a slow site is a broken site, no matter how clean the code is. 

Here is how I actually handle Core Web Vitals in the real world, based on stuff I’ve actually broken and fixed.

### 1. The "Hero Image" Trap (Fixing LCP)

In one of my recent projects—a high-traffic e-commerce storefront—the LCP was sitting at around 4.2 seconds. That’s bad. Most of it was because of the hero banner.

The mistake I made (and I see a lot of people make) was relying on default lazy loading for everything. In Next.js, the `next/image` component is amazing, but you shouldn't lazy load the image that’s supposed to appear first.

**What worked for me:** 
I used the `priority` attribute on the main hero image. This tells Next.js to preload that specific image. Also, I realized that using a `.png` for a big banner was a mistake. I switched to `.webp` (which Next.js handles automatically) and used the `sizes` prop to make sure we weren't sending a 3000px image to a mobile phone.

### 2. Stop the Jiggle (Handling CLS)

Nothing kills user experience faster than a button that moves right as you’re about to click it. I ran into this issue when I was building a dashboard that fetched user data on the client side. The data would load, a "Welcome" message would pop in, and the entire layout would jump down 50 pixels.

**Real-world fix:**
I stopped using "conditional rendering without placeholders." If you know a piece of content is going to load, you *must* reserve the space for it. 

I started using **Aspect Ratio boxes** and **Skeletons**. If you have an image or a dynamic component, wrap it in a div with a fixed height or a minimum height.

```tsx
// Simple way I handle image containers to prevent CLS
<div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
  <Image 
    src="/hero.webp"
    alt="Project Banner"
    fill
    priority
    className="object-cover"
  />
</div>
```
By setting `aspect-video` (or a specific height), the browser knows exactly how much space to keep empty until the image loads. No more jumping.

### 3. The Font Fiasco

I used to just import Google Fonts in a CSS file and call it a day. But that often causes a "flash of unstyled text" (FOUT), which triggers a layout shift.

In Next.js, we have `next/font`. It’s probably the most underrated tool in the framework. It automatically hosts the font files with your deployment, so there’s no extra DNS lookup to Google’s servers.

**My preference:**
I always use `display: 'swap'`. It shows a system font first and then swaps to the custom font. To make it even better, you can tweak the `adjustFontFallback` settings so the system font takes up the exact same space as your custom font. It sounds like overkill, but it makes the loading feel instant.

### 4. Third-Party Scripts are Performance Killers

I worked on a landing page where the LCP was great, but the **TBT (Total Blocking Time)** was trash. Turns out, the marketing team had added four different tracking pixels and a heavy chatbot widget.

**What I did:**
I moved all non-critical scripts to the `next/script` component using the `strategy="lazyOnload"` or `strategy="worker"`. 

Honestly, if a script doesn’t need to run the second the page loads (like a chatbot), don't let it. Load it after the main thread is free. This drastically improved the "snappiness" of the site.

### Best Practices (The TL;DR Version)

*   **Priority Images:** Always add `priority` to the largest image above the fold.
*   **Dimensions Matter:** Never render an image or a video without a wrapper that has a defined aspect ratio or height.
*   **Next/Font:** Stop using standard CSS @import for fonts. Use the built-in Next.js font optimization.
*   **Dynamic Imports:** For heavy components (like a complex map or a chart), use `dynamic()` from `next/dynamic` to load them only when needed.

### Conclusion

At the end of the day, Core Web Vitals aren't just about pleasing Google's bots. It's about making sure the person using your app doesn't get frustrated and leave. 

The biggest thing I've learned is that **performance is a feature, not an afterthought.** You can't just "optimize" a messy app at the end. You have to think about image sizes and layout shifts while you're building the first component.

If you fix your hero images and stop your layout from jumping around, you’re already ahead of 80% of the sites out there.

Keep building!
— Prashuk

---
title: Optimizing Core Web Vitals: A Deep Dive into Next.js Image and Font Optimization Strategies
date: 2026-05-29T08:44:33.973Z
description: Blog about Optimizing Core Web Vitals: A Deep Dive into Next.js Image and Font Optimization Strategies
---

Hey everyone, I’m Prashuk. 

If you’re building with Next.js, you probably know that it promises "performance out of the box." But honestly? I’ve realized that if you aren't careful with how you handle images and fonts, your Core Web Vitals (CWV) will still look like a sea of red in Google Search Console.

I’m obsessed with clean UI, but a pretty UI that jumps around while loading is just bad UX. I’ve spent a lot of time lately tweaking my own projects to get those perfect 100/100 Lighthouse scores, and I wanted to share what actually works—without the fluff.

---

### 1. The "Hero Image" Nightmare (Fixing LCP)

In one of my recent client projects, a SaaS landing page, the Largest Contentful Paint (LCP) was hitting 4 seconds. That’s way too slow. 

The culprit? The hero image. By default, browsers don't prioritize images as much as we’d like. I ran into this issue where the image would only start loading after the main JS bundle was parsed.

**What worked for me was the `priority` prop.**

When you add `priority` to your `next/image`, it tells Next.js to treat that image as a high-priority fetch. It adds a preload tag to the document head. 

**My rule of thumb:** If the image is "above the fold" (visible without scrolling), it gets the `priority` tag. If it's below, I let it lazy load.

---

### 2. Layout Shifts are the Worst (Solving CLS)

Cumulative Layout Shift (CLS) is my biggest pet peeve. You’re about to click a button, and suddenly a font or image loads, the button moves, and you click an ad instead.

I used to use standard CSS `@import` for Google Fonts. Big mistake. The browser would render a fallback font (like Arial), then "snap" to the custom font once it downloaded. This caused a massive layout jump.

Next.js 13+ introduced `next/font`, and honestly, it’s a game changer. It automatically self-hosts the fonts and uses the `size-adjust` property under the hood so the fallback font takes up the exact same space as the custom one. No more jumping.

---

### 3. Stop Guessing Image Dimensions

Another thing that used to trip me up was handling dynamic images where I didn't know the aspect ratio. If you don't define a height and width, the browser has no idea how much space to reserve, leading to—you guessed it—more CLS.

What I do now is use a wrapper div with an aspect ratio and set the image to `fill`.

```tsx
// This is my go-to pattern for clean, responsive images
import Image from 'next/image';

const ProductCard = ({ src, alt }) => {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        placeholder="blur"
        blurDataURL="data:image/png;base64,..." // I use a tiny base64 for better UI
      />
    </div>
  );
};
```

*Note: Always use the `sizes` prop. If you don't, Next.js serves a full-sized image to mobile users, which kills your performance.*

---

### 4. Local Fonts vs. Google Fonts

I have a bit of a hot take here: **Stop using 5 different font weights.** 

Each weight is a separate file. In a project I worked on last month, I realized we were loading Regular, Medium, Semi-Bold, Bold, and Extra-Bold. That’s almost 500kb of just font data. 

I switched to a **Variable Font** version of Inter using `next/font/google`. It’s one single file that handles every weight. It dropped my load time significantly. If you can use a variable font, do it. Your performance score will thank you.

---

### 5. My Practical Checklist

Before I push any Next.js project to production, I run through this mental checklist:

*   **Images:** Does every "above the fold" image have `priority`?
*   **Images:** Am I using `placeholder="blur"` to make the loading feel faster? (Perceived performance is just as important as actual performance).
*   **Fonts:** Am I using `next/font`? Did I limit the weights to only what I actually use?
*   **SVGs:** For icons, am I inlining small SVGs or using a dedicated icon library that supports tree-shaking?

---

### Conclusion

Optimizing for Core Web Vitals isn't about some secret "hacker" trick. It’s mostly about being disciplined with how you handle assets. Next.js gives us the tools, but we still have to use them correctly. 

The biggest thing I've learned? **Don't trust the dev environment.** Everything looks fast on `localhost`. Always run a production build and test it using PageSpeed Insights or the Chrome DevTools "Lighthouse" tab.

What’s the biggest performance headache you’ve run into lately? I’d love to hear how you solved it.

Keep coding,
**Prashuk**

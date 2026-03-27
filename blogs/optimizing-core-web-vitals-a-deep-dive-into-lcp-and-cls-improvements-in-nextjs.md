---
title: Optimizing Core Web Vitals: A Deep Dive into LCP and CLS Improvements in Next.js
date: 2026-03-27T06:14:47.016Z
description: Blog about Optimizing Core Web Vitals: A Deep Dive into LCP and CLS Improvements in Next.js
---

Hey everyone, I’m Prashuk Jain. I spend most of my time building things with React and the MERN stack. 

If you're like me, you probably don't care much about the complex jargon behind Google's algorithms. But you *do* care when your site feels sluggish or when a button jumps right as you’re about to click it. That’s essentially what Core Web Vitals (CWV) are all about—making sure the site feels solid and fast for the user.

In my recent projects, I’ve spent a lot of time obsessing over Lighthouse scores, not just for the green circles, but because I’ve seen firsthand how a slow LCP or a jumpy CLS can kill conversion rates.

Here is how I actually handle these in Next.js.

### 1. Fixing LCP: It’s usually just your Hero Image
Largest Contentful Paint (LCP) is basically: "How long does it take for the biggest thing on the screen to show up?" 

**I ran into this issue when** I was building a portfolio site. I had this high-res hero image that looked great, but the LCP was sitting at 4 seconds. Lighthouse was screaming at me.

**What worked for me was** using the `priority` property in the Next.js `Image` component. Most people forget this. By default, Next.js lazy-loads images. But you *don't* want to lazy-load your hero image. You want the browser to grab it immediately.

```javascript
// Don't just do this for your hero
<Image src="/hero.jpg" alt="Banner" width={1200} height={600} />

// Do this instead
<Image 
  src="/hero.jpg" 
  alt="Banner" 
  width={1200} 
  height={600} 
  priority 
  fetchPriority="high"
/>
```

Adding `priority` tells Next.js to preload that specific image. In that portfolio project, my LCP dropped from 4s to 1.2s just with this one change.

### 2. CLS: Stop the "Jumping" UI
Cumulative Layout Shift (CLS) is my biggest pet peeve. You know when you're about to click a link, and an ad or a slow-loading image pops in, pushing the link down, and you end up clicking the wrong thing? That's bad CLS.

**In one of my projects**, I had a dynamic alert banner at the top of the homepage that fetched data from an API. Because the banner didn't have a defined height, the entire page would "jump" down by 50px once the data arrived.

**The fix?** Always reserve the space. Even if the content is dynamic, wrap it in a div with a min-height. 

*   **Pro-tip:** Use the `aspect-ratio` CSS property for image containers. It ensures the browser knows exactly how much space to leave before the image even starts downloading.

### 3. Fonts are silent performance killers
We all love custom Google Fonts, but they are notorious for causing layout shifts (FOUT - Flash of Unstyled Text).

Next.js has `next/font`, and honestly, it’s a lifesaver. It automatically self-hosts your fonts and uses zero external network requests.

When I started using `next/font/google`, I stopped seeing that annoying flicker where the font changes from Times New Roman to Inter after two seconds. It’s built-in, it’s easy, and there’s no reason not to use it.

### 4. Handling Third-Party Scripts
We all need analytics, chatbots, and pixel trackers. But these scripts are heavy.

**What I've noticed is** that developers often dump these scripts in the `<Head>` of `_document.js` or `layout.js`, which blocks the main thread. 

Use the `next/script` component with the right strategy:
- `afterInteractive`: For things you need soon (Analytics).
- `lazyOnload`: For things that aren't urgent (Chat widgets).

I once moved a heavy HubSpot chat script to `lazyOnload`, and the "Time to Interactive" score improved instantly because the browser wasn't trying to load a massive chat UI while the main page was still rendering.

### My Practical Checklist for Next.js Optimization

If you're looking to clean up your site today, here is my "low-hanging fruit" list:

*   **Audit your images:** If it's above the fold, use `priority`. If it's below, let Next.js lazy-load it.
*   **Set Heights/Widths:** Never leave an image or a dynamic container without dimensions.
*   **Use `next/font`:** Stop linking to external CSS files for fonts.
*   **Check your Third-party scripts:** Move anything non-essential to `lazyOnload`.
*   **Dynamic Imports:** For heavy components (like a heavy Chart library or a Modal), use `next/dynamic` so they only load when needed.

### Wrapping Up
At the end of the day, performance isn't about some secret hack. It's about being mindful of what you're asking the user's browser to do. 

Next.js gives us amazing tools out of the box, but we still have to use them correctly. Start by fixing your Hero image and your layout shifts—your users (and your SEO) will thank you for it.

What’s the biggest performance bottleneck you’ve run into? I’d love to hear how you solved it. 

Catch you in the next one,
**Prashuk**

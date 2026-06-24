---
title: Solving Cumulative Layout Shift (CLS): Best Practices for Responsive Images in Tailwind CSS
date: 2026-06-24T08:25:04.803Z
description: Blog about Solving Cumulative Layout Shift (CLS): Best Practices for Responsive Images in Tailwind CSS
---

Hey everyone, I’m Prashuk Jain. I spend most of my days deep in the MERN stack, usually tweaking React components or messing around with Next.js configurations. 

I’m a big believer that a website shouldn't just work—it should feel smooth. There’s nothing that kills the user experience faster than a page that "jumps" while it's loading. We've all seen it: you're about to click a button, an image finally loads, pushes the button down, and you end up clicking an ad or the wrong link. 

That’s Cumulative Layout Shift (CLS) in action, and honestly, it’s one of my biggest pet peeves as a developer.

### Why does this happen?

The problem is usually pretty simple: the browser doesn't know how much space to reserve for an image before it actually downloads. By default, an `<img>` tag without dimensions starts at 0x0 pixels. Once the bytes fly in, the browser goes, "Oh, this is 800px tall," and pushes everything else down.

I ran into this issue heavily when I was building a photography portfolio for a client last year. I used Tailwind’s `w-full h-auto` classes thinking I was being "modern" and responsive. On a fast fiber connection, it looked fine. But when I throttled my network to 3G for testing, the whole site looked like it was dancing for five seconds. It was a mess.

### What worked for me: Aspect Ratio

The game-changer for me was when Tailwind finally introduced the `aspect-ratio` utility. Before that, we had to do some weird "padding-bottom" hacks that felt really dirty to write.

Now, instead of letting the image dictate the height, I tell the container exactly what to expect. In that same portfolio project, I switched to using aspect ratio boxes. Even if the image takes 3 seconds to load, the space is already there. No jumping.

### The Real-World Implementation

One thing I’ve learned is that you should still use the `width` and `height` attributes on your `<img>` tags, even if you are using Tailwind to make them responsive. Modern browsers use these attributes to calculate the aspect ratio before the image even starts downloading.

Here’s a pattern I use now in almost all my Next.js and React projects using Tailwind:

```jsx
{/* This is a common pattern for a blog post header image */}
<div className="w-full max-w-3xl mx-auto overflow-hidden rounded-xl bg-gray-100">
  <img
    src="/project-hero.jpg"
    alt="My Project UI"
    width="800"
    height="450"
    className="w-full aspect-video object-cover"
    loading="lazy"
  />
</div>
```

By adding `aspect-video` (which is `16/9`), I’m telling the browser exactly what the footprint of that image will be. The `bg-gray-100` is a nice little touch too—it acts as a placeholder "skeleton" so the user sees a grey box instead of empty white space.

### Why not just use Next.js Image?

Don't get me wrong, the Next.js `Image` component is amazing and handles a lot of this for you. But I’ve found that in some custom MERN projects or when I'm pulling dynamic content from a messy CMS where I can't guarantee image sizes, I need to handle it manually with Tailwind.

Also, sometimes you just want a standard `img` tag for simplicity or for specific lightboxes that don't play well with the Next.js wrapper. In those cases, the combination of `aspect-ratio` and the `width/height` attributes is your best friend.

### Best Practices I follow now:

*   **Never use `h-auto` alone:** If you don't define a height or an aspect ratio, you're asking for a layout shift.
*   **Use placeholders:** A simple background color on the parent div makes the loading state feel intentional, not like a bug.
*   **Set explicit attributes:** Always put `width` and `height` on the tag. Tailwind will still resize it because of `w-full`, but the browser will thank you for the hint.
*   **Check your DevTools:** I always open the "Performance" tab in Chrome and look for the "Experience" row. It’ll highlight exactly which elements are shifting.

### Final Thoughts

Fixing CLS isn't about some high-level architectural theory; it’s just about being considerate of the browser’s job. My biggest learning from my past projects is that "responsive" doesn't mean "fluid until it loads." It means "stable at every size."

Clean code isn't just about how it looks in VS Code—it’s about how it behaves in the user's hand. Give your images a dedicated space to live in, and your UI will feel 10x more professional.

Anyway, hope this helps you avoid the "jumping UI" trap. Catch you in the next one!

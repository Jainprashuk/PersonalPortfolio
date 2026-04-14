---
title: Scaling Tailwind CSS: Architecting a Maintainable Design System in Large-Scale React Monorepos
date: 2026-04-14T06:54:25.222Z
description: Blog about Scaling Tailwind CSS: Architecting a Maintainable Design System in Large-Scale React Monorepos
---

Hey, I’m Prashuk. If you’ve been following my work, you know I’m a big fan of the MERN stack and anything React-related. I’m all about building stuff that actually works in production, not just things that look good in a tutorial.

Tailwind CSS is usually my go-to. It’s fast, and it stops me from writing 5,000 lines of messy CSS files. But honestly? When you move from a small side project to a massive monorepo—maybe you’re using Turborepo or Nx—Tailwind can become a bit of a nightmare if you don't architect it right from day one.

I’ve spent the last few months figuring out how to keep a design system consistent across multiple apps without losing my mind. Here’s what I’ve learned.

### 1. Stop Copy-Pasting Your Config
In one of my projects, we had a dashboard, a landing page, and a mobile-web app all in one monorepo. Initially, I did the lazy thing: I just copied the `tailwind.config.js` into every folder. 

Bad idea. Two weeks later, the designer changed the "Brand Blue," and I had to hunt down three different files to update hex codes. 

What worked for me was creating a `packages/tailwind-config` package. Now, I define my theme, colors, and fonts in one place and export it as a preset. 

**The setup looks something like this:**

```javascript
// packages/tailwind-config/index.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
```

Then, in each app’s config, I just do: 
`presets: [require('@my-project/tailwind-config')]`. It’s clean and saves so much time.

### 2. The "Wall of Text" Problem (and how to fix it)
I ran into this issue when our `Button` component reached about 15 different variants (sizes, colors, loading states). The JSX looked like an absolute mess of strings. 

If you’re scaling, you have to stop using raw string concatenation for classes. I started using `cva` (Class Variance Authority). It’s a lifesaver for making UI components feel "professional" and readable.

It lets you define your UI states in a structured object. It’s much more intuitive for other devs on the team to see exactly what a "Large Primary" button looks like without decoding a 300-character string.

### 3. Shared UI Libraries vs. Local Components
One thing I see people struggle with is where to put the components. Should they be in the `apps/web` folder or a shared `packages/ui` folder?

Here’s my rule of thumb: If I’m going to use it in more than one place (like a Modal or an Input), it goes into the shared UI package. 

But there's a catch with Tailwind. You have to make sure your shared UI package's files are included in the `content` array of your main app's Tailwind config. If you forget this, Tailwind won't "see" those classes, and your shared components will look like plain HTML. I've spent hours debugging "missing styles" only to realize I forgot to point the scanner to my node_modules or workspace folders.

### 4. Handling Design Tokens
I’m big on UI and performance. To keep things snappy, I prefer using CSS variables inside the Tailwind config.

Instead of hardcoding `#FFFFFF`, I use `var(--background)`. This makes implementing Dark Mode a breeze. You don't have to add `dark:bg-slate-900` to every single div. You just change the value of the CSS variable at the root level. 

In a large-scale app, this is the only way to stay sane. It also keeps your bundle size smaller because you aren't generating twice as many utility classes for every color.

### Best Practices for the Long Haul
*   **Use Prettier Plugin:** If you aren't using `prettier-plugin-tailwindcss`, start now. It automatically sorts your classes. It sounds small, but it makes code reviews 10x easier.
*   **Limit your Palette:** Don't let every shade of gray into your config. Pick 5-6 and stick to them.
*   **Avoid `@apply`:** I know, I know. It’s tempting to use `@apply` to make "clean" CSS files. But in my experience, it just recreates the problems of traditional CSS. Stick to the utility classes in the TSX files—it makes debugging much faster.

### Wrapping Up
Scaling Tailwind isn't really about CSS; it's about folder structure and discipline. By moving your config to a shared package and using tools like `cva` for your components, you can keep a massive monorepo feeling as light and fast as a small side project.

What’s your biggest headache with Tailwind in big projects? Let me know, I’m curious if you’ve hit the same walls I have.

— Prashuk

---
title: Scaling Tailwind CSS: Architecting a Maintainable Design System for Enterprise Monorepos
date: 2026-03-22T12:50:55.736Z
description: Blog about Scaling Tailwind CSS: Architecting a Maintainable Design System for Enterprise Monorepos
---

Hey everyone, Prashuk here. 

If you’ve used Tailwind CSS for a side project or a single-page app, you know how fast it feels. You’re shipping UI at lightning speed. But things change when you're working on an enterprise-level monorepo—maybe you’ve got three different Next.js apps, a documentation site, and a shared UI library all living in one place.

I’ve seen plenty of teams struggle once the project grows. The `tailwind.config.js` starts looking like a 600-line monster, and suddenly, "text-primary" means three different shades of blue across different apps. 

In one of my recent projects, we hit a wall where the design system was so fragmented that fixing a button in the admin dashboard broke the landing page. It was a mess. 

Here’s how I’ve learned to architect Tailwind for the long haul.

### 1. The "Single Source of Truth" Problem
I ran into this issue when we had multiple teams working on different parts of a monorepo. Team A created a `colors.ts` file, and Team B just hardcoded hex codes into their Tailwind config. 

What worked for me was creating a dedicated `packages/design-tokens` or `packages/tailwind-config` workspace. 

Instead of duplicating your theme everywhere, you export a base configuration. This way, your brand colors, spacing scales, and typography are defined once. If the brand guy says "we're moving from Indigo to Violet," you change it in one file, and the whole monorepo updates.

### 2. Leveraging Tailwind Presets
Most people don't use Tailwind `presets`, and honestly, they’re missing out. 

Instead of having a massive config file in every app, I create a base config and then use the `presets` array to pull it in. 

```javascript
// packages/tailwind-config/index.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          900: '#1e293b',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}

// apps/web-app/tailwind.config.js
module.exports = {
  presets: [require('@repo/tailwind-config')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}', // Important for monorepos!
  ],
}
```

This keeps your app-level configs clean. You can still override specific things in the app config if you really need to, but the core "bones" stay the same.

### 3. The "Content" Path Trap
This is the #1 reason why styles disappear in monorepos. I spent two hours debugging why my shared button component had no styles, only to realize my Tailwind `content` array wasn't looking inside the `node_modules` or the shared `packages` folder.

In a monorepo, Tailwind needs to know exactly which files to scan for class names. If you’re using a shared UI package, you **must** include the path to that package in your app's `tailwind.config.js`. If you don't, Tailwind's JIT engine will just purge all those classes, leaving your components naked.

### 4. Stop Overusing @apply
I’m going to be a bit opinionated here: Stop using `@apply` for everything. 

In my early days, I tried to make Tailwind look like "clean CSS" by moving everything into `@apply` blocks in a CSS file. It’s a trap. You lose the ability to see exactly what a component looks like by looking at the HTML, and you end up back in "CSS naming hell."

What I do now is keep the utility classes in the TSX files. If a component gets too messy, I break it down into smaller sub-components. The only time I use `@apply` now is for base typography (like setting default styles for `h1`, `h2`, etc.) or when I’m dealing with third-party libraries that I can’t easily style with props.

### 5. Managing Design System "Variants"
When building an enterprise design system, you’ll likely need complex components—buttons with 4 sizes, 3 variants, and "loading" states. 

Trying to manage these with just template literals is a nightmare. I always use `class-variance-authority` (CVA). It plays so well with Tailwind and TypeScript. It makes your UI code look clean and prevents the "string concatenation" mess that usually leads to bugs.

### Best Practices for the Long Term
- **Prefixing:** If you're injecting your Tailwind components into a legacy site that already has CSS, use a `prefix` (like `ui-`) in your config to avoid collisions.
- **Strict Linting:** Use the `prettier-plugin-tailwindcss`. It sounds small, but having all classes automatically sorted in the same order across the whole team saves so much mental energy during code reviews.
- **Dynamic Classes:** Never construct class names like `text-${color}-500`. Tailwind's scanner won't find them. Always use full class names.

### Conclusion
Scaling Tailwind isn't about writing more CSS; it's about architecting how that CSS is generated. By moving to a **preset-based system** and being disciplined with your **content paths**, you can keep a monorepo feeling snappy and maintainable.

The biggest learning for me? Don't over-engineer it too early. Start with a shared config, keep your utilities in your components, and only abstract when the duplication actually starts hurting.

Keep it simple, keep it fast. Catch you in the next one!

— Prashuk

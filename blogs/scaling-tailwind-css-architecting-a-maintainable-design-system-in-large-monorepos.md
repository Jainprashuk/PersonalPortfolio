---
title: Scaling Tailwind CSS: Architecting a Maintainable Design System in Large Monorepos
date: 2026-04-13T07:17:00.868Z
description: Blog about Scaling Tailwind CSS: Architecting a Maintainable Design System in Large Monorepos
---

Hey everyone, I’m Prashuk. 

If you’ve been following my work, you know I’m a huge fan of the MERN stack and Next.js. I love Tailwind CSS because it lets me build UIs incredibly fast. But let’s be honest—Tailwind is a dream when you’re building a single landing page, but it can quickly turn into a maintenance nightmare when you’re working in a massive monorepo with multiple apps and shared packages.

In one of my recent projects, we had three different Next.js apps and a shared UI library all sitting in a Turborepo. Early on, we didn't have a plan. Every app had its own `tailwind.config.js`, and before I knew it, the "primary blue" in App A was slightly different from App B. It was a mess.

Here’s how I actually solved it and how I approach architecting Tailwind for scale now.

### 1. The "Single Source of Truth" Config
The biggest mistake I see is copy-pasting your Tailwind config across different packages. I ran into this issue when we decided to update our brand colors. I had to hunt down five different files to change one hex code. Never again.

What worked for me was creating a dedicated workspace package called `@repo/tailwind-config`. This package exports a base configuration that every other app extends.

Instead of repeating yourself, your app’s config should look like this:

```javascript
// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Config = {
  content: [
    "./src/**/*.tsx",
    "../../packages/ui/src/**/*.tsx", // Important: Scan shared UI components
  ],
  presets: [sharedConfig], // This is where the magic happens
};

export default config;
```

### 2. Standardizing Design Tokens
I’m a stickler for clean code and UI consistency. If you let developers use arbitrary values like `bg-[#f3f3f3]`, your project will eventually look like a patchwork quilt.

In my projects, I strictly enforce the use of semantic tokens. Instead of just naming a color `blue-500`, we map it to `brand-primary`. This way, if the design team decides we’re a "purple brand" next month, I change it in one object in the shared config, and the entire monorepo updates.

### 3. The "Internal UI" Package Strategy
When you're scaling, you shouldn't be writing Tailwind classes directly in your feature components every time. I prefer building a core UI library (using Radix UI or Headless UI) inside the monorepo.

I use a combination of `class-variance-authority` (CVA) and `tailwind-merge`. I found that without `tailwind-merge`, overriding styles on shared components was a total coin toss because of how CSS specificity works in Tailwind. 

For example, a Button component should handle its own padding and colors, but allow the calling app to tweak the margins without breaking the base styles.

### 4. Managing Content Paths (The Silent Killer)
This is where most people trip up. In a monorepo, Tailwind needs to know *exactly* which files to scan to generate the CSS. If you forget to include your shared UI package path in the `content` array of your app's config, your shared components will have no styles. 

I’ve spent hours debugging "missing styles" only to realize I wasn't pointing to the right relative path in the monorepo. My rule of thumb: always use absolute paths or very specific relative patterns to avoid missing classes.

### 5. Performance and Bundle Size
UI performance matters to me. In large projects, your generated CSS file can get chunky if you're not careful. 

One thing I started doing was avoiding "heavy" plugins in the shared config unless every app actually needs them. If only one app needs the Typography plugin, I add it to that app's local config, not the shared preset. This keeps the CSS footprint small for the smaller apps in the repo.

### Best Practices for Your Workflow:
*   **Use a Prettier Plugin:** Seriously, use `prettier-plugin-tailwindcss`. It sorts your classes automatically. It sounds minor, but in a team of 5+, it makes PR reviews so much easier to read.
*   **Avoid @apply:** I know it feels cleaner to put things in CSS files, but it defeats the purpose of Tailwind. Stick to utility classes in the TSX. It makes debugging much faster.
*   **Sync with Design:** If you're using Figma, make sure your Tailwind theme keys match the Figma variable names. It saves so much back-and-forth.

### Conclusion
Scaling Tailwind in a monorepo isn't about the CSS itself—it's about the architecture around it. By centralizing your config, using presets, and being smart about your component boundaries, you save yourself a massive headache down the line.

The goal is to make it so that a new dev can join the team and build a page that looks perfectly "on-brand" without ever having to ask what the primary hex code is.

What’s your biggest struggle with Tailwind at scale? I’d love to hear how you’re handling it.

— Prashuk

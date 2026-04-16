---
title: Architecting Scalable Next.js Apps: Mastering the App Router and Shared Layouts
date: 2026-04-16T06:58:23.386Z
description: Blog about Architecting Scalable Next.js Apps: Mastering the App Router and Shared Layouts
---

Hey everyone, Prashuk here.

If you’ve been following the Next.js evolution, you know the jump from the `pages` router to the `app` router wasn't just a small update—it was a complete shift in how we think about building web apps. 

I’ve spent the last year migrating a few mid-to-large scale projects to the App Router, and honestly? It was a headache at first. But once the mental model clicked, there was no going back. I care a lot about UI snappiness and keeping my code from turning into spaghetti, so today I want to share how I actually structure things to keep them scalable.

### 1. Stop thinking in "Pages," start thinking in "Layouts"

In the old days, every time you navigated, the whole page effectively re-rendered. With the App Router, shared layouts are a game-changer for performance.

**In one of my projects**—a SaaS dashboard—I had a sidebar and a top nav that stayed exactly the same across 20 different routes. In the Pages router, I had to wrap every single page in a `<Layout>` component. It worked, but it felt redundant.

With `layout.js`, the sidebar stays mounted. It doesn’t re-render when the user clicks a link. This keeps the state (like a searched value in the sidebar) intact while only the inner `page.js` swaps out. It makes the UI feel like a native desktop app rather than a website.

### 2. The "Client Component" Trap

This is where I see most people (including myself, early on) mess up. We’re so used to `useState` and `useEffect` that we accidentally mark the entire page with `'use client'`. 

**I ran into this issue when** I was building a product listing page. I made the whole file a Client Component because I needed a "Like" button. The result? My SEO took a hit, and the initial bundle size was way larger than it needed to be.

**What worked for me was** a "Leaf Component" strategy. Keep the page a Server Component to fetch the data directly from the DB or API. Then, only make the small button or the search bar a Client Component.

### 3. Organizing the Folders (The "Feature" Approach)

When an app grows, putting 50 components inside a single `/components` folder is a nightmare. I’m a big fan of clean code, and that starts with the file tree.

Instead of grouping by *type* (components, hooks, utils), I’ve started grouping by *feature*.

*   `app/dashboard/settings`
*   `features/billing/components`
*   `features/billing/api`

This way, when I need to fix a bug in the billing UI, I’m not scrolling through a list of 100 unrelated files. Everything related to billing is right there.

### 4. Real-world Implementation: Nested Layouts

The real power comes when you nest layouts. Think about a settings page. You have the main dashboard layout, then inside that, you have a settings layout with its own sub-navigation (Profile, Security, Billing).

Here’s a quick look at how I structure a nested layout for a clean UI:

```tsx
// app/dashboard/settings/layout.tsx
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64">
        <SettingsSidebar /> {/* Simple links to /profile, /billing, etc. */}
      </aside>
      
      <main className="flex-1 bg-white p-6 rounded-lg shadow-sm">
        {children} {/* This is where page.js content goes */}
      </main>
    </div>
  )
}
```

By doing this, the user can switch between "Profile" and "Billing" instantly. The sidebar doesn't flicker, and the URL updates perfectly.

### 5. My Best Practices for Scalability

*   **Default to Server Components:** Only use `'use client'` when you absolutely need interactivity (onClick, onChange) or hooks.
*   **Use `loading.js` religiously:** It’s the easiest way to improve perceived performance. Instead of a blank white screen, show a skeleton UI. It makes the app feel faster than it actually is.
*   **Error Boundaries:** Use `error.js` in specific sub-folders. If the "Analytics" tab crashes, don't let it crash the whole dashboard. Keep the error localized.
*   **Colocation:** Keep your tests and styles as close to the component as possible.

### Wrapping Up

Architecting a Next.js app isn't about following a strict theory; it's about making choices that won't make you miserable six months from now. Moving to the App Router requires a bit of unlearning, but the benefits for UI stability and code organization are worth it.

The biggest thing I've learned? **Don't over-engineer early.** Start with simple layouts, and as your project grows, start breaking things into feature-based folders.

What’s been your biggest struggle with the App Router? Let's chat in the comments or find me on Twitter.

Stay coding!
— Prashuk

---
title: Architecting Scalable Next.js Apps: Transitioning from Layered Folders to Feature-Based Modules
date: 2026-05-21T08:36:03.244Z
description: Blog about Architecting Scalable Next.js Apps: Transitioning from Layered Folders to Feature-Based Modules
---

Hey, I’m Prashuk. I spend most of my time building and breaking things with the MERN stack and Next.js. If you’re like me, you probably started your last Next.js project by creating folders like `/components`, `/hooks`, and `/utils`. It feels right at first, but let’s be honest—once the project hits a certain size, it becomes a nightmare to maintain.

I’ve learned the hard way that "layered architecture" usually leads to what I call "Folder Hell." Here’s why I moved away from it and how I structure my apps now using feature-based modules.

### The Problem: When `/components` Becomes a Junk Drawer

In one of my previous projects—a complex SaaS dashboard—I followed the traditional layered approach. I had a `components` folder with over 60 files. If I needed to fix a bug in the "User Billing" section, I had to jump between:
- `components/UserBillingTable.tsx`
- `hooks/useFetchBilling.ts`
- `utils/formatCurrency.ts`
- `types/billing.d.ts`

I was spending more time navigating the file tree than actually writing code. It was a mess. When I wanted to delete a feature, I’d inevitably leave behind a stray hook or a utility function because I wasn't sure if something else was using it.

### The Shift: Think in Features, Not Layers

What worked for me was moving to a **Feature-Based Module** structure. The idea is simple: everything related to a specific feature (like "Authentication" or "Product Catalog") lives in one place.

If you look at my recent projects, my `src` folder usually looks like this:

```text
src/
  app/              # Next.js App Router (Routes & Layouts)
  components/       # Global UI components (Button, Input, Modal)
  features/
    auth/           # Everything related to Auth
      components/
      hooks/
      api/
      types/
    billing/        # Everything related to Billing
      components/
      hooks/
      services/
  lib/              # Shared library configs (Axios, Supabase)
  utils/            # Generic helper functions
```

This way, if I’m working on "Billing," I stay inside the `features/billing` folder. It keeps the mental mapping clean.

### Why This Wins for Performance and UI

I care a lot about performance. When you co-locate your code, it’s much easier to see what’s being imported. 

In Next.js, this is a lifesaver for **Code Splitting**. If a heavy library is only used in the `features/analytics` module, it’s much easier to isolate it and ensure it doesn’t bloat your main bundle. From a UI perspective, I can build "Internal Components" that are only used within a feature. Not every component needs to be a global, reusable component. 

I ran into this issue when I made a `DataChart` component global. It was so specific to the Admin Dashboard that when I tried to use it elsewhere, I had to add ten different props just to make it work. If I had kept it inside `features/admin`, I wouldn't have over-engineered it.

### The "Public API" Pattern

One trick I use to keep code clean is the `index.ts` file inside each feature folder. This acts as a "Public API."

```typescript
// features/auth/index.ts

// Only export what the rest of the app needs
export * from './components/LoginForm';
export * from './hooks/useUser';
export { type User } from './types';

// Keep internal logic hidden
```

If another part of the app needs something from Auth, it *must* go through this index file. This prevents "spaghetti imports" where components from deep inside one feature are reaching into the guts of another.

### Best Practices for Your Next Project

1.  **Don’t over-abstract early:** Start simple. Don't create a feature folder for something that is only two lines of code.
2.  **Global vs. Feature UI:** If a component is used in 3+ features (like a `Button`), put it in `src/components`. If it’s only for a specific form, keep it in the feature folder.
3.  **Keep `app/` thin:** The `app` directory in Next.js should mostly handle routing and layouts. Keep the heavy business logic in your `features/` folders.
4.  **Naming is key:** Name your features based on the domain (e.g., `cart`, `profile`, `search`), not technical layers.

### Final Thoughts

Transitioning to feature-based modules changed the way I look at my IDE. My code is more predictable, and onboarding other developers to my projects is 10x faster because the folder structure explains the business logic.

Next time you start a Next.js app, try skipping the `hooks` and `services` folders at the root. Group by feature instead. Your future self will thank you when you have to refactor that one messy module six months from now.

What do you think? Do you prefer the flat structure or modules? Let me know!

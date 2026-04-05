---
title: Micro-Frontends with Next.js: Solving Cross-Application State and Style Isolation
date: 2026-04-05T06:16:15.895Z
description: Blog about Micro-Frontends with Next.js: Solving Cross-Application State and Style Isolation
---

Hey everyone, I’m Prashuk. 

If you’ve been following the frontend world lately, you’ve probably heard everyone raving about Micro-Frontends (MFEs). On paper, they sound like a dream—splitting a massive monolith into tiny, manageable apps. But honestly? Implementing them in a real-world Next.js environment is a whole different ball game. 

I’ve spent a lot of time in the MERN stack, and recently, I had to migrate a massive e-commerce dashboard into an MFE architecture. I’ll be real with you: it wasn’t all sunshine and rainbows. I ran into two major headaches: **Style Bleeding** and **State Desync**.

Here is how I actually handled it, skipping the theoretical fluff.

### 1. The "Style Bleed" is Real
I ran into this issue when we integrated a new "Order Management" MFE into our main shell. Both apps used Tailwind, but different versions and different configurations. Suddenly, the buttons in my main app started looking like they were from a 2005 Windows XP theme because of CSS collisions.

What worked for me was moving away from global styles entirely. If you’re using Next.js, **CSS Modules** are your best friend here because they scout-scope everything by default. 

But if you’re a Tailwind fan like me, you need a `prefix`. In your `tailwind.config.js`, add a prefix unique to that MFE:

```javascript
// tailwind.config.js
module.exports = {
  prefix: 'order-mgt-',
  // ... rest of config
}
```
It feels a bit tedious to write `order-mgt-flex` instead of just `flex`, but trust me, it saves you from hours of debugging why your headers are suddenly neon pink.

### 2. Sharing State Without the Bloat
In one of my projects, we tried to share a single Redux store across three different MFEs. It was a disaster. The bundle size exploded, and debugging an action fired in App A that broke App C was a nightmare.

Now, I follow a simple rule: **Apps should be deaf and dumb to each other's internal state.** 

If App A needs to tell App B that a user logged out, don't share a store. Use a **Custom Event Bus**. It’s native to the browser, lightweight, and doesn’t care if one app is Next.js and the other is plain React.

### 3. Handling the "Shared Data" Problem
Sometimes, you *do* need shared data, like user profiles or cart counts. I’ve found that the best way to handle this in Next.js is through a "Shell" approach. 

The Shell (Main App) fetches the core data and passes it down. But instead of props (which get messy with MFEs), I use a lightweight library like `zustand` or just stick to the **URL**. 

I’m a huge advocate for using the URL as a state manager. Need to show a specific order ID in the sidebar MFE? Put it in the query params. It’s clean, bookmarkable, and every MFE can read it without needing a complex bridge.

### 4. Performance & The "Next.js" Factor
Next.js is built for SSR, but MFEs often rely on Client-Side Rendering (CSR) to "plug in" components. This can kill your LCP (Largest Contentful Paint) scores. 

When I was building a high-traffic dashboard, I realized that loading five different MFEs meant loading React five times. That’s a performance killer. To solve this, we used **Module Federation**. It allows MFEs to share dependencies. If the Shell has React loaded, the MFE won't download it again.

### The Implementation: A Simple Event Bridge
Here’s a quick look at how I handle cross-app communication without tying the apps together. This is a simple utility I use to let MFEs talk:

```javascript
// A simple way to trigger actions across different apps
const EventBus = {
  emit(event, data) {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  on(event, callback) {
    window.addEventListener(event, (e) => callback(e.detail));
  },
  off(event, callback) {
    window.removeEventListener(event, callback);
  }
};

// In App A (The "User" App)
EventBus.emit('USER_LOGGED_IN', { name: 'Prashuk' });

// In App B (The "Header" App)
EventBus.on('USER_LOGGED_IN', (user) => {
  console.log(`Welcome, ${user.name}`);
});
```

### Best Practices I Swear By
*   **Don’t Over-Engineer:** If your team is small (2-3 devs), you probably don't need MFEs. A well-structured monorepo is much faster to develop.
*   **Version Everything:** Treat your MFEs like NPM packages. Don't just deploy to `main` and hope for the best. 
*   **Shared UI Kit:** Build a small, versioned UI library (using something like Radix or Shadcn) so all your MFEs look like they belong to the same family.
*   **Isolate Errors:** Use Error Boundaries around every MFE container. You don’t want a tiny bug in the "Feedback Form" MFE to crash your entire checkout page.

### Conclusion
Micro-frontends aren't about making things "cool"—they are about making teams independent. But that independence comes with the cost of orchestration. 

Looking back at my past projects, the biggest lesson I learned was to **keep the boundary clean**. The moment you start tightly coupling your styles or state between two apps, you’ve lost the benefit of MFEs and just created a "distributed monolith," which is even worse.

Keep it simple, use the browser's native features where you can, and always keep an eye on that bundle size.

What’s your experience with Next.js and MFEs? I'd love to hear if you found a better way to handle the state mess!

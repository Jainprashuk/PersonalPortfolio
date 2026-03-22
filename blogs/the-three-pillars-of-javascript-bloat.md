---
title: The three pillars of JavaScript bloat
date: 2026-03-22T12:36:33.520Z
description: Blog about The three pillars of JavaScript bloat
---

Hey everyone, I’m Prashuk Jain. I’m currently wrapping up my final year of Computer Science and spending most of my time deep-diving into React and Next.js. 

I’ll be honest: when I started out, I used to think that a "heavy" project meant I was doing something complex and impressive. I’d look at my `node_modules` folder, see it was 500MB, and think, "Yeah, this is a serious app." 

I was wrong. 

After building a few real-world projects and actually checking my Lighthouse scores, I realized that JavaScript bloat is the silent killer of user experience. Nobody cares how cool your code is if the site takes 6 seconds to become interactive on a budget Android phone.

Here are what I call the **Three Pillars of JavaScript Bloat**—and how I’ve been trying to tear them down.

### 1. The "Library for Everything" Syndrome

In one of my early MERN projects—a simple task manager—I needed to format some dates. Without thinking, I ran `npm install moment`. 

I didn't realize that `moment.js` is huge because it carries around locale data for basically every language on Earth. I only needed it to show "2 days ago." I ended up shipping 70kb of JS just to format a string.

I ran into this issue again recently with animations. I almost installed a heavy physics-based library for a simple hover effect. Now, my rule is: **Native first.** If CSS can do it, don't use JS. If vanilla JS can do it in ten lines, don't install a package.

### 2. State Management Overkill

I see this a lot in the React community. We get taught Redux or Context API, and suddenly we feel the need to put *everything* in a global provider.

In a dashboard project I worked on last semester, I put the "Sidebar Open/Closed" state into a global Context. Every time someone toggled the sidebar, the *entire* app tree re-rendered. The UI felt sluggish, and I couldn't figure out why until I realized I was forcing React to do unnecessary work.

**What worked for me was keeping state as local as possible.** If a component is the only one using a piece of data, keep it in a simple `useState`. Don't make the engine work harder than it has to.

### 3. The "Just in Case" Code

We’ve all been there. You write a helper function, realize you don't need it, but leave it there "just in case" you need it later. Or you import an entire utility library like Lodash just to use one function.

Modern bundlers are good at tree-shaking, but they aren't magic. If you import the whole library, you're usually shipping the whole library.

Here’s a quick example of how I refactored a common bloat issue. Instead of bringing in a massive utility lib to find a unique item in an array:

```javascript
// The Bloated Way (Requires a 25kb library)
import _ from 'lodash';
const unique = _.uniq([1, 2, 2, 3]);

// The Lean Way (Native JS, 0kb extra)
const unique = [...new Set([1, 2, 2, 3])];
```

I know it looks small, but these things add up across a large codebase.

### My Best Practices for Staying Lean

*   **Bundle Analysis:** I now use `@next/bundle-analyzer` or `webpack-bundle-analyzer` at least once a month. It’s eye-opening to see which "small" packages are actually taking up 30% of your bundle.
*   **Dynamic Imports:** In Next.js, if I have a heavy component (like a Map or a complex Modal), I use `dynamic()` to load it only when the user actually needs it.
*   **Check the Cost:** Before I `npm install`, I check [Bundlephobia](https://bundlephobia.com/). If a package is 50kb and I only need one function, I’ll just write the function myself.
*   **SVGs over Icons:** Instead of importing an entire icon library (like FontAwesome), I just copy the SVG code for the 5-10 icons I actually use.

### Conclusion

At the end of the day, clean code isn't just about how it looks to you—it's about how it performs for the user. 

I’ve learned that the best feature you can add to a project is often the code you *don't* write. Every kilobyte of JavaScript you cut is a win for performance and a win for your users.

Stay curious and keep your bundles light! 🚀

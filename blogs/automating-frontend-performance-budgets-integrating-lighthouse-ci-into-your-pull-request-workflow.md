---
title: Automating Frontend Performance Budgets: Integrating Lighthouse CI into Your Pull Request Workflow
date: 2026-06-17T09:53:29.019Z
description: Blog about Automating Frontend Performance Budgets: Integrating Lighthouse CI into Your Pull Request Workflow
---

# Stop Letting Your PRs Kill Your Page Speed: A Practical Guide to Lighthouse CI

Hey, I'm Prashuk. I spend most of my day living in React and Next.js, and if there’s one thing I’ve learned, it’s that "performance" is usually the first thing that gets sacrificed when a deadline is looming. 

We’ve all been there: the UI looks great, the code is clean, and the PR gets merged. Then, two weeks later, someone notices the site feels sluggish on mobile. I ran into this exact issue when I was working on a high-traffic dashboard. A dev (honestly, it might have been me) added a heavy charting library without checking the bundle impact, and our LCP (Largest Contentful Paint) shot through the roof.

Manual testing is a trap. If you don't automate your performance checks, they won't happen. Here is how I set up Lighthouse CI to guard my PRs.

---

### 1. Why Performance "Budgets" Actually Matter
In theory, we all want a 100/100 score. In reality, that’s often overkill. What worked for me was setting a "Performance Budget." 

Think of it as a limit. You tell the CI: "If the performance score drops below 90, or the JavaScript bundle increases by more than 50KB, fail the build." This stops the "performance leak" before it ever hits your main branch.

### 2. Setting Up the Configuration
I prefer keeping things simple. You don't need a massive config file to start. You just need a `.lighthouserc.js` in your root folder.

When I first tried this, I over-engineered the config and it kept failing because of minor network fluctuations. Pro tip: Use the `assertions` property to focus on what actually breaks the user experience.

```javascript
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 250000 }],
        'dom-size': ['error', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### 3. Integrating with GitHub Actions
This is where the magic happens. You want Lighthouse to run every time someone pushes a change. 

In one of my projects, we used the official Lighthouse CI Action. It sits right inside your `.github/workflows/main.yml`. Now, when a teammate tries to merge a massive, unoptimized image or a bloated library, the PR gets a big red "X". It forces a conversation about performance before the code is live.

### 4. Handling the "Flaky Test" Problem
One thing that drove me crazy initially was "flakiness." Lighthouse scores can change based on the CPU speed of the CI runner. 

To fix this, I stopped chasing a perfect 90 score every single time. Instead, I set `numberOfRuns: 3`. Lighthouse CI will take the median. This makes the build much more stable. Also, focus on **Core Web Vitals** (LCP, CLS, INP) rather than the overall "Performance" category. Those are the metrics that Google actually cares about for SEO.

### 5. UI/UX and Clean Code are Linked
Bad performance is a UI bug. If your React components are re-rendering 50 times because of a messy `useEffect`, your Lighthouse score will tank. 

What I usually do is check the "Total Blocking Time" (TBT). If TBT is high, I know I’ve written some "clever" code that is actually blocking the main thread. It’s a great reality check for keeping your code clean and efficient.

---

### Best Practices I Follow:
*   **Don't be a perfectionist:** Start with a lower threshold (like 70 or 80) and tighten it as you optimize.
*   **Test on Mobile:** Always set your Lighthouse CI to emulate a mobile device. If it works on a slow 4G connection, it’ll fly on a desktop.
*   **Check Third-Party Scripts:** Sometimes it’s not your code—it’s that tracking pixel or chat widget. Lighthouse CI helps you prove that to the marketing team.

### My Learnings
Automating performance budgets completely changed how I review PRs. I no longer have to guess if a new feature is slowing us down; the data is right there in the GitHub comments. 

If you care about your users (and your SEO), get this into your workflow. It takes about 20 minutes to set up, but it saves you hours of debugging "why is the site slow" later on.

**What about you?** Do you use budgets, or do you just "feel out" the performance? Let me know!

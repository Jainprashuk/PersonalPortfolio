---
title: Mastering Code Splitting in React: Strategic Dynamic Imports for Reducing Total Blocking Time
date: 2026-05-12T07:46:00.047Z
description: Blog about Mastering Code Splitting in React: Strategic Dynamic Imports for Reducing Total Blocking Time
---

Hey everyone, I’m Prashuk. If you’ve followed my work, you know I’m not big on quoting documentation. I’d rather show you what actually happens when your app hits production and real users start complaining about "jank."

Lately, I’ve been obsessed with performance—specifically Total Blocking Time (TBT). You can have a fast "First Contentful Paint," but if your main thread is choked up for 2 seconds while the browser tries to parse a massive JS bundle, your UI is going to feel like it's stuck in mud.

Here’s how I’ve been using strategic code splitting to fix this in my own projects.

### The "Aha!" Moment with TBT

I ran into this issue when I was building a complex SaaS dashboard a few months back. On my local machine (a high-end MacBook), everything was snappy. But when I tested it on a mid-range Android phone using Chrome DevTools throttling, the TBT was through the roof—almost 1.5 seconds.

The culprit? I was loading a heavy charting library and a complex "Export to PDF" module right at the start, even though 90% of users didn't click those features immediately. 

What worked for me was moving away from "Route-level splitting" only and getting aggressive with "Component-level splitting."

### Stop Loading Everything on Page Load

Most of us are taught to use `React.lazy` for our main routes. That’s fine, but it’s not enough. 

In one of my projects, I had a massive "Settings" modal with about 20 different form fields, validation logic, and sub-components. Even if the user never opened the settings, that code was being downloaded and parsed.

I started doing this instead:
*   Only load the "Shell" of the page.
*   Lazy load modals, heavy filters, and complex data tables.
*   Import libraries (like `moment` or `lodash`) only inside the function where they are actually needed.

### Practical Implementation: The Trigger-Based Import

Here’s a quick look at how I handle a heavy component now. Instead of just importing it at the top, I wrap it in a `Suspense` boundary and only let it hit the main thread when necessary.

```javascript
import React, { useState, Suspense, lazy } from 'react';

// This is the heavy component we don't want in the main bundle
const HeavyAnalyticsChart = lazy(() => import('./components/HeavyAnalyticsChart'));

const Dashboard = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>Project Overview</h1>
      <button onClick={() => setShowChart(true)}>
        View Detailed Analytics
      </button>

      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyAnalyticsChart />
        </Suspense>
      )}
    </div>
  );
};
```

By doing this, that `HeavyAnalyticsChart` code isn't even touched by the browser until the user actually clicks that button. This directly reduces the initial execution time of your JS, which is exactly how you bring that TBT number down.

### UI Matters: Don't Let it Flicker

One thing I care about deeply is the UI. If you split your code but your "Loading..." state looks ugly, the user experience actually feels worse, even if the app technically loads faster.

I always try to match the "Fallback" component with the actual UI. If it's a chart, use a gray box skeleton with the same height. It prevents the layout from jumping around when the chunk finally loads. Honestly, a well-designed skeleton loader makes your app *feel* faster than it actually is.

### My Personal Rules for Splitting

I don’t split everything. Over-splitting creates too many network requests, which is another headache. Here is my checklist:
*   **Is the component > 20kb?** Split it.
*   **Is it "below the fold"?** Split it.
*   **Is it a Modal or a Slide-over?** Definitely split it.
*   **Is it an admin-only feature?** Split it away from the user-facing bundle.

### What I Learned

The biggest takeaway for me has been that performance isn't just a checkbox; it’s about respect for the user’s device. When I started being strategic with dynamic imports, my Lighthouse performance scores jumped from the 60s to the high 90s, but more importantly, the "click-to-action" lag completely disappeared.

Clean code isn't just about how it looks in VS Code; it's about how efficiently it runs in the browser.

Catch you in the next one,
**Prashuk**

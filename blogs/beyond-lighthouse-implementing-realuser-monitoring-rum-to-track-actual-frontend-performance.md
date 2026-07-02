---
title: Beyond Lighthouse: Implementing Real-User Monitoring (RUM) to Track Actual Frontend Performance
date: 2026-07-02T08:14:21.769Z
description: Blog about Beyond Lighthouse: Implementing Real-User Monitoring (RUM) to Track Actual Frontend Performance
---

Hey everyone, I’m Prashuk. If you’re like me, you probably spend a lot of time chasing those perfect green circles in Lighthouse. It feels great to hit a 90+ score, right?

But here’s the reality check: Lighthouse is a lab test. It runs on a high-end machine with a fast connection. Your users? They’re browsing your site on a three-year-old budget Android phone while sitting in a moving train with spotty 4G.

In one of my recent Next.js projects, I had a perfect Lighthouse score, yet my analytics showed a high bounce rate on the checkout page. It turned out the page was "technically" fast, but a third-party script was freezing the main thread for real users. 

That’s where Real-User Monitoring (RUM) comes in. Let’s talk about how to move beyond the lab and track what’s actually happening on your users' screens.

### 1. The Problem with "Lab Data"
Lighthouse is great for development, but it’s a snapshot in time. It doesn't account for layout shifts that happen after a user scrolls, or how long a button takes to respond when the CPU is throttled.

I ran into this issue when I built a dashboard for a client. On my MacBook, everything was snappy. But real users were complaining about "laggy" inputs. Lighthouse didn't catch it because it doesn't "type" into inputs like a human does. RUM helps you see the **Interaction to Next Paint (INP)**—which is a much better metric for how "fast" a site actually feels.

### 2. What We Actually Need to Track
We don't need a million metrics. I usually focus on the "Core Web Vitals," but I track them from the browser using the `web-vitals` library.

*   **LCP (Largest Contentful Paint):** How fast the main content actually shows up for someone on a slow connection.
*   **CLS (Cumulative Layout Shift):** This is a big one for UI. Does the "Buy Now" button jump away right when the user tries to click it?
*   **INP (Interaction to Next Paint):** This replaced FID. It measures the delay of *every* interaction, not just the first one.

### 3. Implementing RUM (The Practical Way)
You don't need a heavy enterprise tool to start. If you’re using React or Next.js, the easiest way is to use the `web-vitals` package and send the data to your own backend or Google Analytics.

What worked for me was creating a small utility to capture these metrics. Here’s a simple implementation:

```javascript
import { onCLS, onINP, onLCP } from 'web-vitals';

// I prefer sending this to a custom endpoint to keep my data clean
function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id, // unique ID for the current page load
    url: window.location.href,
  });

  // Use sendBeacon so it doesn't slow down page transitions
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    fetch('/api/vitals', { body, method: 'POST', keepalive: true });
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onLCP(sendToAnalytics);
  onINP(sendToAnalytics);
}
```

### 4. Making Sense of the Data
Once you start collecting this, don't just look at the average. **Averages are liars.**

If 80% of your users have a 1-second load time and 20% have a 10-second load time, your "average" looks okay, but 20% of your users are having a terrible experience. I always look at the **P75 or P95 (95th percentile)**. This tells you what the experience is like for your users on the slowest devices.

In that same dashboard project, my average LCP was 1.2s, but my P95 was 6.5s. That told me I had a massive issue with image optimization for mobile users that Lighthouse completely ignored.

### 5. My Best Practices for Frontend Performance
If you’re going to implement RUM, keep these three things in mind:

*   **Don't let the tracker kill performance:** Use `requestIdleCallback` or `navigator.sendBeacon` to send your data. You don't want your performance monitoring to be the reason your site is slow.
*   **Correlate with UI events:** Track which specific element caused a Layout Shift. The `web-vitals` library actually provides the "attribution" (the specific DOM element) in its latest version.
*   **Performance is a feature:** Treat a slow INP score just like a UI bug. If a button takes 300ms to react, that’s a broken UI in my book.

### Final Thoughts
Lighthouse is your compass, but RUM is your map. You need both to know where you're going. 

Ever since I started looking at real-user data, my approach to clean code has changed. I care less about "clever" one-liners and more about "boring" code that doesn't block the main thread. At the end of the day, the user doesn't care how pretty your code is—they care if the site works when they’re in a basement with one bar of signal.

Give it a shot in your next project. You might be surprised by what your users are actually seeing.

**Stay practical,**
Prashuk

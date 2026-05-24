---
title: Zero-Bundle-Size UI Logic: Leveraging Modern CSS and Tailwind for High-Performance Interactions
date: 2026-05-24T07:51:17.556Z
description: Blog about Zero-Bundle-Size UI Logic: Leveraging Modern CSS and Tailwind for High-Performance Interactions
---

Hey everyone, Prashuk here. 

If you’re anything like me, you probably love the React ecosystem. But let’s be honest—we’ve developed a bad habit of reaching for `npm install` or `useState` the second we need a dropdown, a modal, or even a simple hover effect. 

Lately, I’ve been obsessed with one thing: **Bundle size.** 

In one of my recent projects—a data-heavy dashboard for a client—we were seeing some serious lag on mobile. When I looked at the Profiler, I realized we were shipping about 40KB of JavaScript just for "UI logic" (headless components, transition groups, etc.). 

It felt overkill. So, I started stripping it back. I wanted to see how much "interactivity" I could offload to the browser's native engine using just Tailwind and modern CSS.

Here’s what I learned and how I'm doing things now.

### 1. The "State" we don't actually need
We’ve been conditioned to think that if something opens or closes, it needs a `const [isOpen, setIsOpen] = useState(false)`. 

I ran into this issue when I was building a sidebar navigation. Every time a user clicked a menu, React had to re-render the whole nav tree. It wasn't "slow" per se, but you could feel that tiny micro-delay.

What worked for me was going back to basics. Using the CSS `:focus-within` or even the "checkbox hack" (don't cringe, it's actually great for performance) allows the UI to react instantly without touching the JS main thread.

### 2. Leveraging Tailwind’s `peer` and `group`
Tailwind has these two features that are honestly lifesavers for clean code. 

*   **`group`**: For styling children based on parent state.
*   **`peer`**: For styling siblings.

I used to use JS to detect if an input was focused to show a helper tooltip. Now? I just give the input a `peer` class and the tooltip a `peer-focus:block`. Zero JS, zero re-renders, and the code looks much cleaner.

### 3. The `:has()` selector is a game-changer
If you haven't started using `:has()` yet, you're missing out. It’s basically a parent selector.

I used this recently to style a card component. If the card had an image inside it, I wanted the padding to change. Usually, I'd pass a `hasImage` prop in React. With `:has()`, I just wrote a utility class. It's supported in all major browsers now, and it’s shifted how I think about component architecture.

### 4. Native elements over custom logic
Stop building accordions with React state. Seriously. 

The `<details>` and `<summary>` tags are incredibly powerful now. You get keyboard accessibility, "open/close" logic, and screen reader support for free. 

In a project last month, I replaced a complex Framer Motion accordion with native `<details>` tags and some simple Tailwind transitions. The lighthouse score jumped by 5 points just from the reduction in script execution time.

### Real-World Example: The "Zero-JS" Dropdown
Here’s a quick look at how I handle a dropdown or a mobile menu now without using a single line of React state:

```html
<!-- The wrapper -->
<div class="relative border p-4">
  <!-- The "Trigger" via a hidden checkbox -->
  <input type="checkbox" id="menu-toggle" class="peer hidden" />
  
  <label for="menu-toggle" class="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
    Click Me
  </label>

  <!-- The "Menu" -->
  <div class="hidden peer-checked:block absolute top-12 left-0 w-48 bg-white border shadow-lg p-2">
    <ul class="flex flex-col gap-2">
      <li class="hover:bg-gray-100 p-2 cursor-pointer">Profile</li>
      <li class="hover:bg-gray-100 p-2 cursor-pointer">Settings</li>
      <li class="hover:bg-gray-100 p-2 cursor-pointer text-red-500">Logout</li>
    </ul>
  </div>
</div>
```

Is it "The React Way"? Maybe not. But is it fast? Extremely.

### Best Practices for this approach
*   **Don't overdo it:** If you need complex logic (like closing the menu when clicking *outside*), JS is still your friend. Don't fight the browser.
*   **Accessibility first:** If you use the checkbox hack, make sure your labels are properly linked and you handle `aria` attributes where possible.
*   **Use `peer` sparingly:** It can make your HTML look a bit messy if you have 10 siblings depending on one checkbox. Keep it focused.

### My Takeaway
Look, I’m not saying we should stop using React state. It's literally what we get paid for. 

But as developers, we should be responsible for the bytes we send to the user. My philosophy now is: **If CSS can do it, let CSS do it.** 

It keeps my React components strictly for business logic and data fetching, which makes debugging way easier. Plus, the UI feels "snappy" in a way that JS-driven animations sometimes just can't match.

Give it a shot in your next small feature. You'll be surprised how much weight you can trim off your bundle.

Anyway, that’s my rant for today. Catch you in the next one!

— Prashuk

---
title: Thinking Fast, Slow, and Artificial: How AI Is Reshaping Human Reasoning
date: 2026-03-22T12:26:45.309Z
description: Blog about Thinking Fast, Slow, and Artificial: How AI Is Reshaping Human Reasoning
---

Hey everyone, Prashuk here. 

If you’ve been following my journey, you know I’m currently in my final year of CS and spend most of my time neck-deep in React components and Next.js API routes. Lately, I’ve been thinking a lot about *how* we actually solve problems now that AI is basically a permanent tab in our browsers.

You’ve probably heard of the book *Thinking, Fast and Slow* by Daniel Kahneman. It talks about System 1 (fast, intuitive) and System 2 (slow, logical) thinking. But as a developer in 2024, I feel like we’ve developed a "System 3"—Artificial Reasoning.

Here’s how it’s actually changing the way I build projects.

### 1. The "Fast" Intuition vs. The "AI" Shortcut

Normally, System 1 is that gut feeling when you see a bug. You think, *"Oh, that’s definitely a stale closure in a useEffect."* You just know it because you've seen it a hundred times.

But now, I find myself jumping straight to AI before my own brain even finishes processing the error message. **I ran into this issue when** I was trying to optimize a complex data table in a MERN dashboard. Instead of profiling the component myself, I just pasted the code into an LLM.

The result? It gave me a solution that looked clean but completely ignored the fact that I was using a custom hook for global state. It "thought" fast, but it didn't "know" my project.

### 2. When Slow Thinking Saves Your UI

Performance is huge for me. I hate laggy interfaces. System 2 thinking—the slow, deep logic—is what usually helps us catch performance bottlenecks.

**In one of my projects**, a real-time task manager, I used AI to generate a drag-and-drop sorting logic. On paper, the code was perfect. In reality, the UI felt "heavy." Because I was relying on "Artificial Thinking," I didn't stop to realize that the AI had suggested re-rendering the entire list on every small mouse movement.

**What worked for me was** stepping back, turning off Copilot for twenty minutes, and manually implementing a throttle function. AI is great at syntax, but it often lacks the "feel" for a smooth user experience.

### 3. The Shift: Prompting is the new Debugging

My reasoning process has shifted from "How do I write this?" to "How do I explain this?"

Instead of thinking about the `for` loop or the `map` function, I’m thinking about the architecture. I’ve realized that if I can’t explain the logic to an AI, I probably don't understand it myself. 

I’ve started using AI as a rubber duck that talks back. I’ll explain my database schema for a new Next.js app and ask it to find holes in my logic. That’s where it shines—not in writing the code, but in stress-testing my slow, System 2 thinking.

### 4. A Practical Example: The Memoization Trap

Here’s a quick JS snippet that shows where AI reasoning can get a bit "lazy" and where you need to step in.

Imagine you're optimizing a list. AI will often suggest wrapping everything in `useMemo`.

```javascript
// What AI might suggest blindly
const filteredList = useMemo(() => {
  return items.filter(item => item.status === 'active');
}, [items]);

// What my "Slow Thinking" realized...
/* 
   If 'items' is a huge array from a websocket, this runs 
   constantly. In my project, what worked for me was 
   filtering on the server-side or using a simple 
   useTransition hook to keep the UI responsive 
   instead of just memoizing a heavy calculation.
*/
```

It’s a simple example, but it shows the difference between a "correct" answer and a "practical" one.

### Best Practices for the "System 3" Era

After a few months of balancing AI with my own learning, here’s how I stay sharp:

*   **The 5-Minute Rule:** Try to solve the bug yourself for 5 minutes before asking AI. It keeps your "System 2" brain from getting lazy.
*   **Audit the UI:** AI doesn't see your screen. Always check if the AI-generated logic actually *feels* good to use.
*   **Focus on Clean Code:** AI loves to write nested blocks. I always go back and refactor AI code to make it more readable and maintainable.
*   **Understand the "Why":** If AI gives you a solution you don't understand, don't paste it. Ask it to explain the logic first.

### Final Thoughts

AI isn't replacing our reasoning; it's just a new layer. My biggest learning this year is that while AI can think "fast," it can't always think "deep." As developers, our job is to be the "Slow Thinkers"—the ones who care about the architecture, the performance, and the final experience.

What’s your take? Are you findng yourself getting "lazy" with AI, or is it actually making you think harder about your code? Let me know!

Catch you in the next one,
**Prashuk**

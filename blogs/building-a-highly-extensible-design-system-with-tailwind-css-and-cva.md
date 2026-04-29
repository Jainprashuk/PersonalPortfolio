---
title: Building a Highly Extensible Design System with Tailwind CSS and CVA
date: 2026-04-29T07:26:28.633Z
description: Blog about Building a Highly Extensible Design System with Tailwind CSS and CVA
---

Hey everyone, I’m Prashuk Jain. I spend most of my time neck-deep in React and Next.js, building products that actually need to scale. 

I’m not a fan of over-complicating things with "academic" clean code. For me, code is clean if it doesn't make me want to quit my job when I have to add a new feature six months later. Today, I want to talk about something that saved my sanity: building a design system that doesn’t turn into a CSS nightmare.

### The "Spaghetti Class" Problem

In one of my earlier projects—a pretty complex SaaS dashboard—I remember our `Button.tsx` component becoming an absolute disaster. We had props for `isPrimary`, `isLarge`, `isOutline`, `isLoading`... you get the point.

My template literals looked like a crime scene. It was just a massive string of conditional Tailwind classes that no one could read. **I ran into this issue when** a designer asked for a "Ghost" variant that turned "Danger" red only on hover. Trying to wedge that logic into a standard string was the moment I realized we needed a better way to handle UI states.

### Why CVA is the Game Changer

Tailwind is amazing, but it doesn't give you a structure for *variants*. That’s where **CVA (Class Variance Authority)** comes in. 

What worked for me was treating my UI components like a state machine rather than just a pile of classes. CVA lets you define a "schema" for your component styles. It separates the *logic* of how a component looks from the *implementation* of the component itself.

To be honest, once you start using CVA, going back to standard conditional strings feels like writing code in Notepad.

### Making it "Extensible" (The Real-World Way)

Building a design system isn't just about making things look pretty; it’s about making them predictable. 

When I’m building a component library now, I always combine CVA with `tailwind-merge` and `clsx`. If you’ve ever tried to override a padding class on a component and it didn't work because of Tailwind's specificity rules, you know the pain. `twMerge` solves that by making sure the last class defined actually wins.

### Let’s Look at the Code

Here is how I usually structure a base `Button` component. This is the exact pattern I use in my production apps.

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// A tiny helper I use everywhere to merge classes safely
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-100",
        danger: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
    VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }), className)} 
      {...props} 
    />
  );
};
```

### Why this actually works in a team

1.  **Type Safety:** Because I’m using TypeScript with CVA, if I try to use `variant="super-neon-pink"`, my IDE immediately yells at me. This prevents "creative" styling by other devs that breaks the design system.
2.  **Clean Props:** The component stays clean. The logic for "what does a small danger button look like?" lives in the `buttonVariants` object, not inside the return statement.
3.  **Performance:** There’s zero runtime overhead that you’d actually notice. It’s just strings being concatenated.

### My Best Practices (Learned the Hard Way)

*   **Don't over-abstract:** Don't try to make one component do everything. If your "Button" also needs to be a "Link," use a "Slot" pattern or just make a separate `LinkButton` component.
*   **Keep your `cn` helper global:** You’ll use that `tailwind-merge` + `clsx` utility in every single component. Put it in a `src/lib/utils.ts` file and forget about it.
*   **Default to "Primary":** Always define `defaultVariants`. It saves so much time when you're just mocking up a quick UI.

### Wrapping Up

Building a design system doesn't mean you need to write a 50-page documentation site. It just means you need to stop writing messy, hard-to-read UI logic.

By using Tailwind for the styling and CVA for the management, you get a system that’s actually fun to work with. I’ve found that my development speed doubled once I stopped fighting with CSS classes and started using a structured approach.

Give it a shot in your next project. It’s one of those things where once you see it work, you can't go back. 

Catch you in the next one!

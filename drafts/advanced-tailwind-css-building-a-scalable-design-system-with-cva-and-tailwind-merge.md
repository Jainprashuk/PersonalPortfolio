---
title: "Advanced Tailwind CSS: Building a Scalable Design System with CVA and Tailwind Merge"
date: 2026-04-19T06:49:02.528Z
description: "Blog about Advanced Tailwind CSS: Building a Scalable Design System with CVA and Tailwind Merge"
status: draft
aiAssisted: true
---

Hey everyone, I’m Prashuk. If you’ve been following my work, you know I’m obsessed with keeping my code clean while making sure the UI looks top-notch.

Lately, I’ve been spending a lot of time refining how I build UI libraries. We all love Tailwind CSS for how fast it lets us move, but let’s be real—as soon as a project grows, those long strings of utility classes become a nightmare to manage. 

In one of my recent projects, a dashboard for a logistics client, I had a single Button component that ended up with about 15 different variations. Primary, secondary, outline, loading states, small, large... you name it. Trying to manage that with just template literals was a disaster. 

That’s when I switched to using CVA and Tailwind Merge. Honestly? It changed everything. Here’s how I’m doing it now.

### The "Spaghetti Class" Problem

I ran into this issue when I tried to override a component’s padding from a parent file. I’d pass a `className`, but Tailwind’s default behavior meant my new class would often get ignored because of how CSS specificity works in the generated bundle.

What worked for me was moving away from "manual" string manipulation and using a dedicated setup that handles logic and conflict resolution separately.

### 1. The Power Duo: CVA and Tailwind Merge

If you haven't used them yet, here’s the breakdown:
*   **CVA (Class Variance Authority):** This handles the logic. You define your variants (like "intent" or "size") in a clean object schema.
*   **Tailwind Merge:** This is the secret sauce. It looks at your final string of classes and intelligently merges them. If you have `px-4` and `px-6`, it knows to throw away the first one so the second one actually works.

### 2. Setting up the "cn" Helper

Before I build any component, I always create a utility function. Most people call it `cn`. It’s just a wrapper around `clsx` and `twMerge`.

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

I use this in every single project now. It’s the only way to ensure that when you pass a custom class to a component, it actually overrides the base style instead of fighting with it.

### 3. Real-World Implementation: The Scalable Button

Here is a simplified version of the Button component I built for that logistics project. Instead of a mess of ternary operators inside the `className`, I defined the variants clearly at the top.

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-100",
        ghost: "hover:bg-slate-100 text-slate-600",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {}

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { Button, buttonVariants };
```

### 4. Why this matters for Performance and DX

From my experience, the biggest win here isn't just "clean code"—it's the developer experience. 

When a new dev joins the team, they don't have to guess what classes make a "primary button." They just look at the `buttonVariants` object. Plus, since we’re using standard Tailwind classes, the final CSS bundle stays small. We aren't writing new CSS; we're just organizing how we apply existing utilities.

### Best Practices I Follow

*   **Keep it Flat:** Don't nest variants too deeply. If a component is getting that complex, it probably needs to be broken down into smaller sub-components.
*   **Base Styles First:** Put your truly "global" styles (like transitions or flexbox settings) in the first argument of `cva`.
*   **Type Safety:** Always export the `VariantProps`. It makes using the component in other parts of your Next.js app a breeze because VS Code will give you autocomplete for your variants.

### Final Thoughts

Moving to a CVA-based design system was a game-changer for my workflow. It stopped the "class wars" in my styling and made my UI components actually reusable across different projects.

If you’re still manually concatenating strings with `${active ? 'bg-blue-500' : 'bg-gray-500'}`, give this a shot. It feels like extra work for five minutes, but it saves you hours of debugging CSS specificity later.

Catch you in the next one!

---
title: Beyond the Basics: Implementing Compound Components for Highly Reusable UI Libraries
date: 2026-05-23T07:33:57.125Z
description: Blog about Beyond the Basics: Implementing Compound Components for Highly Reusable UI Libraries
---

Hey everyone, Prashuk here.

Lately, I’ve been spending a lot of time cleaning up technical debt in a dashboard project I’ve been working on. If you’ve been building React apps for a while, you know the drill—you start with a simple component, and before you know it, you’re passing 15 different props just to handle a slight variation in the UI.

I used to be guilty of building "God Components"—you know, those massive files that try to do everything via props like `showIcon`, `isHeaderRed`, `labelPosition`, etc. It’s a nightmare to maintain. 

That’s when I really leaned into the **Compound Component pattern**. It completely changed how I build UI libraries.

### The "Prop-pocalypse" I ran into

I ran into this issue when I was building a custom `Select` dropdown for a client. At first, it was simple. But then the designer wanted an icon in some rows, a divider in others, and a search bar at the top of some.

My code started looking like this:
`<MySelect data={list} showSearch={true} customIcon={...} dividerIndexes={[2, 4]} />`

Honestly? It was ugly. It wasn't flexible, and every time we needed a small change, I had to go back and edit the core component logic. What worked for me was moving away from this "configuration-based" approach to a more "composition-based" one.

### What are Compound Components, really?

The idea is simple: you have a parent component and several child components that work together to share state implicitly. Think of the `<select>` and `<option>` tags in HTML. You don’t pass the options as a massive array to the select tag; you nest them.

In React, we do this using the **Context API**. This allows the parent (the "Container") to hold the state (like which item is selected) and the children to access that state without you having to pass props manually to every single one of them.

### How I actually build them

In one of my projects, I rebuilt a `Tabs` system using this pattern. Instead of one giant `<Tabs />` component, I broke it down into `<Tabs>`, `<Tabs.List>`, `<Tabs.Trigger>`, and `<Tabs.Content>`.

Here is a simplified look at how I structure this using a `Select` example:

```jsx
import React, { useState, createContext, useContext } from 'react';

// 1. Create the context
const SelectContext = createContext();

// 2. The Parent (Container)
export function CustomSelect({ children, defaultValue }) {
  const [selected, setSelected] = useState(defaultValue);

  return (
    <SelectContext.Provider value={{ selected, setSelected }}>
      <div className="select-container">{children}</div>
    </SelectContext.Provider>
  );
}

// 3. The Children
const Option = ({ value, children }) => {
  const { selected, setSelected } = useContext(SelectContext);
  
  if (!SelectContext) {
    throw new Error("Option must be used within a CustomSelect");
  }

  return (
    <div 
      className={`option ${selected === value ? 'active' : ''}`} 
      onClick={() => setSelected(value)}
    >
      {children}
    </div>
  );
};

// 4. Attach children to parent (optional but looks cleaner)
CustomSelect.Option = Option;
```

### Why this is better for UI and Performance

The beauty of this is the **flexibility**. If I want to add an image inside an option, I just do it:
```jsx
<CustomSelect defaultValue="react">
  <CustomSelect.Option value="react">
    <img src="react-logo.png" /> React
  </CustomSelect.Option>
</CustomSelect>
```
I didn't have to add a `showImage` prop to the parent. I’m just writing standard JSX. 

From a performance side, since the state is scoped to the context of these components, you aren't re-rendering the entire page just because a dropdown value changed. Plus, the code is way cleaner and easier for other devs on my team to read.

### Best Practices (The "Don't Shoot Yourself in the Foot" list)

After breaking a few things, here’s what I’ve learned:

*   **Error Handling:** Always check if the child is being used outside the parent. Use a custom hook to wrap `useContext` and throw a clear error if it's null.
*   **Keep it Focused:** Don't try to make *everything* a compound component. If it’s a simple button, just use a button. Use this for complex, stateful UI like Modals, Tabs, and Steppers.
*   **Clean API:** I prefer the `Parent.Child` syntax (like `Tabs.Trigger`). It makes it obvious that they belong together.

### Final Thoughts

Moving to compound components was a turning point for me in terms of writing "clean code." It feels more like I’m building a language for my UI rather than just a bunch of rigid boxes. 

If you're currently struggling with a component that has 20 different props, try refactoring it this way. It might take an extra 20 minutes to set up the Context, but it’ll save you hours of debugging later.

Let me know what you think—do you prefer this or sticking to the standard props approach?

Stay coding,
**Prashuk**

---
title: Mastering Compound Components: Building Flexible and Reusable UI Kits in React
date: 2026-03-22T12:48:01.116Z
description: Blog about Mastering Compound Components: Building Flexible and Reusable UI Kits in React
---

Hey everyone, I’m Prashuk. I spend most of my days (and a fair few nights) building apps with the MERN stack. I’m a big believer that code should be easy to read and even easier to change. If I have to spend twenty minutes figure out how to pass a prop through five layers of components, I know I’ve done something wrong.

Lately, I’ve been focusing a lot on how we build UI kits. One pattern that completely changed the way I think about reusability is **Compound Components**.

Here is how I use them to build flexible UI without losing my mind.

### The "Prop-Drilling" Nightmare

In one of my earlier projects, I had to build a custom Modal component. It started simple, but then the requirements kept growing. I ended up with a component that looked like this:

`<MyModal title="Error" isOpen={true} onClose={handleClose} showFooter={true} primaryBtnText="Retry" />`

It was a total mess. If I wanted to add a custom icon next to the title, I had to add another prop. If I wanted the footer buttons to be left-aligned instead of right, yet another prop.

**I ran into this issue when** I realized that my "reusable" component was actually becoming a rigid box that was impossible to customize without breaking something else. That’s when I switched to Compound Components.

### So, What’s the Big Idea?

Think of it like a sandwich. Instead of ordering a pre-made "Turkey Sub" where you can’t easily remove the pickles, Compound Components give you the bread, the meat, and the veggies, and let you assemble it how you want.

The components work together behind the scenes using React Context, but as a developer using them, you have total control over the layout.

### How I Implement It (The Practical Way)

What worked for me was using `React.createContext`. This allows the parent component to hold the state and share it with its "children" without you having to pass props manually every time.

Let’s look at a simple **Tabs** component. This is a classic UI kit piece.

```jsx
import React, { useState, createContext, useContext } from 'react';

// 1. Create the Context
const TabContext = createContext();

// 2. The Parent Wrapper
export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabContext.Provider>
  );
}

// 3. The Sub-components
Tabs.Trigger = function Trigger({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabContext);
  return (
    <button 
      className={activeTab === value ? 'active' : ''} 
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

Tabs.Content = function Content({ value, children }) {
  const { activeTab } = useContext(TabContext);
  return activeTab === value ? <div>{children}</div> : null;
};
```

### Why This Wins for UI and Performance

The beauty of this is how you actually *use* it in your page:

```jsx
<Tabs defaultValue="login">
  <div className="custom-header-wrapper"> 
     <Tabs.Trigger value="login">Login</Tabs.Trigger>
     <Tabs.Trigger value="signup">Register</Tabs.Trigger>
  </div>
  
  <Tabs.Content value="login"><LoginForm /></Tabs.Content>
  <Tabs.Content value="signup"><SignupForm /></Tabs.Content>
</Tabs>
```

Notice how I wrapped the triggers in a `div`? If I had used a traditional "one-size-fits-all" component, I couldn't have done that easily. This gives the UI designer in me total freedom to tweak the layout without touching the core logic.

Performance-wise, it's also cleaner. Since the state is localized to the `Tabs` context, you aren't re-rendering the whole page just because someone clicked a different tab.

### My Best Practices

If you're going to start using this in your projects, keep these in mind:

*   **Namespace your components:** I like using the `Tabs.Trigger` dot notation. It makes it crystal clear that the component belongs to the parent.
*   **Don't over-engineer:** If a component is truly simple (like a basic button), you don't need this. Use this for complex pieces like Steppers, Modals, or Dropdowns.
*   **Handle "Out of Bounds" errors:** I always add a check inside the sub-components to throw a helpful error if they are used outside of the Parent wrapper. It saves a lot of debugging time.

### Final Thoughts

Moving to compound components was a turning point for me in writing "clean code." It stopped the prop-drilling madness and made my UI kits actually pleasant to use for other developers on the team.

It takes a little more effort to set up the Context initially, but the flexibility you get in return is worth it. Next time you find yourself adding the 10th prop to a component, stop and ask: "Should this be a compound component instead?"

Give it a shot in your next React project. You'll thank yourself later.

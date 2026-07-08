---
title: Compound Components and Inversion of Control: Building Flexible, Low-Maintenance UI Kits
date: 2026-07-08T07:31:40.012Z
description: Blog about Compound Components and Inversion of Control: Building Flexible, Low-Maintenance UI Kits
---

Hey everyone, I’m Prashuk. I spend most of my days deep in the MERN stack, trying to figure out how to build UIs that don't break the moment a designer changes their mind.

If you’ve been building React apps for a while, you’ve definitely faced the "Mega-Component" nightmare. You build a simple `Modal`, and two weeks later, it has 25 props because every page needs a slightly different version.

Today, I want to talk about how I stopped writing those messy components and started using **Compound Components** and **Inversion of Control (IoC)**.

### The "Prop-Drilling" Trap
I ran into this issue when I was building a custom Dashboard for a client. We had a `Table` component. Initially, it just showed data. Then the client wanted a search bar. Then a filter. Then a "Download PDF" button that only appeared on some pages.

My component looked like this:
`<Table data={data} showSearch={true} showFilter={false} onDownload={handleDownload} ... />`

It was a mess to maintain. Every time I wanted to change the UI layout, I had to go into the base component and move `<div>`s around, which usually broke three other pages. Honestly, it was a headache.

### What are Compound Components?
The idea is simple: instead of one giant component trying to do everything, you break it into smaller pieces that share a common state. Think of the native HTML `<select>` and `<option>` tags. You don’t pass options as an array prop to the select; you nest them.

In React, we use the Context API to make this happen. What worked for me was creating a parent component that holds the "brain" (the state) and sub-components that handle the "beauty" (the UI).

### Inversion of Control (IoC)
This is a fancy term that basically means: **Give the power back to the person using the component.**

Instead of me (the component author) deciding that the "Close" button always sits at the top right, I let the developer using the component decide where to put it. By exporting sub-components like `Modal.Header`, `Modal.CloseButton`, and `Modal.Body`, I’m no longer the bottleneck for UI changes.

### A Practical Example: The Tabs Component
In one of my projects, I had to build a tabbed interface. Usually, people pass an array of objects for tabs. But what if one tab needs a notification badge and another doesn't?

Here’s how I structured it using the Compound Component pattern:

```javascript
import React, { useState, createContext, useContext } from 'react';

const TabContext = createContext();

// The Parent
export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabContext.Provider>
  );
}

// Sub-component: The Trigger
Tabs.Trigger = function Trigger({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabContext);
  return (
    <button 
      className={`px-4 py-2 ${activeTab === value ? 'border-b-2 border-blue-500' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

// Sub-component: The Content
Tabs.Content = function Content({ value, children }) {
  const { activeTab } = useContext(TabContext);
  return activeTab === value ? <div className="p-4">{children}</div> : null;
};
```

**How you actually use it:**
```javascript
<Tabs defaultValue="profile">
  <div className="flex space-x-4 border-b">
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings ⚙️</Tabs.Trigger>
  </div>
  
  <Tabs.Content value="profile">Welcome back, Prashuk!</Tabs.Content>
  <Tabs.Content value="settings">Manage your account here.</Tabs.Content>
</Tabs>
```

### Why this is better for Performance & UI
1.  **Clean Code:** Look at that usage. It’s readable. You can see the structure of the UI just by glancing at the code.
2.  **No More Prop-Drilling:** I'm not passing "activeTab" down manually through five layers of divs.
3.  **Flexibility:** If I want to move the Tab triggers to the bottom? I just move the code. I don't have to rewrite the `Tabs` component logic.
4.  **Performance:** Since sub-components only consume the context they need, it’s easier to optimize with `React.memo` if things get heavy.

### My Best Practices
*   **Don't over-engineer:** If a component is truly simple (like a basic button), don't make it a compound component. Use this for things like Modals, Selects, Tabs, and Steppers.
*   **Use descriptive names:** Stick to the `Parent.Child` naming convention. It makes it obvious that `Tabs.Trigger` belongs to `Tabs`.
*   **Provide sensible defaults:** Even with IoC, try to make the "default" look good so the next dev doesn't have to style everything from scratch.

### Conclusion
Switching to Compound Components changed how I think about UI kits. It takes a bit more time to set up the Context and sub-components initially, but it saves hours of refactoring later. 

The biggest learning for me? **Stop trying to predict every feature request.** Build a flexible system, give control to the consumer, and keep your components lean.

Give it a shot in your next project. It’ll make your code (and your life) a lot cleaner. 

Catch you in the next one,
**Prashuk**

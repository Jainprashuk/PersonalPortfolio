---
title: Common mistakes I made while learning React and how I fixed them
date: 2026-04-03T06:14:20.993Z
description: Blog about Common mistakes I made while learning React and how I fixed them
---

Hey everyone, I’m Prashuk. 

I’ve been working with React and the MERN stack for a few years now, but looking back at my early code makes me cringe a little. We’ve all been there—trying to figure out why a component isn't re-rendering or why the browser just froze. 

I’m a big fan of clean code and smooth UI, but I didn't get it right on the first try. Most of what I know didn't come from a textbook; it came from breaking things in my own projects. 

Here are a few big mistakes I made when I was starting out and how I actually fixed them.

---

### 1. The "State Mutation" Trap
In one of my first projects—a simple task tracker—I couldn't figure out why my UI wasn't updating after I added a new task. I was doing something like this:

```javascript
const addTask = (newTask) => {
  tasks.push(newTask); // Big mistake!
  setTasks(tasks); 
};
```

I thought I was being efficient by just pushing to the array. But React doesn't know the data changed because the reference to the array stayed the same. 

**What worked for me:** 
I learned to always treat state as immutable. Using the spread operator changed everything. Now, I always create a new copy:
`setTasks([...tasks, newTask]);` 

---

### 2. Overusing `useEffect` for everything
I ran into this issue when I was building a profile page. I had about five different `useEffect` hooks watching different variables. It became a debugging nightmare. Every time one state changed, it triggered another effect, and sometimes I’d end up in an infinite loop that crashed my tab.

I realized I was using `useEffect` to calculate data that could just be calculated during the render.

**My Rule of Thumb now:** 
If you can calculate something from your existing props or state, **don't put it in a state or an effect.** Just calculate it directly in the component body. It keeps the component "pure" and way easier to read.

---

### 3. Passing Props through 5 layers (Prop Drilling)
We’ve all done it. I had a "UserAvatar" component deep inside a "Navbar" which was inside a "Layout" which was inside the "App." I was passing the `user` object through every single layer even though the middle components didn't care about it.

It made refactoring impossible. If I changed the user object structure, I had to update five files.

**How I fixed it:** 
For global stuff like themes or user sessions, I started using the Context API. For more complex state, I moved to Zustand (which I personally prefer over Redux because it’s much lighter and cleaner). It keeps your component props focused only on what that specific component needs.

---

### 4. Forgetting the Cleanup Function
I once built a real-time chat feature and noticed that after navigating away and back a few times, the app got incredibly slow. Turns out, I was setting up event listeners in `useEffect` but never removing them. I was essentially creating a "memory leak."

**Real-world fix:**
Always return a cleanup function. Whether it's a `setInterval`, a socket connection, or an event listener, clean up after yourself.

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => clearInterval(timer); // This little line saves your performance
}, []);
```

---

### 5. Using Index as a Key
In my early days, I used `index` as the `key` prop in every `.map()` function. 

`{items.map((item, index) => <li key={index}>{item}</li>)}`

This works fine for static lists. But the moment I tried to delete an item from the middle of the list, the UI started acting weird. React uses these keys to track which element is which. If you remove index 1, index 2 now becomes index 1, and React gets confused about what to re-render.

**The Fix:**
I started using unique IDs from my database (like `_id` from MongoDB) or a library like `uuid`. It’s a small change that makes the UI much more stable during animations and list updates.

---

### Best Practices I follow now:

*   **Keep components small:** If a file is over 200 lines, it's probably doing too much. Split it.
*   **Prioritize Performance:** Don't wrap everything in `memo` or `useMemo` immediately. Use them only when you actually notice a lag.
*   **Folder Structure matters:** I like to group by feature rather than just "components" and "containers." It makes finding code much faster.
*   **UI/UX is King:** Even if your code is perfect, if the button feels "laggy" or the layout shifts, users won't like it. Focus on the feel.

### Conclusion
Mistakes are basically the only way to actually learn React. You can watch all the tutorials in the world, but until you spend three hours debugging a `null` pointer or a re-render loop, it doesn't really stick.

The goal isn't to write perfect code on day one; it's to write code that’s easy to change when you realize you messed up. 

Keep building, keep breaking things. If you have any questions about how I handle state or structure my MERN projects, feel free to reach out!

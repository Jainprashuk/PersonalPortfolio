---
title: Advanced TanStack Query: Handling Complex Cache Invalidation and Optimistic UI Updates
date: 2026-06-03T09:56:36.519Z
description: Blog about Advanced TanStack Query: Handling Complex Cache Invalidation and Optimistic UI Updates
---

Hey everyone, I’m Prashuk. If you’ve been building with React for a while, you’ve probably used TanStack Query (React Query). It’s a lifesaver for fetching data, but things get messy once you move past simple "fetch and show" logic.

In my experience, the real challenge isn't getting data—it's managing it when things change. I’m big on performance and clean UI, and nothing ruins a user experience like a "loading spinner" appearing every time someone clicks a button.

Today, I want to talk about how I handle complex cache invalidation and Optimistic UI.

### 1. The Problem with Over-Invalidating
When I first started using TanStack Query, I’d just call `queryClient.invalidateQueries(['todos'])` after every single mutation. It worked, but it felt lazy.

In one of my recent projects—a large-scale project management dashboard—invalidating the entire list every time a user toggled a checkbox caused a noticeable lag. The app would refetch a massive JSON payload, the UI would flicker, and if the network was slow, it just felt janky. 

What worked for me was moving away from "nuclear" invalidation and being more surgical with the cache.

### 2. Why I Love Optimistic UI
I’m a stickler for UI. I want the app to feel instant. Optimistic UI is when you update the screen *before* the server even responds. If the server fails? You just roll back.

I ran into this issue when building a "Like" button for a social feed. If I waited for the API response, there was a 300ms delay where nothing happened. Users would click twice thinking it didn't work. By implementing an optimistic update, the heart turned red instantly. It makes the app feel premium.

### 3. Handling the "Rollback" Logic
The trickiest part of Optimistic UI isn't the update—it's the error handling. You have to "snapshot" the previous state so you can revert to it if the API hits a 500 error.

Here is a pattern I use in my projects. It’s clean, handles the UI update immediately, and cleans up after itself.

```javascript
const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: updateTaskStatus,
  // 1. When mutate is called:
  onMutate: async (newTask) => {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ['tasks', newTask.id] });

    // Snapshot the previous value
    const previousTask = queryClient.getQueryData(['tasks', newTask.id]);

    // Optimistically update to the new value
    queryClient.setQueryData(['tasks', newTask.id], newTask);

    // Return a context object with the snapshotted value
    return { previousTask };
  },
  // 2. If the mutation fails:
  onError: (err, newTask, context) => {
    queryClient.setQueryData(['tasks', newTask.id], context.previousTask);
    console.error("Update failed, rolling back!");
  },
  // 3. Always refetch after error or success to sync with server
  onSettled: (newTask) => {
    queryClient.invalidateQueries({ queryKey: ['tasks', newTask.id] });
  },
});
```

### 4. Surgical Cache Invalidation
Sometimes, you don't want to refetch everything. If you have a list and you edit one item, you don't need to reload the whole list. You can use `queryClient.setQueryData` inside your `onSuccess` to find that one item in the list and update it manually.

I honestly used to think this was overkill, but when you're dealing with paginated data or infinite scrolls, refetching the whole thing just to change one status field is a performance killer. Keeping your cache clean manually is a bit more code, but the performance gains are worth it.

### 5. My Personal Best Practices
Over the last few projects, I've developed a few "rules" for myself:

*   **Don't over-cache:** If data changes every second (like a stock price), don't bother with complex invalidation. Just use a short `staleTime`.
*   **Unique Keys Matter:** Be very specific with your query keys. Instead of `['tasks']`, use `['tasks', { status: 'completed' }]`. It makes invalidation way easier.
*   **The "User First" Rule:** If an action takes more than 200ms, use an optimistic update. If it's lightning-fast, a simple loading state is fine. Don't over-engineer.

### Conclusion
TanStack Query is powerful, but you have to treat the cache like a local database, not just a temporary storage for API responses. By using `onMutate` for snappy UIs and being careful about how you invalidate queries, you can build apps that feel incredibly fast.

What worked for me was failing a few times—seeing the UI flicker or data get out of sync—and then realizing that the `context` object in `onMutate` is actually your best friend.

Happy coding! If you've got a better way of handling nested cache updates, let me know. I’m always looking to clean up my implementation.

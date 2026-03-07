---
title: React: Singletons aren't as evil as you think
date: 2026-03-07T14:46:40.788Z
description: Blog about React: Singletons aren't as evil as you think
---

# React: Singletons aren't as evil as you think
As a software developer, you've likely heard that singletons are an anti-pattern that should be avoided at all costs. However, in the context of React applications, singletons can be a useful tool for managing global state and providing a centralized point of access to shared resources. In this post, we'll explore the role of singletons in React and discuss how they can be used effectively.

## What are Singletons?
A singleton is a design pattern that restricts a class from instantiating multiple objects. It creates a single instance of a class and provides a global point of access to that instance. In the context of React, a singleton can be used to manage global state, such as user authentication or application configuration.

## Benefits of Singletons in React
Singletons can provide several benefits in React applications, including:
* **Global state management**: Singletons can be used to manage global state that needs to be accessed by multiple components.
* **Centralized resource management**: Singletons can provide a centralized point of access to shared resources, such as APIs or databases.
* **Improved performance**: By reducing the number of instances of a class, singletons can improve performance by reducing memory usage and minimizing the number of objects that need to be garbage collected.

Here's an example of a singleton in JavaScript:
```javascript
class Singleton {
  static instance;

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  constructor() {
    if (Singleton.instance) {
      throw new Error('Singleton instance already exists');
    }
  }

  getSharedResource() {
    // Return a shared resource, such as an API client
    return 'Shared resource';
  }
}

// Usage
const singletonInstance = Singleton.getInstance();
const sharedResource = singletonInstance.getSharedResource();
console.log(sharedResource); // Output: Shared resource
```

## Real-World Use Cases
Singletons have several real-world use cases in React applications, including:
* **User authentication**: A singleton can be used to manage user authentication state and provide a centralized point of access to authentication-related functionality.
* **API clients**: A singleton can be used to provide a centralized point of access to API clients, reducing the need for multiple instances of API clients throughout the application.
* **Configuration management**: A singleton can be used to manage application configuration and provide a centralized point of access to configuration data.

Some best practices to keep in mind when using singletons in React include:
* **Use singletons sparingly**: Singletons should be used only when necessary, as they can make code harder to test and debug.
* **Use dependency injection**: Instead of using singletons to provide dependencies to components, consider using dependency injection to provide dependencies explicitly.
* **Avoid overusing singletons**: Avoid using singletons to manage complex state or provide multiple services, as this can lead to tight coupling and make code harder to maintain.

## Conclusion
In conclusion, singletons aren't as evil as you think. When used correctly, singletons can be a useful tool for managing global state and providing a centralized point of access to shared resources in React applications. By understanding the benefits and drawbacks of singletons and using them sparingly, you can write more effective and maintainable code. Remember to follow best practices, such as using dependency injection and avoiding overusing singletons, to get the most out of this design pattern. With careful consideration and proper usage, singletons can be a valuable addition to your React toolkit.

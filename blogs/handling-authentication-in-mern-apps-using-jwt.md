---
title: Handling authentication in MERN apps using JWT
date: 2026-04-04T06:01:43.455Z
description: Blog about Handling authentication in MERN apps using JWT
---

Hey everyone! Prashuk here. 

If you’ve ever built a MERN app, you know that authentication is usually the first big hurdle you hit. I remember when I first started, I spent days trying to wrap my head around sessions vs. tokens. Honestly? Theory is great, but once you’re actually building a dashboard or a SaaS product, you just want something that’s secure, scalable, and doesn’t break your frontend state management.

For me, JWT (JSON Web Tokens) has always been the way to go. It’s simple, it’s stateless, and it works perfectly with the React/Node ecosystem. 

Here is how I actually handle auth in my projects—skipping the fluff and focusing on what works.

### 1. The "Where do I store the token?" debate
This is where everyone gets stuck. In one of my early projects, I just threw the JWT into `localStorage` because it was easy. I could just grab it whenever I needed to make an Axios call. 

But I ran into an issue when I started looking into XSS (Cross-Site Scripting). If a malicious script runs on your site, it can literally just read your `localStorage` and steal the user's session. Not good.

**What worked for me was** switching to **HttpOnly Cookies**. You send the token from the backend, and the browser stores it automatically. The best part? JavaScript can’t touch it, which makes it way more secure.

### 2. The Backend Login Logic
When a user logs in, I don’t just check the password. I make sure the whole process is clean. I use `bcryptjs` for hashing (obviously) and `jsonwebtoken` for the sign-in.

One thing I always do is keep the payload slim. Don't put the whole user object in the JWT. Just the `userId`. It keeps the token small and improves performance.

```javascript
// A quick look at how I structure the login controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Setting it as an HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only over HTTPS in prod
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ _id: user._id, name: user.name, email: user.email });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
```

### 3. Handling the "Flash of Unauthenticated Content"
We’ve all seen it: you refresh a page, and for a split second, you see the "Login" button before the app realizes you're actually logged in. It looks unprofessional.

To fix this, I always use a `loading` state in my AuthContext. While the frontend is checking the backend to see if a valid cookie exists, I show a clean loading spinner or a skeleton screen. It keeps the UI feeling solid.

### 4. Axios Interceptors are a lifesaver
In a real-world app, you have dozens of API calls. You don't want to manually check for 401 (Unauthorized) errors in every single component. 

What I do is set up an **Axios Interceptor**. If the backend sends back a 401 because the token expired, the interceptor catches it, clears the user state, and redirects them to the login page automatically. It keeps the code clean and centralized.

### 5. My Personal Best Practices
Over a few projects, I've developed a bit of a checklist for auth:
*   **Don't ignore expiration:** Set a reasonable expiration time. Don't leave tokens active forever.
*   **Environment Variables:** Never, ever hardcode your `JWT_SECRET`. I made that mistake once in a test repo and learned my lesson.
*   **Validation Middleware:** Create a simple `protect` middleware for your Express routes. It keeps your controllers focused on logic, not auth checks.
*   **Clean Code:** Keep your auth logic in a separate folder. It’s easier to debug when your login flow isn’t mixed in with your product routes.

### Conclusion
Authentication doesn't have to be a nightmare. Once you move away from just "making it work" to "making it secure and clean," your whole development experience changes. Using HttpOnly cookies and Axios interceptors changed the game for me in terms of both security and UI/UX.

The biggest thing I've learned? **Don't overcomplicate it.** Start with a solid JWT flow, secure your cookies, and handle your loading states. 

If you're working on a MERN app right now, try moving your tokens from localStorage to cookies—it's a small change that makes a huge difference.

Happy coding!

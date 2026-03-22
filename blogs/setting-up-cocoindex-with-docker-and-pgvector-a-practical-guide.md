---
title: Setting Up CocoIndex with Docker and pgvector - A Practical Guide
date: 2026-03-22T12:44:12.259Z
description: Blog about Setting Up CocoIndex with Docker and pgvector - A Practical Guide
---

Hey everyone, I’m Prashuk. I’m a Software Engineer who spends most of my time in the React and Next.js world, but lately, I’ve been diving deep into how we handle data for AI-driven apps. I’m a big fan of clean code and smooth UIs, but none of that matters if your backend and database setup is a mess.

Today, I want to talk about getting CocoIndex up and running with `pgvector` using Docker. No fluff, just the stuff that actually works in production.

### Why I stopped using managed vector DBs
In one of my recent projects, I started with a fully managed vector database service. It was fine at first, but as soon as we started scaling, the costs went up, and I felt like I was losing control over my data. 

I wanted something I could host myself, keep close to my application, and not worry about extra API latency. That’s when I turned to `pgvector`. Since most of my MERN stack projects already use PostgreSQL, it just made sense to keep the vectors in the same ecosystem.

### The "Dependency Hell" I ran into
I’ll be honest: trying to install `pgvector` directly on a local machine is a headache you don't need. You have to match versions, compile extensions, and it almost always breaks something else.

What worked for me was moving everything into Docker right from the start. It keeps the environment isolated. If I mess up the config, I just kill the container and start over. It’s cleaner, and it ensures that what works on my MacBook will actually work when I push it to the server.

### The Practical Setup (Docker-Compose)
Here is the exact `docker-compose.yml` structure I use. It spins up a Postgres instance with the `pgvector` extension pre-installed and hooks it up to CocoIndex.

```yaml
version: '3.8'

services:
  db:
    image: ankane/pgvector:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: prashuk_admin
      POSTGRES_PASSWORD: mysecurepassword
      POSTGRES_DB: vector_store
    volumes:
      - pgdata:/var/lib/postgresql/data

  cocoindex:
    image: cocoindex/cocoindex:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://prashuk_admin:mysecurepassword@db:5432/vector_store
    depends_on:
      - db

volumes:
  pgdata:
```

**Pro tip:** I used the `ankane/pgvector` image because it’s lightweight and handles the extension setup automatically. One less thing for me to worry about.

### Connecting CocoIndex to the real world
Once the containers are up, the magic happens in how CocoIndex talks to your data. In my experience, the biggest mistake people make is not indexing their vectors properly. 

When I was building a search feature for a documentation tool, the queries were taking 2-3 seconds. That’s a UI killer. I realized I hadn't set up an HNSW index in Postgres. CocoIndex handles the ingestion, but you need to make sure your database is ready to search through those embeddings fast.

I always check the logs to ensure CocoIndex is successfully mapping the unstructured data. If the connection string is wrong (usually because of Docker networking issues), it’ll fail silently or loop. Always check your container logs first.

### Performance and UI: My Two Cents
Even though this is a "backend" setup, I always think about the frontend. 
*   **Latency matters:** If your vector search is slow, your React app feels laggy. Use a loading state that doesn't jump around.
*   **Clean Data:** Don't just dump everything into CocoIndex. Clean your data before indexing. It saves storage and improves search accuracy.
*   **Resource Limits:** Docker can be a memory hog. If you're running this on a small VPS, limit the memory for the DB container so it doesn't crash your whole server.

### Best Practices I follow
*   **Version Control your Config:** Always keep your Docker files in your repo.
*   **Health Checks:** Add health checks to your Docker Compose so CocoIndex doesn't try to connect before Postgres is fully ready.
*   **Secrets Management:** Never hardcode your DB passwords (like I did in the example above for simplicity). Use `.env` files.

### Final Thoughts
Setting up CocoIndex with `pgvector` via Docker is probably the most practical way to handle embeddings for a MERN or Next.js app right now. It gives you the power of AI search without the complexity of a 10-step manual installation.

The biggest thing I learned? Don't overcomplicate your stack. Use tools that play well together, and keep your environment reproducible.

If you run into any issues with the Docker networking or the vector types, hit me up. I’ve probably broken it and fixed it at least once. Happy coding!

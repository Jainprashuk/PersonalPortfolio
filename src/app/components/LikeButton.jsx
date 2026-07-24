"use client";

import { useEffect, useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { BACKEND_URL } from "../lib/backend";

const likedKey = (slug) => `blog-like:${slug}`;

/**
 * Like toggle backed by the Portfolio_Backend like counter.
 * - `slug`: post slug (required)
 * - `initialCount`: optional starting count (list page passes it to avoid N fetches)
 * The device's own like state lives in localStorage so a refresh keeps the heart
 * filled; the server just tracks the running total.
 */
export default function LikeButton({ slug, initialCount = null, className = "" }) {
  const [count, setCount] = useState(initialCount ?? 0);
  const [liked, setLiked] = useState(false);
  const [ready, setReady] = useState(initialCount !== null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(likedKey(slug)) === "1");
    } catch {
      /* localStorage unavailable */
    }

    // Fetch the current count if the parent didn't provide one.
    if (initialCount === null) {
      let cancelled = false;
      fetch(`${BACKEND_URL}/likes/${encodeURIComponent(slug)}`)
        .then((r) => r.json())
        .then((d) => {
          if (!cancelled && typeof d.count === "number") setCount(d.count);
        })
        .catch(() => {})
        .finally(() => !cancelled && setReady(true));
      return () => {
        cancelled = true;
      };
    }
  }, [slug, initialCount]);

  async function toggle(e) {
    // Guard against triggering a parent link/card navigation.
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    const next = !liked;
    setBusy(true);
    // Optimistic UI.
    setLiked(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    try {
      localStorage.setItem(likedKey(slug), next ? "1" : "0");
    } catch {
      /* ignore */
    }

    try {
      const res = await fetch(`${BACKEND_URL}/likes/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: next }),
      });
      const data = await res.json();
      if (typeof data.count === "number") setCount(data.count);
    } catch {
      // Roll back on failure.
      setLiked(!next);
      setCount((c) => Math.max(0, c + (next ? -1 : 1)));
      try {
        localStorage.setItem(likedKey(slug), !next ? "1" : "0");
      } catch {
        /* ignore */
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      title={liked ? "Unlike" : "Like"}
      className={`inline-flex items-center gap-1.5 text-sm transition-colors disabled:opacity-60 ${
        liked ? "text-pink-500" : "text-gray-400 dark:text-gray-600 hover:text-pink-500"
      } ${className}`}
    >
      {liked ? (
        <HeartSolid className="h-4 w-4" />
      ) : (
        <HeartOutline className="h-4 w-4" />
      )}
      <span className="tabular-nums">{ready || initialCount !== null ? count : "…"}</span>
    </button>
  );
}

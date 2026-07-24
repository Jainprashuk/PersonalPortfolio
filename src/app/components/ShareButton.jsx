"use client";

import { useEffect, useRef, useState } from "react";
import {
  ShareIcon,
  LinkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

/**
 * Share control.
 * - On devices with the Web Share API (mobile), opens the native share sheet.
 * - Otherwise opens a small menu: copy link + X / LinkedIn / WhatsApp.
 * `url` defaults to the current page; the list cards pass an explicit post URL.
 */
export default function ShareButton({ title = "", url = null, className = "" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const resolveUrl = () => {
    if (typeof window === "undefined") return url || "";
    if (!url) return window.location.href;
    // Allow callers (list cards) to pass a relative path.
    return url.startsWith("/") ? window.location.origin + url : url;
  };

  async function onShare(e) {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = resolveUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        /* user cancelled or unsupported — fall back to the menu */
      }
    }
    setOpen((o) => !o);
  }

  async function copy(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(resolveUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const shareUrl = resolveUrl();
  const enc = encodeURIComponent;
  const targets = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(shareUrl)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${shareUrl}`)}` },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <button
        onClick={onShare}
        aria-label="Share this post"
        title="Share"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-600 hover:text-secondary-400 transition-colors"
      >
        <ShareIcon className="h-4 w-4" />
        Share
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-zinc-800 dark:border-gray-200 bg-zinc-900 dark:bg-white p-1 shadow-lg">
          <button
            onClick={copy}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-200 dark:text-gray-800 hover:bg-zinc-800 dark:hover:bg-gray-100"
          >
            {copied ? <CheckIcon className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          {targets.map((t) => (
            <a
              key={t.label}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-200 dark:text-gray-800 hover:bg-zinc-800 dark:hover:bg-gray-100"
            >
              Share to {t.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

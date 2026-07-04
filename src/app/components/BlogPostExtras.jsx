"use client";

import { useEffect, useState } from "react";
import { LinkIcon, CheckIcon } from "@heroicons/react/24/outline";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary-400 to-secondary-600 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-600 hover:text-secondary-400 transition-colors"
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4" /> Copied
        </>
      ) : (
        <>
          <LinkIcon className="h-4 w-4" /> Copy link
        </>
      )}
    </button>
  );
}

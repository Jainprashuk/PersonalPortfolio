"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, ClockIcon, CalendarIcon, SparklesIcon } from "@heroicons/react/24/outline";

const PAGE_SIZE = 9;

function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function BlogCard({ blog, featured = false }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 dark:border-gray-200 bg-zinc-900 dark:bg-gray-100 p-6 transition hover:border-secondary-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-secondary-500/10 ${
        featured ? "sm:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-600 mb-3">
          {blog.date && (
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              {formatDate(blog.date)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5" />
            {blog.readTime} min read
          </span>
        </div>

        <h2
          className={`font-semibold mb-2 capitalize text-white dark:text-gray-900 group-hover:text-secondary-400 transition-colors ${
            featured ? "text-2xl" : "text-lg"
          }`}
        >
          {blog.title}
        </h2>

        <p className="text-gray-400 dark:text-gray-600 text-sm line-clamp-3">
          {blog.description}
        </p>
      </div>

      <div className="mt-4 inline-flex items-center gap-1 text-pink-400 dark:text-pink-500 text-sm font-medium">
        Read Article
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}

export default function BlogList({ blogs }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }, [blogs, query]);

  const showFeatured = !query && page === 1 && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;

  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const paged = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative mb-10 max-w-md mx-auto">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search posts..."
          className="w-full rounded-full bg-zinc-900 dark:bg-gray-100 border border-zinc-800 dark:border-gray-200 pl-10 pr-4 py-2.5 text-sm text-white dark:text-gray-900 placeholder-gray-500 focus:outline-none focus:border-secondary-500 transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400 dark:text-gray-600">
          <SparklesIcon className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p>No posts match &ldquo;{query}&rdquo;.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={query + page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured && <BlogCard blog={featured} featured />}
              {paged.map((blog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full text-sm border border-zinc-800 dark:border-gray-200 text-white dark:text-gray-900 disabled:opacity-30 hover:border-secondary-500 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400 dark:text-gray-600 px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-full text-sm border border-zinc-800 dark:border-gray-200 text-white dark:text-gray-900 disabled:opacity-30 hover:border-secondary-500 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

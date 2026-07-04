import fs from "fs";
import path from "path";
import Link from "next/link";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import { ReadingProgress, CopyLinkButton } from "../../components/BlogPostExtras";
import { safeMatter, estimateReadTime } from "../../lib/blog";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "About", path: "/#about" },
  { title: "Projects", path: "/#projects" },
  { title: "Achievements", path: "/#achievements" },
  { title: "Blogs", path: "/blog" },
];

export default function BlogPost({ params }) {

  const blogDir = path.join(process.cwd(), "blogs");
  const filePath = path.join(blogDir, `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { content, data } = safeMatter(fileContent, params.slug);
  const readTime = estimateReadTime(content);

  const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));
  const ordered = files
    .map((file) => {
      const slug = file.replace(".md", "");
      const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
      const { data } = safeMatter(raw, slug);
      return { slug, title: data.title || slug.replaceAll("-", " "), date: data.date || null };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const currentIndex = ordered.findIndex((b) => b.slug === params.slug);
  const newer = currentIndex > 0 ? ordered[currentIndex - 1] : null;
  const older = currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : null;

  return (
    <>
      <ReadingProgress />
      <Navbar navLinks={navLinks} />

      <div className="min-h-screen bg-black dark:bg-white text-white dark:text-gray-900 px-6 py-24">

        <div className="max-w-3xl mx-auto">

          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-pink-400 hover:text-pink-500 mb-6"
          >
            ← Back to Blogs
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {data.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-400 dark:text-gray-600 mb-8 text-sm">
            {data.date && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                {new Date(data.date).toDateString()}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              {readTime} min read
            </span>
            <CopyLinkButton />
          </div>

          <div className="h-px bg-zinc-800 dark:bg-gray-200 mb-10"></div>

          <MarkdownRenderer content={content} />

          {(newer || older) && (
            <div className="mt-16 pt-8 border-t border-zinc-800 dark:border-gray-200 grid sm:grid-cols-2 gap-4">
              {older ? (
                <Link
                  href={`/blog/${older.slug}`}
                  className="group rounded-xl border border-zinc-800 dark:border-gray-200 bg-zinc-900 dark:bg-gray-100 p-5 hover:border-secondary-500 transition"
                >
                  <div className="text-xs text-gray-500 mb-1">← Older</div>
                  <div className="font-medium capitalize group-hover:text-secondary-400 transition-colors">
                    {older.title}
                  </div>
                </Link>
              ) : <div />}

              {newer ? (
                <Link
                  href={`/blog/${newer.slug}`}
                  className="group rounded-xl border border-zinc-800 dark:border-gray-200 bg-zinc-900 dark:bg-gray-100 p-5 text-right hover:border-secondary-500 transition sm:col-start-2"
                >
                  <div className="text-xs text-gray-500 mb-1">Newer →</div>
                  <div className="font-medium capitalize group-hover:text-secondary-400 transition-colors">
                    {newer.title}
                  </div>
                </Link>
              ) : <div />}
            </div>
          )}

        </div>

      </div>

      <Footer />
    </>
  );
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import MarkdownRenderer from "../../components/MarkdownRenderer";

export default function BlogPost({ params }) {

  const filePath = path.join(process.cwd(), "blogs", `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { content, data } = matter(fileContent);

  return (

    <div className="min-h-screen bg-black dark:bg-white text-white dark:text-gray-900 px-6 py-20">

      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-pink-400 hover:text-pink-500 mb-6"
        >
          ← Back to Blogs
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          {data.title}
        </h1>

        {/* Date */}
        <p className="text-gray-400 dark:text-gray-600 mb-6 text-sm">
          {new Date(data.date).toDateString()}
        </p>

        {/* Divider */}
        <div className="h-px bg-zinc-800 dark:bg-gray-200 mb-10"></div>

        {/* Blog Content */}
        <MarkdownRenderer content={content} />

      </div>

    </div>

  );
}
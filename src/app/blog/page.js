import fs from "fs";
import path from "path";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogList from "../components/BlogList";
import { safeMatter, estimateReadTime } from "../lib/blog";

export default function BlogPage() {

  const blogDir = path.join(process.cwd(), "blogs");

  // blogs/ may be missing (only .gitkeep) once every post has moved to drafts/.
  // Guard readdirSync so the production build doesn't crash on an empty dir.
  const files = fs.existsSync(blogDir)
    ? fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"))
    : [];

  const blogs = files.map((file) => {
    const slug = file.replace(".md", "");
    const fileContent = fs.readFileSync(path.join(blogDir, file), "utf-8");
    const { content, data } = safeMatter(fileContent, slug);

    return {
      slug,
      title: data.title || slug.replaceAll("-", " "),
      description: data.description || `Read this developer blog about ${slug.replaceAll("-", " ")}`,
      date: data.date || null,
      readTime: estimateReadTime(content),
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/#about" },
    { title: "Projects", path: "/#projects" },
    { title: "Achievements", path: "/#achievements" },
    { title: "Blogs", path: "/blog" },
  ];

  return (
    <>
      <Navbar navLinks={navLinks} />

      <div className="min-h-screen bg-black dark:bg-white text-white dark:text-gray-900 px-6 sm:px-8 py-24">

        <div className="max-w-6xl mx-auto mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
              The Blog
            </span>
          </h1>
          <p className="text-[#ADB7BE] dark:text-gray-600 max-w-2xl mx-auto">
            {blogs.length === 0
              ? "A running log of developer notes on software engineering and the latest happenings in tech — fresh posts are on the way."
              : `A running log of developer notes on software engineering and the latest happenings in tech — ${blogs.length} ${blogs.length === 1 ? "post" : "posts"} and counting.`}
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center rounded-2xl border border-zinc-800 dark:border-gray-200 bg-zinc-900/40 dark:bg-gray-100 px-6 py-16">
            <h2 className="text-2xl font-semibold mb-2">No posts published yet</h2>
            <p className="text-[#ADB7BE] dark:text-gray-600">
              New writing is being drafted and reviewed. Check back soon.
            </p>
          </div>
        ) : (
          <BlogList blogs={blogs} />
        )}

      </div>

      <Footer />
    </>
  );
}

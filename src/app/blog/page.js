import fs from "fs";
import path from "path";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogList from "../components/BlogList";
import { safeMatter, estimateReadTime } from "../lib/blog";

export default function BlogPage() {

  const blogDir = path.join(process.cwd(), "blogs");

  const files = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"));

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
            A running log of developer notes on software engineering and the latest happenings
            in tech &mdash; {blogs.length} {blogs.length === 1 ? "post" : "posts"} and counting.
          </p>
        </div>

        <BlogList blogs={blogs} />

      </div>

      <Footer />
    </>
  );
}

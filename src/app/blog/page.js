import fs from "fs";
import path from "path";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function BlogPage() {

  const blogDir = path.join(process.cwd(),"blogs");

  const files = fs.readdirSync(blogDir);

  const blogs = files.map(file => ({
    slug: file.replace(".md",""),
  }));

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

      <div className="min-h-screen bg-black dark:bg-white text-white dark:text-gray-900 px-8 py-20 mt-6">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {blogs.map((blog) => (

            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="bg-zinc-900 dark:bg-gray-100 hover:bg-zinc-800 dark:hover:bg-gray-200 transition rounded-xl p-6 border border-zinc-800 dark:border-gray-200 hover:border-pink-500"
            >

              <h2 className="text-xl font-semibold mb-3 capitalize">
                {blog.slug.replaceAll("-", " ")}
              </h2>

              <p className="text-gray-400 dark:text-gray-600 text-sm">
                Read this developer blog about {blog.slug.replaceAll("-", " ")}
              </p>

              <div className="mt-4 text-pink-400 dark:text-pink-500 text-sm">
                Read Article →
              </div>

            </Link>

          ))}

        </div>

      </div>
    </>
  );
}
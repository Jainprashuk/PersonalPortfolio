import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogList from "../components/BlogList";
import { BACKEND_URL } from "../lib/backend";

// Posts live in the backend (MongoDB) now, so this page is dynamic.
export const dynamic = "force-dynamic";

async function getPublishedPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/posts`, { cache: "no-store" });
    if (!res.ok) return [];
    const posts = await res.json();
    return Array.isArray(posts) ? posts : [];
  } catch {
    // Backend unreachable — render an empty state rather than crashing the build.
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  const blogs = posts.map((p) => ({
    slug: p.slug,
    title: p.title || p.slug?.replaceAll("-", " "),
    description:
      p.description ||
      `Read this developer blog about ${p.slug?.replaceAll("-", " ")}`,
    date: p.date || null,
    readTime: p.readTime || 1,
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

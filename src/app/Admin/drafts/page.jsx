import path from "path";
import { notFound } from "next/navigation";
import { isDev, listDrafts, DRAFT_DIR } from "../../lib/drafts";
import DraftsReview from "./DraftsReview";

// This page writes to disk via its API routes, so it only exists in development.
// In a production build NODE_ENV === "production" and this 404s.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Draft review",
  robots: { index: false, follow: false },
};

export default function AdminDraftsPage() {
  if (!isDev()) {
    notFound();
  }

  const drafts = listDrafts().map((d) => ({
    ...d,
    filePath: path.join(DRAFT_DIR, `${d.slug}.md`),
  }));

  return (
    <div className="min-h-screen bg-black text-white px-6 sm:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-pink-400 mb-2">
            Development only
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
              Draft review
            </span>
          </h1>
          <p className="text-[#ADB7BE] text-sm">
            {drafts.length === 0
              ? "No drafts in drafts/."
              : `${drafts.length} draft${drafts.length === 1 ? "" : "s"} awaiting review. Approving moves a file into blogs/ and flips its status to published.`}
          </p>
        </header>

        <DraftsReview initialDrafts={drafts} />
      </div>
    </div>
  );
}

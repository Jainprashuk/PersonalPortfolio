"use client";

import { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import MarkdownRenderer from "../../components/MarkdownRenderer";

function formatDate(date) {
  if (!date) return "no date";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function GitCommands({ commands }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-lg bg-black border border-zinc-700 p-3 text-xs text-green-300">
      {commands.join("\n")}
    </pre>
  );
}

function DraftCard({ draft, onDone }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [blockers, setBlockers] = useState(draft.markers || []);
  const [confirmOverride, setConfirmOverride] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [result, setResult] = useState(null); // { kind: 'approved'|'deleted', title, gitCommands, forced }

  const hasMarkers = (draft.markerCount || 0) > 0;
  const parseBroken = Boolean(draft.parseError);

  async function approve(force) {
    setBusy(true);
    setError(null);
    const { status, data } = await postJSON("/api/admin/drafts/approve", {
      slug: draft.slug,
      force,
    });
    setBusy(false);
    if (status === 200 && data.ok) {
      setResult({ kind: "approved", title: data.title, gitCommands: data.gitCommands, forced: data.forced });
      return;
    }
    if (data.code === "markers") {
      setBlockers(data.blockers || []);
      setConfirmOverride(true);
      setError(`${data.error} Publishing is blocked until these are resolved.`);
      return;
    }
    setError(data.error || `Approve failed (HTTP ${status}).`);
  }

  async function del() {
    setBusy(true);
    setError(null);
    const { status, data } = await postJSON("/api/admin/drafts/delete", { slug: draft.slug });
    setBusy(false);
    if (status === 200 && data.ok) {
      setResult({ kind: "deleted", gitCommands: data.gitCommands });
      return;
    }
    setError(data.error || `Delete failed (HTTP ${status}).`);
  }

  if (result) {
    return (
      <div className="rounded-xl border border-green-800/60 bg-green-950/20 p-5">
        <div className="flex items-center gap-2 text-green-400 font-medium">
          <CheckCircleIcon className="h-5 w-5" />
          {result.kind === "approved"
            ? `Published${result.forced ? " (override — markers were present)" : ""}: ${result.title}`
            : `Deleted draft: ${draft.slug}`}
        </div>
        <p className="mt-2 text-sm text-[#ADB7BE]">
          Nothing is committed yet. Run these to persist the change (I won&apos;t run git for you):
        </p>
        <GitCommands commands={result.gitCommands} />
        <button
          onClick={() => onDone(draft.slug)}
          className="mt-3 text-sm text-pink-400 hover:text-pink-300"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-white capitalize break-words">{draft.title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              {formatDate(draft.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <DocumentTextIcon className="h-3.5 w-3.5" />
              {draft.words} words
            </span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {draft.readTime} min read
            </span>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
              {draft.status || "no status"}
            </span>
            {draft.aiAssisted ? (
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                ai-assisted
              </span>
            ) : null}
          </div>
        </div>

        <code className="text-[11px] text-gray-500 break-all">{draft.slug}.md</code>
      </div>

      {/* Blocking flags */}
      {parseBroken && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-800/60 bg-red-950/30 p-3 text-sm text-red-300">
          <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-medium">Frontmatter does not parse.</div>
            <div className="text-red-400/80 text-xs mt-0.5">{draft.parseError}</div>
          </div>
        </div>
      )}

      {hasMarkers && (
        <div className="mt-3 rounded-lg border border-amber-700/60 bg-amber-950/30 p-3 text-sm text-amber-300">
          <div className="flex items-center gap-2 font-medium">
            <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
            {draft.markerCount} unresolved [AUTHOR:] marker{draft.markerCount === 1 ? "" : "s"}
          </div>
          <ul className="mt-2 space-y-1 text-xs text-amber-200/90">
            {(blockers.length ? blockers : draft.markers).map((m, i) => (
              <li key={i}>
                <code className="break-all">{m}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-red-800/60 bg-red-950/30 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => approve(false)}
          disabled={busy || parseBroken || hasMarkers}
          title={
            parseBroken
              ? "Fix the frontmatter first"
              : hasMarkers
              ? "Resolve [AUTHOR:] markers first (or use the override below)"
              : "Approve & publish"
          }
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary-400 to-secondary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          <CheckCircleIcon className="h-4 w-4" />
          Approve &amp; Publish
        </button>

        {confirmDelete ? (
          <span className="inline-flex items-center gap-2 text-sm text-red-300">
            Delete this draft?
            <button
              onClick={del}
              disabled={busy}
              className="rounded-full bg-red-600 px-3 py-1.5 text-white text-sm hover:bg-red-500 disabled:opacity-40"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:border-zinc-500"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:border-red-600 hover:text-red-300 transition disabled:opacity-40"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        )}

        <a
          href={`vscode://file${draft.filePath}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:border-secondary-500 transition"
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          Open in editor
        </a>

        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:border-secondary-500 transition"
        >
          {open ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          {open ? "Hide preview" : "Preview"}
        </button>
      </div>

      {/* Deliberate override for markers — second, clearly separate action */}
      {hasMarkers && confirmOverride && (
        <div className="mt-3 rounded-lg border border-amber-700/60 bg-amber-950/20 p-3">
          <p className="text-sm text-amber-200">
            Override: publish with {draft.markerCount} unresolved marker{draft.markerCount === 1 ? "" : "s"} still in the text.
          </p>
          <button
            onClick={() => approve(true)}
            disabled={busy}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-500 px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/10 transition disabled:opacity-40"
          >
            <ExclamationTriangleIcon className="h-4 w-4" />
            Publish anyway
          </button>
        </div>
      )}

      {open && (
        <div className="mt-4 rounded-lg border border-zinc-800 bg-black/40 p-5">
          <MarkdownRenderer content={draft.content} />
        </div>
      )}
    </div>
  );
}

export default function DraftsReview({ initialDrafts }) {
  const [drafts, setDrafts] = useState(initialDrafts);

  function handleDone(slug) {
    setDrafts((list) => list.filter((d) => d.slug !== slug));
  }

  if (drafts.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-16 text-center text-[#ADB7BE]">
        Nothing to review. Generated posts land in <code>drafts/</code>.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {drafts.map((draft) => (
        <DraftCard key={draft.slug} draft={draft} onDone={handleDone} />
      ))}
    </div>
  );
}

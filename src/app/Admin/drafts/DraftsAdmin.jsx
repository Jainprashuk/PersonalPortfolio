"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import { BACKEND_URL } from "../../lib/backend";

const TOKEN_KEY = "admin-token";

function readTimeOf(content) {
  const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
  return { words, readTime: Math.max(1, Math.round(words / 200)) };
}
const markersOf = (content) => (content || "").match(/\[AUTHOR:[^\]]*\]/g) || [];
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "no date";

// ---------- Login ----------

function Login({ onAuthed }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        try { localStorage.setItem(TOKEN_KEY, data.token); } catch { /* ignore */ }
        onAuthed(data.token);
        return;
      }
      setErr(data.error || "Incorrect password.");
    } catch {
      setErr("Login failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-widest text-pink-400 mb-2">Admin</p>
        <h1 className="text-3xl font-extrabold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
            Draft review
          </span>
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Admin password</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-secondary-500"
            />
          </div>

          {err && <p className="text-xs text-red-400">{err}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gradient-to-r from-primary-400 to-secondary-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 hover:opacity-90 transition"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------- One post card ----------

function PostCard({ post, token, onChanged }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmOverride, setConfirmOverride] = useState(false);

  const { words, readTime } = readTimeOf(post.content);
  const markers = markersOf(post.content);
  const isDraft = post.status === "draft";

  const call = useCallback(
    async (method, path) => {
      setBusy(true); setErr(null);
      try {
        const res = await fetch(`${BACKEND_URL}${path}`, {
          method,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { onChanged("unauth"); return; }
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.message || `HTTP ${res.status}`);
        }
        onChanged();
      } catch (e) {
        setErr(e.message || "Request failed");
      } finally {
        setBusy(false);
      }
    },
    [token, onChanged]
  );

  function approve() {
    if (markers.length > 0 && !confirmOverride) { setConfirmOverride(true); return; }
    call("POST", `/admin/posts/${post.slug}/approve`);
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white capitalize break-words">{post.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" />{formatDate(post.date)}</span>
            <span className="inline-flex items-center gap-1"><DocumentTextIcon className="h-3.5 w-3.5" />{words} words</span>
            <span className="inline-flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" />{readTime} min read</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${isDraft ? "bg-amber-900/40 text-amber-300" : "bg-emerald-900/40 text-emerald-300"}`}>
              {post.status}
            </span>
          </div>
        </div>
        <code className="text-[11px] text-gray-500 break-all">{post.slug}</code>
      </div>

      {markers.length > 0 && (
        <div className="mt-3 rounded-lg border border-amber-700/60 bg-amber-950/30 p-3 text-sm text-amber-300">
          <div className="flex items-center gap-2 font-medium">
            <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
            {markers.length} unresolved [AUTHOR:] marker{markers.length === 1 ? "" : "s"}
          </div>
          <ul className="mt-2 space-y-1 text-xs text-amber-200/90">
            {markers.map((m, i) => <li key={i}><code className="break-all">{m}</code></li>)}
          </ul>
        </div>
      )}

      {err && <div className="mt-3 rounded-lg border border-red-800/60 bg-red-950/30 p-3 text-sm text-red-300">{err}</div>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {isDraft ? (
          <button
            onClick={approve}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary-400 to-secondary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:opacity-90 transition"
          >
            <CheckCircleIcon className="h-4 w-4" /> Approve &amp; Publish
          </button>
        ) : (
          <button
            onClick={() => call("POST", `/admin/posts/${post.slug}/unpublish`)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2 text-sm text-gray-200 hover:border-amber-500 hover:text-amber-300 transition disabled:opacity-40"
          >
            <EyeSlashIcon className="h-4 w-4" /> Unpublish
          </button>
        )}

        {confirmDelete ? (
          <span className="inline-flex items-center gap-2 text-sm text-red-300">
            Delete permanently?
            <button onClick={() => call("DELETE", `/admin/posts/${post.slug}`)} disabled={busy}
              className="rounded-full bg-red-600 px-3 py-1.5 text-white text-sm hover:bg-red-500 disabled:opacity-40">Yes, delete</button>
            <button onClick={() => setConfirmDelete(false)}
              className="rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:border-zinc-500">Cancel</button>
          </span>
        ) : (
          <button onClick={() => setConfirmDelete(true)} disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:border-red-600 hover:text-red-300 transition disabled:opacity-40">
            <TrashIcon className="h-4 w-4" /> Delete
          </button>
        )}

        <button onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:border-secondary-500 transition">
          {open ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          {open ? "Hide preview" : "Preview"}
        </button>
      </div>

      {markers.length > 0 && confirmOverride && isDraft && (
        <div className="mt-3 rounded-lg border border-amber-700/60 bg-amber-950/20 p-3">
          <p className="text-sm text-amber-200">
            Override: publish with {markers.length} unresolved marker{markers.length === 1 ? "" : "s"} still in the text.
          </p>
          <button onClick={() => call("POST", `/admin/posts/${post.slug}/approve`)} disabled={busy}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-500 px-4 py-2 text-sm text-amber-200 hover:bg-amber-500/10 transition disabled:opacity-40">
            <ExclamationTriangleIcon className="h-4 w-4" /> Publish anyway
          </button>
        </div>
      )}

      {open && (
        <div className="mt-4 rounded-lg border border-zinc-800 bg-black/40 p-5">
          <MarkdownRenderer content={post.content || ""} />
        </div>
      )}
    </div>
  );
}

// ---------- Authenticated dashboard ----------

function Dashboard({ token, onLogout }) {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [showPublished, setShowPublished] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { onLogout(); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPosts(await res.json());
    } catch (e) {
      setError(e.message || "Failed to load posts");
    }
  }, [token, onLogout]);

  useEffect(() => { load(); }, [load]);

  const handleChanged = useCallback((signal) => {
    if (signal === "unauth") { onLogout(); return; }
    load();
  }, [load, onLogout]);

  const drafts = (posts || []).filter((p) => p.status === "draft");
  const published = (posts || []).filter((p) => p.status === "published");

  return (
    <div className="min-h-screen bg-black text-white px-6 sm:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-pink-400 mb-2">Admin</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">Draft review</span>
            </h1>
            <p className="text-[#ADB7BE] text-sm">
              {posts === null ? "Loading…" : `${drafts.length} draft${drafts.length === 1 ? "" : "s"} · ${published.length} published. Approving publishes instantly.`}
            </p>
          </div>
          <button onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:border-zinc-500">
            <ArrowRightOnRectangleIcon className="h-4 w-4" /> Sign out
          </button>
        </header>

        {error && <div className="mb-6 rounded-lg border border-red-800/60 bg-red-950/30 p-3 text-sm text-red-300">{error}</div>}

        {posts !== null && drafts.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-16 text-center text-[#ADB7BE] mb-8">
            No drafts to review. New generated posts arrive here as drafts.
          </div>
        )}

        <div className="space-y-5">
          {drafts.map((p) => <PostCard key={p.slug} post={p} token={token} onChanged={handleChanged} />)}
        </div>

        {published.length > 0 && (
          <div className="mt-12">
            <button onClick={() => setShowPublished((s) => !s)}
              className="text-sm text-gray-400 hover:text-gray-200 mb-4">
              {showPublished ? "▾" : "▸"} Published ({published.length})
            </button>
            {showPublished && (
              <div className="space-y-5">
                {published.map((p) => <PostCard key={p.slug} post={p} token={token} onChanged={handleChanged} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DraftsAdmin() {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setToken(localStorage.getItem(TOKEN_KEY)); } catch { /* ignore */ }
    setReady(true);
  }, []);

  const logout = useCallback(() => {
    const t = (() => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } })();
    if (t) {
      fetch(`${BACKEND_URL}/admin/logout`, { method: "POST", headers: { Authorization: `Bearer ${t}` } }).catch(() => {});
    }
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
    setToken(null);
  }, []);

  if (!ready) return <div className="min-h-screen bg-black" />;
  if (!token) return <Login onAuthed={setToken} />;
  return <Dashboard token={token} onLogout={logout} />;
}

"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { API_BASE } from "@/lib/api";

type FetchStatus = "idle" | "loading" | "done" | "error";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputRef.current?.value.trim();
    if (!query) {
      // Clear search — go back to the base dashboard
      router.push("/");
      return;
    }
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  const handleFetchNews = async () => {
    setFetchStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: [] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFetchStatus("done");
      // Refresh the current page's server data after ingestion
      setTimeout(() => {
        setFetchStatus("idle");
        router.refresh();
      }, 2000);
    } catch {
      setFetchStatus("error");
      setTimeout(() => setFetchStatus("idle"), 3000);
    }
  };

  // Only show the search bar on the dashboard (root) page
  const showSearch = pathname === "/";

  const fetchButtonContent = () => {
    switch (fetchStatus) {
      case "loading":
        return (
          <>
            {/* Inline SVG spinner */}
            <svg
              className="animate-spin h-3.5 w-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Fetching…</span>
          </>
        );
      case "done":
        return (
          <>
            <span className="material-symbols-outlined text-[1rem]">check_circle</span>
            <span>Done!</span>
          </>
        );
      case "error":
        return (
          <>
            <span className="material-symbols-outlined text-[1rem]">error</span>
            <span>Failed, try again</span>
          </>
        );
      default:
        return (
          <>
            <span className="material-symbols-outlined text-[1rem]">cloud_download</span>
            <span>Fetch News</span>
          </>
        );
    }
  };

  const fetchButtonClass = [
    "flex items-center gap-1.5 px-4 py-2 text-xs font-headline font-bold uppercase tracking-widest rounded-lg transition-all active:scale-95 whitespace-nowrap",
    fetchStatus === "idle"
      ? "bg-[#3b82f6] text-white hover:bg-[#2563eb]"
      : fetchStatus === "loading"
      ? "bg-[#3b82f6]/60 text-white cursor-not-allowed"
      : fetchStatus === "done"
      ? "bg-emerald-600/80 text-white cursor-not-allowed"
      : "bg-red-600/80 text-white cursor-not-allowed",
  ].join(" ");

  return (
    <header className="fixed top-0 left-64 right-0 z-40 h-16 flex items-center px-8 bg-[#0c0e14]/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex items-center justify-between w-full gap-6">
        {/* Page context label */}
        <div className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant/60 select-none">
          {pathname === "/" && "Dashboard"}
          {pathname === "/articles" && "Articles"}
          {pathname === "/search" && "Search"}
          {pathname === "/analytics" && "Analytics"}
        </div>

        {/* Right side: Search (dashboard only) + Fetch News (always visible) */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search — only visible on the dashboard */}
          {showSearch && (
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-[1.1rem] pointer-events-none">
                  search
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search articles…"
                  className="w-64 bg-surface-container-high text-sm text-on-surface placeholder:text-on-surface-variant/40 rounded-lg pl-9 pr-4 py-2 border border-outline-variant/10 focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-on-primary text-xs font-headline font-bold uppercase tracking-widest rounded-lg hover:opacity-90 active:scale-95 transition"
              >
                Go
              </button>
            </form>
          )}

          {/* Fetch News button — always visible in the navbar */}
          <button
            onClick={handleFetchNews}
            disabled={fetchStatus !== "idle"}
            className={fetchButtonClass}
          >
            {fetchButtonContent()}
          </button>
        </div>
      </div>
    </header>
  );
}
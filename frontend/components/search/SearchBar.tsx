"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push("/search");
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", query.trim());
    router.push(`/search?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", suggestion);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="max-w-5xl mx-auto mb-16">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-center bg-surface-container-low rounded-2xl p-2 h-20 border-ghost transition-all duration-300 group-focus-within:bg-surface-container-high">
          <span className="material-symbols-outlined text-4xl ml-6 text-primary/50">
            search
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-2xl font-headline font-semibold px-6 text-on-surface placeholder:text-on-surface-variant/30"
            placeholder="Search news keywords..."
            type="text"
          />
          <button
            type="submit"
            className="mr-4 px-6 h-12 bg-surface-container-highest hover:bg-surface-bright text-on-surface rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <span>Search</span>
            <span className="material-symbols-outlined text-sm">
              keyboard_return
            </span>
          </button>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant/60 mr-2">
          Suggestions:
        </span>
        {["AI News", "Market Trends", "Tech Updates"].map(
          (suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-1.5 rounded-full bg-surface-container-high text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/10 hover:border-primary/20 hover:text-primary"
            >
              {suggestion}
            </button>
          )
        )}
      </div>
    </section>
  );
}

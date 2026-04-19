"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const category = formData.get("category") as string;
    const sentiment = formData.get("sentiment") as string;
    
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "All Sectors") params.set("category", category);
    else params.delete("category");
    
    if (sentiment && sentiment !== "Any Sentiment") params.set("sentiment", sentiment);
    else params.delete("sentiment");

    params.set("page", "1"); // reset page on filter
    router.push(`/articles?${params.toString()}`);
  };

  return (
    <section className="mb-10 bg-surface-container-low rounded-xl p-6 shadow-sm">
      <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-headline font-bold text-[0.6875rem] uppercase tracking-wider text-on-surface-variant mb-2">
            Category Filter
          </label>
          <select
            name="category"
            defaultValue={searchParams.get("category") || "All Sectors"}
            className="w-full bg-surface-container-high border-none rounded-lg text-sm text-on-surface py-3 px-4 focus:ring-1 focus:ring-primary"
          >
            <option>All Sectors</option>
            <option>Generative AI</option>
            <option>Infrastructure</option>
            <option>Fintech</option>
            <option>Robotics</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block font-headline font-bold text-[0.6875rem] uppercase tracking-wider text-on-surface-variant mb-2">
            Market Sentiment
          </label>
          <select
            name="sentiment"
            defaultValue={searchParams.get("sentiment") || "Any Sentiment"}
            className="w-full bg-surface-container-high border-none rounded-lg text-sm text-on-surface py-3 px-4 focus:ring-1 focus:ring-primary"
          >
            <option>Any Sentiment</option>
            <option>Bullish</option>
            <option>Neutral</option>
            <option>Bearish</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block font-headline font-bold text-[0.6875rem] uppercase tracking-wider text-on-surface-variant mb-2">
            Date Horizon
          </label>
          <select
            name="horizon"
            className="w-full bg-surface-container-high border-none rounded-lg text-sm text-on-surface py-3 px-4 focus:ring-1 focus:ring-primary"
          >
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Current Quarter</option>
            <option>YTD</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-surface-container-highest text-on-surface font-headline font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-lg hover:bg-surface-bright transition-colors"
        >
          Apply Filters
        </button>
      </form>
    </section>
  );
}

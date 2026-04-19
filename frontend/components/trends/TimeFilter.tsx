"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TimeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const days = searchParams.get("days") || "7";

  const setDays = (d: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("days", d);
    router.push(`/trends?${params.toString()}`);
  };

  return (
    <div className="flex bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/10">
      <button
        onClick={() => setDays("1")}
        className={cn(
          "px-5 py-2 text-xs font-headline font-bold uppercase tracking-wider transition-colors",
          days === "1"
            ? "bg-surface-container-highest text-primary rounded-lg shadow-xl shadow-black/20"
            : "text-on-surface-variant hover:text-on-surface"
        )}
      >
        Last 24h
      </button>
      <button
        onClick={() => setDays("7")}
        className={cn(
          "px-5 py-2 text-xs font-headline font-bold uppercase tracking-wider transition-colors",
          days === "7"
            ? "bg-surface-container-highest text-primary rounded-lg shadow-xl shadow-black/20"
            : "text-on-surface-variant hover:text-on-surface"
        )}
      >
        7 Days
      </button>
      <button
        onClick={() => setDays("30")}
        className={cn(
          "px-5 py-2 text-xs font-headline font-bold uppercase tracking-wider transition-colors",
          days === "30"
            ? "bg-surface-container-highest text-primary rounded-lg shadow-xl shadow-black/20"
            : "text-on-surface-variant hover:text-on-surface"
        )}
      >
        30 Days
      </button>
    </div>
  );
}

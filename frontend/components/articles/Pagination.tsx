"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/articles?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  // Simple pagination logic, display max 5 pages
  let visiblePages = pages;
  if (totalPages > 5) {
    if (currentPage <= 3) {
      visiblePages = pages.slice(0, 5);
    } else if (currentPage >= totalPages - 2) {
      visiblePages = pages.slice(totalPages - 5);
    } else {
      visiblePages = pages.slice(currentPage - 3, currentPage + 2);
    }
  }

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary-container transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center font-headline font-bold transition-colors",
            p === currentPage
              ? "bg-primary text-on-primary-container"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
          )}
        >
          {p}
        </button>
      ))}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <span className="px-2 text-on-surface-variant">...</span>
      )}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <button
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors font-headline font-bold"
        >
          {totalPages}
        </button>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary-container transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}

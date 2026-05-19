"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
  pageSize?: number;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  totalCount,
  pageSize,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis: [1, ..., 4, 5, 6, ..., 12]
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const from = totalCount && pageSize ? (page - 1) * pageSize + 1 : null;
  const to   = totalCount && pageSize ? Math.min(page * pageSize, totalCount) : null;

  return (
    <div className={cn("flex items-center justify-between mt-4", className)}>
      {/* Count label */}
      <span className="text-[12px] text-zinc-400">
        {from && to && totalCount
          ? `Showing ${from}–${to} of ${totalCount}`
          : `Page ${page} of ${totalPages}`}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-7 h-7 rounded-md border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-[12px] text-zinc-300">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-7 h-7 rounded-md text-[12px] font-medium border transition-colors",
                p === page
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-7 h-7 rounded-md border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "./Spinner";
import Button from "./Button";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  // Pagination
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  emptyMessage = "No records found.",
  page = 1,
  totalPages = 1,
  onPageChange,
}: TableProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-sm min-w-full">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <Spinner className="mx-auto text-orange-500" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-zinc-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/60 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-zinc-700 ${col.className ?? ""}`}>
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="py-16 text-center">
            <Spinner className="mx-auto text-orange-500" />
          </div>
        ) : data.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 bg-white rounded-xl border border-zinc-200">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3"
            >
              {columns.map((col, colIndex) => {
                const isActionColumn = col.header.toLowerCase() === 'actions';
                const content = col.render ? col.render(row) : String(row[col.key] ?? "");
                
                // Render actions at full width at the bottom
                if (isActionColumn) {
                  return (
                    <div key={col.key} className="pt-2 border-t border-zinc-100">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                          {col.header}
                        </span>
                        <div className="flex-shrink-0">
                          {content}
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // First column (usually name) gets special treatment - full width
                if (colIndex === 0) {
                  return (
                    <div key={col.key} className="pb-2 border-b border-zinc-100">
                      {content}
                    </div>
                  );
                }
                
                // Other columns in two-column layout
                return (
                  <div key={col.key} className="flex justify-between items-start gap-3">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex-shrink-0">
                      {col.header}
                    </span>
                    <div className="text-sm text-zinc-700 text-right flex-1 min-w-0">
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {onPageChange && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500">
          <span className="text-center sm:text-left">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

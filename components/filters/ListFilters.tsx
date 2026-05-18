"use client";

import { Search, X } from "lucide-react";

export interface StatusOption {
  value: string;
  label: string;
}

interface ListFiltersProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  fromDate?: string;
  toDate?: string;
  onFromDateChange?: (value: string) => void;
  onToDateChange?: (value: string) => void;
  showDateRange?: boolean;
  status?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: StatusOption[];
  statusLabel?: string;
  onClear?: () => void;
  className?: string;
}

export default function ListFilters({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  showDateRange = false,
  status,
  onStatusChange,
  statusOptions,
  statusLabel = "Status",
  onClear,
  className = "",
}: ListFiltersProps) {
  const hasActive =
    (search?.trim() ?? "") !== "" ||
    (fromDate ?? "") !== "" ||
    (toDate ?? "") !== "" ||
    (status ?? "") !== "";

  return (
    <div className={`flex flex-col gap-3 mb-4 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
        {onSearchChange && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="search"
              value={search ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-200 bg-white outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        )}

        {showDateRange && onFromDateChange && onToDateChange && (
          <div className="grid grid-cols-2 gap-2 min-w-[280px]">
            <label className="block">
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
                From
              </span>
              <input
                type="date"
                value={fromDate ?? ""}
                onChange={(e) => onFromDateChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 bg-white outline-none focus:border-orange-400"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
                To
              </span>
              <input
                type="date"
                value={toDate ?? ""}
                onChange={(e) => onToDateChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 bg-white outline-none focus:border-orange-400"
              />
            </label>
          </div>
        )}

        {statusOptions && onStatusChange && (
          <label className="min-w-[140px]">
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
              {statusLabel}
            </span>
            <select
              value={status ?? ""}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 bg-white outline-none focus:border-orange-400"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {hasActive && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50"
          >
            <X className="w-3.5 h-3.5" /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

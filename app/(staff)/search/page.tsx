"use client";

// Feature 10 — Search Customers (Staff)
// Assigned to: [Punya Kumari Tamang]
// Branch: feature/customer-search
// API endpoints: GET /api/staff/customers/search?q=&type=

import { useState, useEffect, useRef } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import { useSearchCustomers } from "@/hooks/useCustomers";
import { Search, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

// ─── Search type options ──────────────────────────────────────────────────────

const SEARCH_TYPES = [
  { value: "name",    label: "Name" },
  { value: "phone",   label: "Phone" },
  { value: "id",      label: "Customer ID" },
  { value: "vehicle", label: "Vehicle No." },
] as const;

type SearchType = (typeof SEARCH_TYPES)[number]["value"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [query,      setQuery]      = useState("");
  const [searchType, setSearchType] = useState<SearchType>("name");
  const [debouncedQ, setDebouncedQ] = useState("");

  // 300ms debounce on query
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(query.trim()), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  // Reset query when search type changes
  const handleTypeChange = (type: SearchType) => {
    setSearchType(type);
    setQuery("");
    setDebouncedQ("");
  };

  const { data, isLoading } = useSearchCustomers(debouncedQ, searchType);

  const results = data?.items ?? [];
  const total   = data?.totalCount ?? 0;

  return (
    <div>
      <PageHeader
        title="Search Customers"
        subtitle="Find customers by name, phone, ID, or vehicle number"
        breadcrumb={[{ label: "Staff" }, { label: "Search" }]}
      />

      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-[1.5px] border-zinc-200 rounded-2xl p-4 mb-4 focus-within:border-orange-300 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.07)] transition-all">
        <div className="flex gap-3">
          {/* Type selector */}
          <select
            value={searchType}
            onChange={(e) => handleTypeChange(e.target.value as SearchType)}
            className="shrink-0 text-[13px] text-zinc-700 border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition cursor-pointer"
          >
            {SEARCH_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          {/* Search input */}
          <div className="flex-1 flex items-center gap-2 bg-zinc-50 rounded-xl px-3 py-2.5 border border-zinc-100 focus-within:border-orange-200 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={`Search by ${SEARCH_TYPES.find((t) => t.value === searchType)?.label.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] text-zinc-800 placeholder:text-zinc-400 w-full"
            />
          </div>
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────────────────── */}
      {debouncedQ && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-zinc-300">Searching...</div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              No customers found for &quot;{debouncedQ}&quot;
            </div>
          ) : (
            <>
              {/* Result count */}
              <div className="px-5 py-3 border-b border-zinc-100">
                <p className="text-xs text-zinc-400">
                  {total} result{total !== 1 ? "s" : ""} for &quot;{debouncedQ}&quot;
                </p>
              </div>

              {/* Result rows */}
              {results.map((c) => (
                <div
                  key={c.customerId}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50 border-b border-zinc-50 last:border-b-0 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-500 flex-shrink-0">
                    {c.fullName?.charAt(0).toUpperCase() ?? "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800">{c.fullName}</p>
                    <p className="text-xs text-zinc-400 truncate">
                      {c.email}
                      {c.phone && ` • ${c.phone}`}
                      {c.vehicles?.[0]?.registrationNumber && ` • ${c.vehicles[0].registrationNumber}`}
                    </p>
                    {/* Show all vehicle plates when searching by vehicle */}
                    {searchType === "vehicle" && c.vehicles?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {c.vehicles.map((v) => (
                          <span
                            key={v.vehicleId}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-600 border border-orange-100"
                          >
                            {v.make} {v.model} {v.year}
                            {v.registrationNumber && ` — ${v.registrationNumber}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Create Invoice quick-action */}
                    <Link
                      href={`${ROUTES.STAFF_SALES_INVOICES}?customerId=${c.customerId}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" size="sm">
                        <FileText className="w-3.5 h-3.5" /> Invoice
                      </Button>
                    </Link>

                    {/* View detail */}
                    <Link href={ROUTES.STAFF_CUSTOMER_DETAIL(c.customerId)}>
                      <Button variant="ghost" size="sm">
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Empty state before any search */}
      {!debouncedQ && (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
          <Search className="w-10 h-10 mb-3" />
          <p className="text-sm">Start typing to search customers</p>
        </div>
      )}
    </div>
  );
}

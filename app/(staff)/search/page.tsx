"use client";

// Feature 10 — Search Customers (Staff)
// Assigned to: [Punya Kumari Tamang]
// Branch: feature/search-customers
// API endpoints: GET /api/customers?search=...

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import { useCustomers } from "@/hooks/useCustomers";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { data, isLoading } = useCustomers(1, 20, submitted || undefined);

  // TODO [Punya Kumari Tamang]: Implement live search with debounce (300ms),
  // show customer cards or table with quick-action buttons (View, Create Invoice).

  return (
    <div>
      <PageHeader
        title="Search Customers"
        subtitle="Find customers by name, email, or phone"
        breadcrumb={[{ label: "Staff" }, { label: "Search" }]}
      />

      {/* Search box */}
      <div className="bg-white border-[1.5px] border-zinc-200 rounded-2xl p-4 mb-4 focus-within:border-orange-300 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.07)] transition-all">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-zinc-50 rounded-xl px-3 py-2.5 border border-zinc-100 focus-within:border-orange-200 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && setSubmitted(query)}
              className="bg-transparent border-none outline-none text-[13px] text-zinc-800 placeholder:text-zinc-400 w-full"
            />
          </div>
          <Button onClick={() => setSubmitted(query)}>
            <Search className="w-4 h-4" /> Search
          </Button>
        </div>
      </div>

      {/* Results */}
      {submitted && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-zinc-300">Searching...</div>
          ) : (data?.data ?? []).length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">No customers found for &quot;{submitted}&quot;</div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-zinc-100">
                <p className="text-xs text-zinc-400">{data?.totalCount ?? 0} result{(data?.totalCount ?? 0) !== 1 ? "s" : ""} for &quot;{submitted}&quot;</p>
              </div>
              {(data?.data ?? []).map(c => (
                <Link
                  key={c.id}
                  href={ROUTES.STAFF_CUSTOMER_DETAIL(c.id)}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50 border-b border-zinc-50 last:border-b-0 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-500 flex-shrink-0">
                    {c.user?.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800">{c.user?.name}</p>
                    <p className="text-xs text-zinc-400 truncate">
                      {c.user?.email} • {c.phone}
                      {c.vehicles?.[0] && ` • ${c.vehicles[0].registrationNumber}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                      {c.loyaltyPoints} pts
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-300" />
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

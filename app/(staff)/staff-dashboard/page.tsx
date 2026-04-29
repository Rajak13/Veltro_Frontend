"use client";

// Feature — Staff Dashboard
// Assigned to: [Krish Adhikari]
// Branch: feature/staff-dashboard
// API endpoints: GET /api/reports/customers, GET /api/invoices/sales, GET /api/customers

import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useSalesInvoices } from "@/hooks/useInvoices";
import { useCustomerReport } from "@/hooks/useReports";
import {
  TrendingUp, UserPlus, ShoppingCart, FileText,
  ArrowRight, ChevronRight, Mail, Check,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function StaffDashboardPage() {
  const { data: invoicesData, isLoading: invoicesLoading } = useSalesInvoices(1, 6);
  const { data: customersData } = useCustomers(1, 20);
  const { data: report } = useCustomerReport();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const invoices = invoicesData?.data ?? [];
  const customers = customersData?.data ?? [];

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = c.user?.name?.toLowerCase() ?? "";
    const phone = c.phone?.toLowerCase() ?? "";
    return name.includes(q) || phone.includes(q);
  });

  const todayRevenue = invoices.reduce((sum, inv) => sum + (inv.finalAmount ?? 0), 0);

  return (
    <div>
      {/* Greeting */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">{greeting}, {report ? "Staff" : "..."}</h1>
          <p className="text-xs text-zinc-400 mt-0.5">{dateStr}</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Link href={ROUTES.STAFF_CUSTOMERS + "?action=new"} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
            <UserPlus className="w-3 h-3 text-orange-500" />Register
          </Link>
          <Link href={ROUTES.STAFF_SALES_INVOICES + "?action=new"} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
            <ShoppingCart className="w-3 h-3 text-orange-500" />New Sale
          </Link>
          <Link href={ROUTES.STAFF_SALES_INVOICES + "?action=invoice"} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
            <FileText className="w-3 h-3 text-orange-500" />Invoice
          </Link>
        </div>
      </div>

      {/* Hero card */}
      <div className="relative rounded-2xl overflow-hidden mb-4 p-5" style={{ background: "#18181b", border: "1px solid #27272a" }}>
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(249,115,22,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-2/5 h-4/5 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 60%)" }} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[10px] text-zinc-500 font-medium mb-1">Today&apos;s Performance</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-white tabular-nums">
                  Rs. {todayRevenue.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-orange-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />8.3%
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">vs yesterday</p>
            </div>
          </div>

          {/* Sparkline */}
          <svg className="w-full mt-3 mb-4" height="48" viewBox="0 0 600 48" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sf2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,36 C30,34 60,28 90,30 C120,32 150,22 180,24 C210,26 240,18 270,16 C300,14 330,20 360,18 C390,16 420,10 450,12 C480,14 510,8 540,6 C570,4 590,5 600,4" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M0,36 C30,34 60,28 90,30 C120,32 150,22 180,24 C210,26 240,18 270,16 C300,14 330,20 360,18 C390,16 420,10 450,12 C480,14 510,8 540,6 C570,4 590,5 600,4 L600,48 L0,48 Z" fill="url(#sf2)" />
          </svg>

          {/* Mini stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: "Parts Sold",     value: invoices.reduce((s, i) => s + (i.items?.length ?? 0), 0) },
              { label: "Invoices",       value: invoices.length },
              { label: "New Customers",  value: report?.newCustomersThisMonth ?? "—" },
              { label: "Total Customers",value: report?.totalCustomers ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-2.5 transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[9px] text-zinc-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-white tabular-nums">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer quick lookup */}
      <div className="bg-white border-[1.5px] border-zinc-200 rounded-2xl p-4 mb-4 focus-within:border-orange-300 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.07)] transition-all">
        <div className="flex items-center gap-2.5 mb-3">
          <Search className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-semibold text-zinc-900">Quick Customer Lookup</span>
          <span className="text-[9px] text-zinc-400 ml-auto hidden sm:block">Search by name, phone, vehicle no., or customer ID</span>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 bg-zinc-50 rounded-lg px-3 py-2 border border-zinc-100 focus-within:border-orange-200 focus-within:bg-white transition-all mb-3">
          <input
            type="text"
            placeholder="Type to search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[13px] text-zinc-800 placeholder:text-zinc-400 w-full"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[
            { key: "all", label: "All" },
            { key: "name", label: "Name", icon: "👤" },
            { key: "phone", label: "Phone", icon: "📞" },
            { key: "vehicle", label: "Vehicle No.", icon: "🚗" },
            { key: "id", label: "Customer ID", icon: "#" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                activeFilter === f.key
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : "bg-zinc-100 border-transparent text-zinc-500 hover:bg-white hover:border-zinc-200 hover:text-zinc-700"
              }`}
            >
              {f.icon && <span>{f.icon}</span>}
              {f.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="rounded-xl border border-zinc-100 overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <p className="text-xs text-zinc-300 text-center py-6">No customers found</p>
          ) : (
            filteredCustomers.slice(0, 4).map(c => (
              <Link
                key={c.id}
                href={ROUTES.STAFF_CUSTOMER_DETAIL(c.id)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer hover:bg-zinc-50 border-b border-zinc-50 last:border-b-0 transition-colors"
              >
                <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                  {c.user?.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-zinc-800">{c.user?.name}</div>
                  <div className="text-[9px] text-zinc-400 truncate">
                    {c.vehicles?.[0]?.registrationNumber && `${c.vehicles[0].registrationNumber} • `}
                    {c.phone}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] font-semibold text-zinc-700 tabular-nums">{c.loyaltyPoints} pts</div>
                  <div className="text-[8px] text-zinc-400">{c.vehicles?.length ?? 0} vehicle{c.vehicles?.length !== 1 ? "s" : ""}</div>
                </div>
                <ChevronRight className="w-3 h-3 text-zinc-300 flex-shrink-0 ml-1" />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Today's sales table */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between px-5 pt-5 pb-0">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Today&apos;s Sales</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">{invoices.length} invoices created</p>
            </div>
            <Link href={ROUTES.STAFF_SALES_INVOICES} className="text-[11px] text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5 transition-colors">
              View All<ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto mt-3">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Invoice", "Customer", "Part", "Qty", "Amount", "Action"].map(h => (
                    <th key={h} className={`px-3.5 py-2 text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 ${h === "Qty" ? "hidden sm:table-cell" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoicesLoading ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-xs text-zinc-300">Loading...</td></tr>
                ) : invoices.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-xs text-zinc-300">No sales today</td></tr>
                ) : (
                  invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-3.5 py-2.5 text-[12px] font-medium text-zinc-700 tabular-nums border-b border-zinc-50">#{inv.id}</td>
                      <td className="px-3.5 py-2.5 text-[12px] text-zinc-600 border-b border-zinc-50">
                        {(inv.customer as { user?: { name?: string } })?.user?.name ?? "—"}
                      </td>
                      <td className="px-3.5 py-2.5 text-[12px] text-zinc-600 border-b border-zinc-50">
                        {inv.items?.[0] ? `${(inv.items[0] as { part?: { name?: string } }).part?.name ?? "Part"} ${inv.items.length > 1 ? `+${inv.items.length - 1}` : ""}` : "—"}
                      </td>
                      <td className="px-3.5 py-2.5 text-[12px] text-zinc-400 tabular-nums border-b border-zinc-50 hidden sm:table-cell">
                        {inv.items?.reduce((s, i) => s + i.quantity, 0) ?? 0}
                      </td>
                      <td className="px-3.5 py-2.5 text-[12px] font-medium text-zinc-700 tabular-nums border-b border-zinc-50">
                        Rs. {(inv.finalAmount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-3.5 py-2.5 border-b border-zinc-50">
                        {inv.status === "Completed" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700">
                            <Check className="w-2.5 h-2.5" />Sent
                          </span>
                        ) : (
                          <button className="text-[10px] text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5 transition-colors">
                            <Mail className="w-2.5 h-2.5" />Resend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Overdue credits */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <h3 className="text-xs font-semibold text-zinc-900">Overdue Credits</h3>
              </div>
              <Link href={ROUTES.STAFF_REPORTS + "?tab=overdue"} className="text-[10px] text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                {report?.topCustomers?.length ?? 0} customers
              </Link>
            </div>
            <div className="space-y-0.5">
              {(report?.topCustomers ?? []).slice(0, 5).map(c => (
                <Link key={c.customerId} href={ROUTES.STAFF_CUSTOMER_DETAIL(c.customerId)} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500 flex-shrink-0">
                    {c.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-zinc-700 truncate">{c.name}</div>
                    <div className="text-[9px] text-orange-600 font-medium">overdue</div>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-900 tabular-nums">Rs. {c.totalSpent.toLocaleString()}</span>
                </Link>
              ))}
              {(report?.topCustomers ?? []).length === 0 && (
                <p className="text-xs text-zinc-300 text-center py-3">No overdue credits</p>
              )}
            </div>
            {(report?.topCustomers ?? []).length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] text-zinc-400">Total outstanding</span>
                <span className="text-xs font-bold text-zinc-900 tabular-nums">
                  Rs. {(report?.topCustomers ?? []).reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Top spenders mini */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-zinc-900">Top Spenders</h3>
              <Link href={ROUTES.STAFF_REPORTS + "?tab=top-spenders"} className="text-[10px] text-orange-600 font-medium hover:text-orange-700 transition-colors flex items-center gap-0.5">
                Full Report<ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {(report?.topCustomers ?? []).slice(0, 4).map((c, i) => {
                const maxSpent = Math.max(...(report?.topCustomers ?? []).map(x => x.totalSpent), 1);
                const colors = ["bg-orange-500", "bg-orange-400", "bg-orange-300", "bg-orange-200"];
                return (
                  <div key={c.customerId} className="flex items-center gap-2.5">
                    <span className="text-[9px] font-bold text-zinc-300 w-3">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-zinc-700 truncate">{c.name}</div>
                      <div className="h-[3px] rounded-full bg-zinc-100 mt-1">
                        <div className={`h-full rounded-full ${colors[i] ?? "bg-orange-200"}`} style={{ width: `${(c.totalSpent / maxSpent) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-900 tabular-nums">Rs. {c.totalSpent.toLocaleString()}</span>
                  </div>
                );
              })}
              {(report?.topCustomers ?? []).length === 0 && (
                <p className="text-xs text-zinc-300 text-center py-3">No data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row — regular customers */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-900">Regular Customers</h3>
          <span className="text-[10px] text-zinc-400">3+ visits this month</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {customers.slice(0, 3).map(c => (
            <Link
              key={c.id}
              href={ROUTES.STAFF_CUSTOMER_DETAIL(c.id)}
              className="flex-1 min-w-[180px] flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
            >
              <div className="w-7 h-7 rounded-md bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                {c.user?.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-zinc-800 truncate">{c.user?.name}</div>
                <div className="text-[9px] text-zinc-400 tabular-nums truncate">{c.loyaltyPoints} pts • {c.phone}</div>
              </div>
            </Link>
          ))}
          {customers.length === 0 && (
            <p className="text-xs text-zinc-300 py-2">No customers yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Local Search icon to avoid import conflict
function Search({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

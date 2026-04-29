"use client";

// Feature 1 — Financial Reports & Dashboard (Admin)
// Assigned to: [Abdul Razzaq Ansari]
// Branch: feature/financial-dashboard
// API endpoints: GET /api/reports/financial, GET /api/reports/customers

import { useFinancialReport } from "@/hooks/useReports";
import { useParts } from "@/hooks/useParts";
import {
  TrendingUp, TrendingDown, Package, Users, FileText,
  Plus, FilePlus, UserPlus, Download, ArrowRight, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function AdminDashboardPage() {
  const { data: report, isLoading } = useFinancialReport();
  const { data: partsData } = useParts(1, 100);

  const lowStockParts = Array.isArray(partsData?.data) 
    ? partsData.data.filter((p) => (p.stockQuantity ?? 0) < 10).slice(0, 3)
    : [];

  // Also guard parts page usage
  const allParts = Array.isArray(partsData?.data) ? partsData.data : [];

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const monthlySales = report?.monthlySales ?? [];
  const maxRevenue = Math.max(...monthlySales.map((m) => m.revenue), 1);

  return (
    <div>
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4 sm:mb-5">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-zinc-900">{greeting}, {report ? "Admin" : "..."}</h1>
          <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">{dateStr}</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Link href={ROUTES.ADMIN_PARTS + "?action=new"} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
            <Plus className="w-3 h-3 text-orange-500" /><span className="hidden xs:inline">Add Part</span><span className="xs:hidden">Part</span>
          </Link>
          <Link href="/sales-invoices?action=new" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
            <FilePlus className="w-3 h-3 text-orange-500" /><span className="hidden xs:inline">Invoice</span><span className="xs:hidden">Inv</span>
          </Link>
          <Link href={ROUTES.ADMIN_STAFF + "?action=new"} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
            <UserPlus className="w-3 h-3 text-orange-500" />Staff
          </Link>
          <button className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
            <Download className="w-3 h-3" />Export
          </button>
        </div>
      </div>

      {/* Hero card */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 p-4 sm:p-5" style={{ background: "#18181b", border: "1px solid #27272a" }}>
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(249,115,22,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-2/5 h-4/5 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 60%)" }} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium mb-1">Monthly Revenue</p>
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                  Rs. {report?.totalRevenue?.toLocaleString() ?? "—"}
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-orange-400 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />12.5%
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5">vs previous period</p>
            </div>
          </div>

          {/* Sparkline */}
          <svg className="w-full mt-3 mb-4" height="48" viewBox="0 0 600 48" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,38 C40,35 80,30 120,32 C160,34 200,24 240,26 C280,28 320,16 360,18 C400,20 440,10 480,12 C520,14 560,6 600,4" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M0,38 C40,35 80,30 120,32 C160,34 200,24 240,26 C280,28 320,16 360,18 C400,20 440,10 480,12 C520,14 560,6 600,4 L600,48 L0,48 Z" fill="url(#sf)" />
          </svg>

          {/* Mini stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {[
              { label: "Total Revenue", value: `Rs. ${report?.totalRevenue?.toLocaleString() ?? "—"}` },
              { label: "Expenses",      value: `Rs. ${report?.totalExpenses?.toLocaleString() ?? "—"}` },
              { label: "Net Profit",    value: `Rs. ${report?.netProfit?.toLocaleString() ?? "—"}` },
              { label: "Parts Sold",    value: report?.topSellingParts?.reduce((a, p) => a + p.quantity, 0)?.toLocaleString() ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md sm:rounded-lg p-2 sm:p-2.5 transition-colors" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[8px] sm:text-[9px] text-zinc-500 mb-0.5">{label}</p>
                <p className="text-xs sm:text-sm font-semibold text-white tabular-nums truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Bar chart */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm lg:col-span-3">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-900">Revenue Breakdown</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Monthly comparison</p>
          </div>
          {isLoading ? (
            <div className="h-44 flex items-center justify-center text-zinc-300 text-xs">Loading...</div>
          ) : monthlySales.length > 0 ? (
            <div className="flex items-end gap-2 h-44">
              {monthlySales.slice(-7).map((m, i, arr) => {
                const heightPct = (m.revenue / maxRevenue) * 100;
                const isLast = i === arr.length - 1;
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md transition-all hover:brightness-110 cursor-pointer" style={{ height: `${Math.max(heightPct, 4)}%`, background: isLast ? "#f97316" : `rgba(249,115,22,${0.3 + (i / arr.length) * 0.5})` }} title={`Rs. ${m.revenue.toLocaleString()}`} />
                    <span className={`text-[9px] ${isLast ? "font-semibold text-zinc-700" : "text-zinc-400"}`}>{m.month.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-zinc-300 text-xs border-2 border-dashed border-zinc-100 rounded-lg">No data yet</div>
          )}
        </div>

        {/* Right: donut + top parts */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Top selling parts */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex-1">
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Top Selling Parts</h3>
            {isLoading ? (
              <div className="text-xs text-zinc-300">Loading...</div>
            ) : (report?.topSellingParts ?? []).length > 0 ? (
              <div className="space-y-2.5">
                {(report?.topSellingParts ?? []).slice(0, 4).map((p, i) => {
                  const maxQty = Math.max(...(report?.topSellingParts ?? []).map(x => x.quantity), 1);
                  const colors = ["bg-orange-500", "bg-orange-400", "bg-orange-300", "bg-orange-200"];
                  return (
                    <div key={p.partName} className="flex items-center gap-2.5">
                      <span className="text-[9px] font-bold text-zinc-300 w-3">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-zinc-700 truncate">{p.partName}</div>
                        <div className="h-[3px] rounded-full bg-zinc-100 mt-1">
                          <div className={`h-full rounded-full ${colors[i] ?? "bg-orange-200"}`} style={{ width: `${(p.quantity / maxQty) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-900 tabular-nums">{p.quantity}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-300">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Recent sales table */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between px-5 pt-5 pb-0">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Top Customers</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">By total spend</p>
            </div>
            <Link href={ROUTES.STAFF_CUSTOMERS} className="text-[11px] text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5 transition-colors">
              View All<ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto mt-3">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["#", "Customer", "Total Spent", "Revenue"].map(h => (
                    <th key={h} className="px-5 py-2 text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-xs text-zinc-300">Loading...</td></tr>
                ) : (report?.topSellingParts ?? []).length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-xs text-zinc-300">No data yet</td></tr>
                ) : (
                  (report?.topSellingParts ?? []).slice(0, 5).map((p, i) => (
                    <tr key={p.partName} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-5 py-2.5 text-[11px] text-zinc-400 tabular-nums border-b border-zinc-50">{i + 1}</td>
                      <td className="px-5 py-2.5 text-[13px] font-medium text-zinc-700 border-b border-zinc-50">{p.partName}</td>
                      <td className="px-5 py-2.5 text-[13px] text-zinc-600 tabular-nums border-b border-zinc-50">{p.quantity} units</td>
                      <td className="px-5 py-2.5 text-[13px] font-medium text-zinc-700 tabular-nums border-b border-zinc-50">Rs. {p.revenue.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: low stock + stats */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Low stock alerts */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <h3 className="text-xs font-semibold text-zinc-900">Low Stock Alerts</h3>
              </div>
              <Link href={ROUTES.ADMIN_PARTS + "?filter=low-stock"} className="text-[10px] text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                {lowStockParts.length} items &lt; 10 units
              </Link>
            </div>
            <div className="space-y-2">
              {lowStockParts.length === 0 ? (
                <p className="text-xs text-zinc-300 py-2 text-center">All stock levels OK</p>
              ) : lowStockParts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-orange-50 border border-orange-100">
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-orange-500" />
                    <span className="text-[11px] font-medium text-zinc-700">{p.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 tabular-nums">{p.stockQuantity} left</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex-1">
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Total Revenue",  value: `Rs. ${report?.totalRevenue?.toLocaleString() ?? "—"}`,  icon: TrendingUp,   color: "text-green-500",  bg: "bg-green-50" },
                { label: "Total Expenses", value: `Rs. ${report?.totalExpenses?.toLocaleString() ?? "—"}`, icon: TrendingDown, color: "text-red-500",    bg: "bg-red-50" },
                { label: "Net Profit",     value: `Rs. ${report?.netProfit?.toLocaleString() ?? "—"}`,     icon: FileText,    color: "text-orange-500", bg: "bg-orange-50" },
                { label: "Low Stock Items",value: `${lowStockParts.length} parts`,                          icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-zinc-400">{label}</p>
                    <p className="text-[13px] font-semibold text-zinc-800 tabular-nums">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

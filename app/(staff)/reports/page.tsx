"use client";

// Feature 9 — Customer Reports (Staff)
// Assigned to: [Siddhartha Raj Thapa]
// Branch: feature/customer-reports
// API endpoints: GET /api/reports/customers

import PageHeader from "@/components/layout/PageHeader";
import Spinner from "@/components/ui/Spinner";
import { useCustomerReport } from "@/hooks/useReports";
import { Users, TrendingUp, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function ReportsPage() {
  const { data: report, isLoading } = useCustomerReport();

  return (
    <div>
      <PageHeader
        title="Customer Reports"
        subtitle="Insights on customer activity and spending"
        breadcrumb={[{ label: "Staff" }, { label: "Reports" }]}
      />

      {/* TODO [Siddhartha Raj Thapa]: Implement full customer report with:
          - Stat cards (total customers, new this month)
          - Top customers table (sorted by total spent)
          - Optional: bar chart of top customers using recharts */}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Customers",   value: report?.totalCustomers ?? "—",       icon: Users,      bg: "bg-blue-50",   color: "text-blue-500" },
              { label: "New This Month",    value: report?.newCustomersThisMonth ?? "—", icon: TrendingUp, bg: "bg-green-50",  color: "text-green-500" },
              { label: "Top Customer Spend",value: report?.topCustomers?.[0] ? `Rs. ${report.topCustomers[0].totalSpent.toLocaleString()}` : "—", icon: Star, bg: "bg-orange-50", color: "text-orange-500" },
            ].map(({ label, value, icon: Icon, bg, color }) => (
              <div key={label} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-zinc-500">{label}</p>
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-zinc-900 tabular-nums">{String(value)}</p>
              </div>
            ))}
          </div>

          {/* Top spenders table */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 pt-5 pb-0">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">Top Spenders</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">All-time highest spending customers</p>
              </div>
              <Link href={ROUTES.STAFF_CUSTOMERS} className="text-[11px] text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5 transition-colors">
                Full List<ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto mt-3">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["#", "Customer", "Total Spent", "Last Visit"].map(h => (
                      <th key={h} className="px-5 py-2 text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(report?.topCustomers ?? []).length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-10 text-center text-xs text-zinc-300">No data yet</td></tr>
                  ) : (
                    (report?.topCustomers ?? []).map((c, i) => (
                      <tr key={c.customerId} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-5 py-3 text-[11px] text-zinc-400 tabular-nums border-b border-zinc-50">{i + 1}</td>
                        <td className="px-5 py-3 border-b border-zinc-50">
                          <Link href={ROUTES.STAFF_CUSTOMER_DETAIL(c.customerId)} className="flex items-center gap-2.5 hover:text-orange-600 transition-colors">
                            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                              {c.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                            <span className="font-medium text-zinc-800">{c.name}</span>
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-[13px] font-semibold text-zinc-900 tabular-nums border-b border-zinc-50">
                          Rs. {c.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-zinc-400 border-b border-zinc-50">—</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regular customers */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-900">Regular Customers</h3>
              <span className="text-[10px] text-zinc-400">3+ visits this month</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* TODO [Siddhartha Raj Thapa]: Replace with real regular customers data */}
              {(report?.topCustomers ?? []).slice(0, 3).map(c => (
                <Link
                  key={c.customerId}
                  href={ROUTES.STAFF_CUSTOMER_DETAIL(c.customerId)}
                  className="flex-1 min-w-[160px] flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
                >
                  <div className="w-7 h-7 rounded-md bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                    {c.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-zinc-800 truncate">{c.name}</div>
                    <div className="text-[9px] text-zinc-400 tabular-nums">Rs. {c.totalSpent.toLocaleString()} total</div>
                  </div>
                </Link>
              ))}
              {(report?.topCustomers ?? []).length === 0 && (
                <p className="text-xs text-zinc-300 py-2">No data yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

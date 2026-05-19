"use client";

// Feature 9 — Customer Reports (Staff)
// Assigned to: [Siddhartha Raj Thapa]
// Branch: feature/customer-reports
// API endpoints: GET /api/reports/customers/stats, /top-spenders, /regulars, /overdue-credits

import PageHeader from "@/components/layout/PageHeader";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import { useTopSpenders, useRegularCustomers, useOverdueCredits } from "@/hooks/useReports";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types";
import { Users, TrendingUp, Star, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import ExportPdfButton from "@/components/ui/ExportPdfButton";
import { exportTopCustomersPdf } from "@/lib/exportPdf";

// Fetch customer stats directly in this page
const useCustomerStats = () =>
  useQuery({
    queryKey: ["reports", "customers", "stats"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ total: number; newThisMonth: number }>>(
        "/reports/customers/stats"
      );
      return res.data.data;
    },
  });

export default function ReportsPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useCustomerStats();
  const {
    data: topSpenders,
    isLoading: topLoading,
    isError: topError,
  } = useTopSpenders(10);
  const {
    data: regulars,
    isLoading: regLoading,
    isError: regError,
  } = useRegularCustomers(3);
  const {
    data: overdue,
    isLoading: overdueLoading,
    isError: overdueError,
  } = useOverdueCredits();

  const isLoading = statsLoading || topLoading || regLoading;
  const hasError = statsError || topError || regError || overdueError;

  return (
    <div>
      <PageHeader
        title="Customer Reports"
        subtitle="Insights on customer activity and spending"
        breadcrumb={[{ label: "Staff" }, { label: "Reports" }]}
        action={
          (topSpenders?.length ?? 0) > 0 ? (
            <ExportPdfButton
              size="md"
              onExport={() => exportTopCustomersPdf(
                topSpenders!.map(c => ({ customerId: c.customerId, name: c.name, totalSpent: c.totalSpent }))
              )}
            />
          ) : undefined
        }
      />

      {hasError && !isLoading && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load report data. Restart the backend (Staff must be allowed on report APIs),
          then refresh this page.
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total Customers",
                value: stats?.total ?? "—",
                icon: Users,
                bg: "bg-blue-50",
                color: "text-blue-500",
              },
              {
                label: "New This Month",
                value: stats?.newThisMonth ?? "—",
                icon: TrendingUp,
                bg: "bg-green-50",
                color: "text-green-500",
              },
              {
                label: "Top Customer Spend",
                value: topSpenders?.[0]
                  ? `Rs. ${topSpenders[0].totalSpent.toLocaleString()}`
                  : "—",
                icon: Star,
                bg: "bg-orange-50",
                color: "text-orange-500",
              },
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
                <p className="text-[10px] text-zinc-400 mt-0.5">Customers ranked by total amount spent</p>
              </div>
              <Link
                href={ROUTES.STAFF_CUSTOMERS}
                className="text-[11px] text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5 transition-colors"
              >
                Full List<ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto mt-3">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["#", "Customer", "Total Spent", "Invoices", "Last Purchase"].map(h => (
                      <th
                        key={h}
                        className="px-5 py-2 text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topLoading ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-zinc-300">Loading...</td></tr>
                  ) : (topSpenders ?? []).length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-xs text-zinc-300">No sales recorded yet</td></tr>
                  ) : (
                    (topSpenders ?? []).map((c, i) => (
                      <tr key={c.customerId} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-5 py-3 text-[11px] text-zinc-400 tabular-nums border-b border-zinc-50 font-medium">
                          {i + 1}
                        </td>
                        <td className="px-5 py-3 border-b border-zinc-50">
                          <Link
                            href={ROUTES.STAFF_CUSTOMER_DETAIL(c.customerId)}
                            className="flex items-center gap-2.5 hover:text-orange-600 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                              {c.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                            <span className="font-medium text-zinc-800">{c.name}</span>
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-[13px] font-semibold text-zinc-900 tabular-nums border-b border-zinc-50">
                          Rs. {c.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-zinc-500 tabular-nums border-b border-zinc-50">
                          {c.invoiceCount ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-zinc-400 border-b border-zinc-50">
                          {c.lastPurchaseDate
                            ? new Date(c.lastPurchaseDate).toLocaleDateString()
                            : "—"}
                        </td>
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
              <span className="text-[10px] text-zinc-400">3+ purchases</span>
            </div>
            {regLoading ? (
              <div className="flex justify-center py-6"><Spinner size="sm" className="text-orange-500" /></div>
            ) : (regulars ?? []).length === 0 ? (
              <p className="text-xs text-zinc-300 py-2">No customers with 3+ purchases yet</p>
            ) : (
              <div className="flex gap-3 flex-wrap">
                {(regulars ?? []).slice(0, 6).map((c) => {
                  const raw = c as unknown as { customerId: string; customerName?: string; name?: string; invoiceCount?: number; purchaseCount?: number };
                  const name = raw.customerName ?? raw.name ?? "Customer";
                  const count = raw.invoiceCount ?? raw.purchaseCount ?? 0;
                  return (
                    <Link
                      key={raw.customerId}
                      href={ROUTES.STAFF_CUSTOMER_DETAIL(raw.customerId)}
                      className="flex-1 min-w-[160px] flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
                    >
                      <div className="w-7 h-7 rounded-md bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-zinc-800 truncate">{name}</div>
                        <div className="text-[9px] text-zinc-400 tabular-nums">{count} purchases</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Overdue credits */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-zinc-900">Overdue Credits</h3>
              </div>
              <span className="text-[10px] text-zinc-400">Unpaid invoices older than 1 month</span>
            </div>
            {overdueLoading ? (
              <div className="flex justify-center py-6"><Spinner size="sm" className="text-orange-500" /></div>
            ) : (overdue ?? []).length === 0 ? (
              <p className="text-xs text-zinc-300 py-2">No overdue credits</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {["Customer", "Credit Balance", "Last Purchase"].map(h => (
                        <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(overdue ?? []).map((c) => {
                      const raw = c as unknown as { customerId: string; customerName?: string; name?: string; creditBalance?: number; lastPurchaseDate?: string };
                      const name = raw.customerName ?? raw.name ?? "Customer";
                      return (
                        <tr key={raw.customerId} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-4 py-3 border-b border-zinc-50">
                            <Link href={ROUTES.STAFF_CUSTOMER_DETAIL(raw.customerId)} className="flex items-center gap-2 hover:text-orange-600 transition-colors">
                              <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500 flex-shrink-0">
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-[13px] font-medium text-zinc-800">{name}</span>
                            </Link>
                          </td>
                          <td className="px-4 py-3 border-b border-zinc-50">
                            <Badge label={`Rs. ${(raw.creditBalance ?? 0).toLocaleString()}`} variant="danger" />
                          </td>
                          <td className="px-4 py-3 text-[12px] text-zinc-400 border-b border-zinc-50">
                            {raw.lastPurchaseDate ? new Date(raw.lastPurchaseDate).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

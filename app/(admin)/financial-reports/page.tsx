"use client";

// Financial Reports — Admin
// GET /api/reports/financial?period=daily|monthly|yearly

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Spinner from "@/components/ui/Spinner";
import { useFinancialReport } from "@/hooks/useReports";
import { TrendingUp, TrendingDown, DollarSign, Package, BarChart3 } from "lucide-react";
import ExportPdfButton from "@/components/ui/ExportPdfButton";
import { exportFinancialReportPdf } from "@/lib/exportPdf";

type Period = "daily" | "monthly" | "yearly";

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const { data: report, isLoading } = useFinancialReport(period);

  const periods: { value: Period; label: string }[] = [
    { value: "daily",   label: "Today" },
    { value: "monthly", label: "This Month" },
    { value: "yearly",  label: "This Year" },
  ];

  return (
    <div>
      <PageHeader
        title="Financial Reports"
        subtitle="Revenue, expenses and top-selling parts"
        breadcrumb={[{ label: "Admin" }, { label: "Reports" }]}
        action={
          report ? (
            <ExportPdfButton
              size="md"
              onExport={() =>
                exportFinancialReportPdf(
                  report,
                  period === "daily" ? "Today" : period === "monthly" ? "This Month" : "This Year"
                )
              }
            />
          ) : undefined
        }
      />

      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {periods.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border-[1.5px] transition-all ${
              period === p.value
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : !report ? (
        <div className="flex items-center justify-center py-24 text-zinc-400 text-sm">
          No data available for this period.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total Revenue",
                value: `Rs. ${report.totalSales?.toLocaleString() ?? "0"}`,
                icon: TrendingUp,
                color: "text-green-600",
                bg: "bg-green-50",
                border: "border-green-100",
              },
              {
                label: "Total Expenses",
                value: `Rs. ${report.totalPurchases?.toLocaleString() ?? "0"}`,
                icon: TrendingDown,
                color: "text-red-500",
                bg: "bg-red-50",
                border: "border-red-100",
              },
              {
                label: "Net Profit",
                value: `Rs. ${report.netProfit?.toLocaleString() ?? "0"}`,
                icon: DollarSign,
                color: report.netProfit >= 0 ? "text-orange-600" : "text-red-600",
                bg: report.netProfit >= 0 ? "bg-orange-50" : "bg-red-50",
                border: report.netProfit >= 0 ? "border-orange-100" : "border-red-100",
              },
            ].map(({ label, value, icon: Icon, color, bg, border }) => (
              <div key={label} className={`bg-white border ${border} rounded-2xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-zinc-500">{label}</p>
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                </div>
                <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Top selling parts */}
          {report.topSellingParts && report.topSellingParts.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 px-5 pt-5 pb-3 border-b border-zinc-100">
                <Package className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-900">Top Selling Parts</h3>
                <span className="text-[10px] text-zinc-400 ml-auto">
                  {period === "daily" ? "Today" : period === "monthly" ? "This month" : "This year"}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {["#", "Part Name", "Qty Sold", "Revenue"].map(h => (
                        <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.topSellingParts.map((p, i) => {
                      const maxQty = Math.max(...report.topSellingParts.map(x => x.totalQuantitySold), 1);
                      return (
                        <tr key={p.partName} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-5 py-3 text-[11px] text-zinc-400 tabular-nums border-b border-zinc-50">{i + 1}</td>
                          <td className="px-5 py-3 border-b border-zinc-50">
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                                <BarChart3 className="w-3 h-3 text-orange-500" />
                              </div>
                              <span className="text-sm font-medium text-zinc-800">{p.partName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 border-b border-zinc-50">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-orange-400"
                                  style={{ width: `${(p.totalQuantitySold / maxQty) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm tabular-nums text-zinc-600">{p.totalQuantitySold}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm font-semibold text-zinc-900 tabular-nums border-b border-zinc-50">
                            Rs. {p.totalRevenue.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

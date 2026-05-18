"use client";

import PageHeader from "@/components/layout/PageHeader";
import Table from "@/components/ui/Table";
import { useParts } from "@/hooks/useParts";
import { ROUTES } from "@/constants/routes";
import { AlertTriangle, Box, DollarSign, Package } from "lucide-react";
import Link from "next/link";
import ExportPdfButton from "@/components/ui/ExportPdfButton";
import { exportInventoryReportPdf } from "@/lib/exportPdf";

export default function InventoryReportPage() {
  const { data, isLoading } = useParts(1, 100);
  const parts = data?.data ?? [];

  const totalUnits = parts.reduce((sum, p) => sum + (p.stockQuantity ?? 0), 0);
  const stockValue = parts.reduce(
    (sum, p) => sum + (p.stockQuantity ?? 0) * (p.price ?? 0),
    0
  );
  const lowStock = parts.filter(
    (p) => (p.stockQuantity ?? 0) < (p.lowStockThreshold ?? 10)
  );

  const statCards = [
    { label: "Total parts", value: parts.length.toString(), icon: Box, bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Units in stock", value: totalUnits.toLocaleString(), icon: Package, bg: "bg-green-50", color: "text-green-600" },
    { label: "Inventory value", value: `Rs. ${stockValue.toLocaleString()}`, icon: DollarSign, bg: "bg-orange-50", color: "text-orange-600" },
  ];

  return (
    <div>
      <PageHeader
        title="Inventory Report"
        subtitle="Stock levels, valuation, and low-stock items"
        breadcrumb={[{ label: "Admin" }, { label: "Analytics" }, { label: "Inventory" }]}
        action={
          <>
            <ExportPdfButton
              size="md"
              onExport={() =>
                exportInventoryReportPdf(parts, {
                  totalParts: parts.length,
                  totalUnits,
                  stockValue,
                })
              }
            />
            <Link
              href={ROUTES.ADMIN_PARTS}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              <Package className="w-4 h-4" /> Manage parts
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-500">{label}</p>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-zinc-900 tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-semibold text-orange-900">
              {lowStock.length} part{lowStock.length === 1 ? "" : "s"} below threshold
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <span
                key={p.partId}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-orange-100 text-xs font-medium text-zinc-700"
              >
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                {p.name} ({p.stockQuantity} left)
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table
          columns={[
            {
              key: "name",
              header: "Part",
              render: (r) => (
                <span className="font-medium text-zinc-800">{String((r as { name?: string }).name ?? "")}</span>
              ),
            },
            {
              key: "stock",
              header: "Stock",
              render: (r) => {
                const qty = Number((r as { stockQuantity?: number }).stockQuantity ?? 0);
                const threshold = Number((r as { lowStockThreshold?: number }).lowStockThreshold ?? 10);
                const isLow = qty < threshold;
                return (
                  <span className={isLow ? "font-semibold text-orange-600 tabular-nums" : "tabular-nums text-zinc-600"}>
                    {qty}{isLow ? " (low)" : ""}
                  </span>
                );
              },
            },
            {
              key: "threshold",
              header: "Threshold",
              render: (r) => (
                <span className="tabular-nums text-zinc-500">
                  {String((r as { lowStockThreshold?: number }).lowStockThreshold ?? "—")}
                </span>
              ),
            },
            {
              key: "price",
              header: "Unit price",
              render: (r) => (
                <span className="tabular-nums text-zinc-600">
                  Rs. {Number((r as { price?: number }).price ?? 0).toLocaleString()}
                </span>
              ),
            },
            {
              key: "value",
              header: "Stock value",
              render: (r) => {
                const row = r as { stockQuantity?: number; price?: number };
                const val = (row.stockQuantity ?? 0) * (row.price ?? 0);
                return <span className="tabular-nums font-medium text-zinc-800">Rs. {val.toLocaleString()}</span>;
              },
            },
          ]}
          data={parts as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          emptyMessage="No parts in inventory."
        />
      </div>
    </div>
  );
}

export type CustomerInvoiceDetail = {
  invoiceId?: string;
  saleDate?: string;
  createdAt?: string;
  staffName?: string;
  totalAmount?: number;
  discountApplied?: number;
  isPaid?: boolean;
  items?: {
    partName?: string;
    partId?: string;
    quantity?: number;
    unitPrice?: number;
    lineTotal?: number;
  }[];
};

/** Map API/history payload to modal detail shape. */
export function mapRawToCustomerInvoiceDetail(
  raw: Record<string, unknown>,
  fallbackId?: string
): CustomerInvoiceDetail {
  const total = Number(raw.totalAmount ?? 0);
  const discount = Number(raw.discountApplied ?? 0);
  return {
    invoiceId: String(raw.invoiceId ?? raw.InvoiceId ?? fallbackId ?? ""),
    saleDate: String(raw.saleDate ?? raw.SaleDate ?? raw.createdAt ?? ""),
    staffName: String(raw.staffName ?? raw.StaffName ?? ""),
    totalAmount: total,
    discountApplied: discount,
    isPaid: Boolean(raw.isPaid ?? raw.IsPaid),
    items: Array.isArray(raw.items)
      ? (raw.items as Record<string, unknown>[]).map((item) => ({
          partName: String(item.partName ?? item.PartName ?? ""),
          partId: String(item.partId ?? item.PartId ?? ""),
          quantity: Number(item.quantity ?? item.Quantity ?? 0),
          unitPrice: Number(item.unitPrice ?? item.UnitPrice ?? 0),
          lineTotal:
            Number(item.quantity ?? item.Quantity ?? 0) *
            Number(item.unitPrice ?? item.UnitPrice ?? 0),
        }))
      : [],
  };
}

/** Resolve a stable sales-invoice id for API calls (full GUID string). */
export function getInvoiceId(inv: { invoiceId?: string; id?: number | string }): string {
  const raw = inv.invoiceId ?? inv.id;
  if (raw == null || raw === "" || raw === 0 || raw === "0") return "";
  return String(raw).trim();
}

export function isValidInvoiceId(id: string | null | undefined): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function formatInvoiceLabel(id: string): string {
  return id ? id.slice(0, 8).toUpperCase() : "—";
}

export type DateFilterable = { createdAt?: string; saleDate?: string };

export function filterByDateRange<T extends DateFilterable>(
  items: T[],
  from?: string,
  to?: string,
  dateField: "createdAt" | "saleDate" = "createdAt"
): T[] {
  if (!from && !to) return items;
  const fromMs = from ? new Date(from).setHours(0, 0, 0, 0) : null;
  const toMs = to ? new Date(to).setHours(23, 59, 59, 999) : null;

  return items.filter((item) => {
    const raw = dateField === "saleDate" ? item.saleDate ?? item.createdAt : item.createdAt ?? item.saleDate;
    if (!raw) return false;
    const t = new Date(raw).getTime();
    if (fromMs != null && t < fromMs) return false;
    if (toMs != null && t > toMs) return false;
    return true;
  });
}

export function filterBySearch<T>(items: T[], query: string, getText: (item: T) => string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => getText(item).toLowerCase().includes(q));
}

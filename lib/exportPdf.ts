"use client";

import type { FinancialReport, TopSpender } from "@/hooks/useReports";

type TableSection = {
  title: string;
  head: string[];
  body: (string | number)[][];
};

function formatRs(amount: number) {
  return `Rs. ${amount.toLocaleString("en-NP", { maximumFractionDigits: 0 })}`;
}

async function createPdfDocument(title: string, subtitle?: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  doc.setFillColor(249, 115, 22);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Veltro", 14, 12);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(title, 14, 19);
  if (subtitle) {
    doc.setFontSize(9);
    doc.text(subtitle, 14, 24);
  }

  doc.setTextColor(60, 60, 60);
  const generated = new Date().toLocaleString("en-NP", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  doc.setFontSize(8);
  doc.text(`Generated: ${generated}`, 14, 34);

  return doc;
}

async function appendTables(doc: Awaited<ReturnType<typeof createPdfDocument>>, sections: TableSection[], startY = 40) {
  const autoTable = (await import("jspdf-autotable")).default;
  let y = startY;

  for (const section of sections) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(24, 24, 27);
    doc.text(section.title, 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [section.head],
      body: section.body,
      theme: "grid",
      headStyles: {
        fillColor: [249, 115, 22],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: [63, 63, 70] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { left: 14, right: 14 },
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  return doc;
}

export async function exportFinancialReportPdf(
  report: FinancialReport,
  periodLabel: string,
  filename?: string
) {
  const doc = await createPdfDocument("Financial Report", periodLabel);

  const netProfit = report.netProfit ?? report.totalSales - report.totalPurchases;

  await appendTables(doc, [
    {
      title: "Summary",
      head: ["Metric", "Amount"],
      body: [
        ["Total Revenue", formatRs(report.totalSales)],
        ["Total Expenses", formatRs(report.totalPurchases)],
        ["Net Profit", formatRs(netProfit)],
      ],
    },
    {
      title: "Monthly Revenue Breakdown",
      head: ["Month", "Revenue", "Expenses"],
      body: (report.monthlySales ?? []).map((m) => [
        m.month,
        formatRs(m.revenue),
        formatRs(m.expenses),
      ]),
    },
    {
      title: "Top Selling Parts",
      head: ["Part", "Qty Sold", "Revenue"],
      body: (report.topSellingParts ?? []).map((p) => [
        p.partName,
        p.totalQuantitySold,
        formatRs(p.totalRevenue),
      ]),
    },
  ]);

  doc.save(filename ?? `veltro-financial-report-${report.period}.pdf`);
}

export async function exportTopCustomersPdf(
  customers: TopSpender[],
  title = "Customer Report",
  filename = "veltro-customer-report.pdf"
) {
  const doc = await createPdfDocument(title, "Top spenders and customer insights");

  await appendTables(doc, [
    {
      title: "Top Customers by Spend",
      head: ["#", "Customer", "Total Spent"],
      body: customers.map((c, i) => [i + 1, c.name, formatRs(c.totalSpent)]),
    },
  ]);

  doc.save(filename);
}

export async function exportInventoryReportPdf(
  parts: {
    name: string;
    stockQuantity?: number;
    lowStockThreshold?: number;
    price?: number;
  }[],
  summary: { totalParts: number; totalUnits: number; stockValue: number }
) {
  const doc = await createPdfDocument("Inventory Report", "Stock levels and valuation");

  await appendTables(doc, [
    {
      title: "Overview",
      head: ["Metric", "Value"],
      body: [
        ["Total parts", summary.totalParts],
        ["Units in stock", summary.totalUnits.toLocaleString()],
        ["Inventory value", formatRs(summary.stockValue)],
      ],
    },
    {
      title: "Parts Inventory",
      head: ["Part", "Stock", "Threshold", "Unit Price", "Stock Value"],
      body: parts.map((p) => {
        const qty = p.stockQuantity ?? 0;
        const price = p.price ?? 0;
        return [
          p.name,
          qty,
          p.lowStockThreshold ?? 10,
          formatRs(price),
          formatRs(qty * price),
        ];
      }),
    },
  ]);

  doc.save("veltro-inventory-report.pdf");
}

export async function exportDashboardPdf(
  report: FinancialReport,
  topCustomers: TopSpender[],
  lowStock: { name: string; stockQuantity?: number }[]
) {
  const doc = await createPdfDocument("Dashboard Summary", "Monthly overview export");
  const netProfit = report.netProfit ?? report.totalSales - report.totalPurchases;

  await appendTables(doc, [
    {
      title: "Financial Summary (This Month)",
      head: ["Metric", "Amount"],
      body: [
        ["Total Revenue", formatRs(report.totalSales)],
        ["Total Expenses", formatRs(report.totalPurchases)],
        ["Net Profit", formatRs(netProfit)],
      ],
    },
    {
      title: "Monthly Revenue",
      head: ["Month", "Revenue", "Expenses"],
      body: (report.monthlySales ?? []).map((m) => [
        m.month,
        formatRs(m.revenue),
        formatRs(m.expenses),
      ]),
    },
    {
      title: "Top Customers",
      head: ["Customer", "Total Spent"],
      body: topCustomers.map((c) => [c.name, formatRs(c.totalSpent)]),
    },
    {
      title: "Low Stock Alerts",
      head: ["Part", "Units Left"],
      body:
        lowStock.length > 0
          ? lowStock.map((p) => [p.name, p.stockQuantity ?? 0])
          : [["All stock levels OK", "—"]],
    },
  ]);

  doc.save("veltro-dashboard-summary.pdf");
}

export type CustomerPurchaseExportRow = {
  invoiceId: string;
  date: string;
  totalAmount: number;
  discountApplied: number;
  finalAmount: number;
  status: string;
};

export type CustomerServiceExportRow = {
  scheduledDate: string;
  status: string;
  notes?: string;
};

export async function exportCustomerPurchaseHistoryPdf(
  purchases: CustomerPurchaseExportRow[],
  customerName?: string
) {
  const doc = await createPdfDocument(
    "Purchase History",
    customerName ? `Purchases for ${customerName}` : "Your parts purchase records"
  );

  const totalSpent = purchases.reduce((sum, row) => sum + row.finalAmount, 0);
  const totalSaved = purchases.reduce((sum, row) => sum + row.discountApplied, 0);

  await appendTables(doc, [
    {
      title: "Summary",
      head: ["Metric", "Value"],
      body: [
        ["Total purchases", purchases.length],
        ["Total spent", formatRs(totalSpent)],
        ["Total discounts", formatRs(totalSaved)],
      ],
    },
    {
      title: "Purchase Records",
      head: ["Invoice", "Date", "Subtotal", "Discount", "Total", "Status"],
      body:
        purchases.length > 0
          ? purchases.map((row) => [
              `#${row.invoiceId.slice(0, 8).toUpperCase()}`,
              new Date(row.date).toLocaleDateString("en-NP", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              formatRs(row.totalAmount),
              formatRs(row.discountApplied),
              formatRs(row.finalAmount),
              row.status,
            ])
          : [["—", "—", "—", "—", "—", "No purchases"]],
    },
  ]);

  doc.save("veltro-purchase-history.pdf");
}

// ─── Sales Invoice exports ────────────────────────────────────────────────────

export type SalesInvoiceExportRow = {
  invoiceId: string;
  customerName: string;
  customerEmail?: string;
  staffName?: string;
  saleDate: string;
  totalAmount: number;
  discountApplied: number;
  finalAmount: number;
  isPaid: boolean;
  items?: { partName: string; quantity: number; unitPrice: number; lineTotal: number }[];
};

/** Export the full sales invoice list as a PDF table. */
export async function exportSalesInvoicesPdf(
  invoices: SalesInvoiceExportRow[],
  filename = "veltro-sales-invoices.pdf"
) {
  const doc = await createPdfDocument("Sales Invoices", "All customer sales records");

  const totalRevenue = invoices.reduce((s, i) => s + i.finalAmount, 0);
  const totalDiscount = invoices.reduce((s, i) => s + i.discountApplied, 0);
  const paidCount = invoices.filter((i) => i.isPaid).length;

  await appendTables(doc, [
    {
      title: "Summary",
      head: ["Metric", "Value"],
      body: [
        ["Total invoices", invoices.length],
        ["Paid", paidCount],
        ["Unpaid", invoices.length - paidCount],
        ["Total discounts given", formatRs(totalDiscount)],
        ["Total revenue", formatRs(totalRevenue)],
      ],
    },
    {
      title: "Invoice List",
      head: ["Invoice #", "Customer", "Date", "Subtotal", "Discount", "Total", "Status"],
      body: invoices.map((inv) => [
        `#${inv.invoiceId.slice(0, 8).toUpperCase()}`,
        inv.customerName,
        new Date(inv.saleDate).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" }),
        formatRs(inv.totalAmount),
        inv.discountApplied > 0 ? `-${formatRs(inv.discountApplied)}` : "—",
        formatRs(inv.finalAmount),
        inv.isPaid ? "Paid" : "Unpaid",
      ]),
    },
  ]);

  doc.save(filename);
}

/** Export a single sales invoice as a detailed PDF receipt. */
export async function exportSingleSalesInvoicePdf(inv: SalesInvoiceExportRow) {
  const doc = await createPdfDocument(
    `Sales Invoice #${inv.invoiceId.slice(0, 8).toUpperCase()}`,
    `Customer: ${inv.customerName}`
  );

  const sections: TableSection[] = [
    {
      title: "Invoice Details",
      head: ["Field", "Value"],
      body: [
        ["Invoice #", `#${inv.invoiceId.slice(0, 8).toUpperCase()}`],
        ["Customer", inv.customerName],
        ["Email", inv.customerEmail ?? "—"],
        ["Staff", inv.staffName ?? "—"],
        ["Date", new Date(inv.saleDate).toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric" })],
        ["Payment Status", inv.isPaid ? "Paid" : "Unpaid"],
      ],
    },
  ];

  if (inv.items && inv.items.length > 0) {
    sections.push({
      title: "Line Items",
      head: ["Part", "Qty", "Unit Price", "Line Total"],
      body: inv.items.map((item) => [
        item.partName,
        item.quantity,
        formatRs(item.unitPrice),
        formatRs(item.lineTotal),
      ]),
    });
  }

  sections.push({
    title: "Totals",
    head: ["", "Amount"],
    body: [
      ["Subtotal", formatRs(inv.totalAmount)],
      ...(inv.discountApplied > 0 ? [["Loyalty Discount (10%)", `-${formatRs(inv.discountApplied)}`] as [string, string]] : []),
      ["Total", formatRs(inv.finalAmount)],
    ],
  });

  await appendTables(doc, sections);
  doc.save(`veltro-invoice-${inv.invoiceId.slice(0, 8).toUpperCase()}.pdf`);
}

// ─── Purchase Invoice exports ─────────────────────────────────────────────────

export type PurchaseInvoiceExportRow = {
  invoiceId: string;
  vendorName: string;
  purchaseDate: string;
  totalAmount: number;
  notes?: string;
  items?: { partName: string; quantity: number; unitPrice: number; lineTotal: number }[];
};

/** Export the full purchase invoice list as a PDF table. */
export async function exportPurchaseInvoicesPdf(
  invoices: PurchaseInvoiceExportRow[],
  filename = "veltro-purchase-invoices.pdf"
) {
  const doc = await createPdfDocument("Purchase Invoices", "All vendor purchase records");

  const totalSpent = invoices.reduce((s, i) => s + i.totalAmount, 0);

  await appendTables(doc, [
    {
      title: "Summary",
      head: ["Metric", "Value"],
      body: [
        ["Total invoices", invoices.length],
        ["Total spent", formatRs(totalSpent)],
      ],
    },
    {
      title: "Invoice List",
      head: ["Invoice #", "Vendor", "Date", "Items", "Total"],
      body: invoices.map((inv) => [
        `#${inv.invoiceId.slice(0, 8).toUpperCase()}`,
        inv.vendorName,
        new Date(inv.purchaseDate).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" }),
        inv.items?.length ?? 0,
        formatRs(inv.totalAmount),
      ]),
    },
  ]);

  doc.save(filename);
}

/** Export a single purchase invoice as a detailed PDF. */
export async function exportSinglePurchaseInvoicePdf(inv: PurchaseInvoiceExportRow) {
  const doc = await createPdfDocument(
    `Purchase Invoice #${inv.invoiceId.slice(0, 8).toUpperCase()}`,
    `Vendor: ${inv.vendorName}`
  );

  const sections: TableSection[] = [
    {
      title: "Invoice Details",
      head: ["Field", "Value"],
      body: [
        ["Invoice #", `#${inv.invoiceId.slice(0, 8).toUpperCase()}`],
        ["Vendor", inv.vendorName],
        ["Date", new Date(inv.purchaseDate).toLocaleDateString("en-NP", { year: "numeric", month: "long", day: "numeric" })],
        ...(inv.notes ? [["Notes", inv.notes] as [string, string]] : []),
      ],
    },
  ];

  if (inv.items && inv.items.length > 0) {
    sections.push({
      title: "Line Items",
      head: ["Part", "Qty", "Unit Price", "Line Total"],
      body: inv.items.map((item) => [
        item.partName,
        item.quantity,
        formatRs(item.unitPrice),
        formatRs(item.lineTotal),
      ]),
    });
  }

  sections.push({
    title: "Total",
    head: ["", "Amount"],
    body: [["Total Paid", formatRs(inv.totalAmount)]],
  });

  await appendTables(doc, sections);
  doc.save(`veltro-purchase-${inv.invoiceId.slice(0, 8).toUpperCase()}.pdf`);
}

export async function exportCustomerServiceHistoryPdf(
  appointments: CustomerServiceExportRow[],
  customerName?: string
) {
  const doc = await createPdfDocument(
    "Service History",
    customerName ? `Service visits for ${customerName}` : "Your appointment records"
  );

  await appendTables(doc, [
    {
      title: "Summary",
      head: ["Metric", "Value"],
      body: [["Total appointments", appointments.length]],
    },
    {
      title: "Service Records",
      head: ["Date", "Status", "Notes"],
      body:
        appointments.length > 0
          ? appointments.map((row) => [
              new Date(row.scheduledDate).toLocaleDateString("en-NP", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              row.status,
              row.notes?.trim() || "—",
            ])
          : [["—", "—", "No service history"]],
    },
  ]);

  doc.save("veltro-service-history.pdf");
}

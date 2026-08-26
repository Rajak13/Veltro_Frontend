"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CustomerInvoiceViewModal from "@/components/invoices/CustomerInvoiceViewModal";
import { useCustomerInvoiceViewer } from "@/hooks/useCustomerInvoiceViewer";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import ExportPdfButton from "@/components/ui/ExportPdfButton";
import { useMyPurchaseHistory, type PurchaseHistoryInvoice } from "@/hooks/useInvoices";
import { useMyAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";
import {
  exportCustomerPurchaseHistoryPdf,
  exportCustomerServiceHistoryPdf,
} from "@/lib/exportPdf";
import { formatAppointmentStatus, normalizeStatusLabel } from "@/lib/status";
import { FileText, Car } from "lucide-react";
import type { SalesInvoice as _SalesInvoice } from "@/types";
import ListFilters from "@/components/filters/ListFilters";
import { getInvoiceId, filterByDateRange, filterBySearch } from "@/lib/invoices";
import { useMemo } from "react";

type Tab = "purchases" | "services";

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>("purchases");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const { user } = useAuth();
  const { invoiceId, preview, isOpen, openInvoice, closeInvoice } = useCustomerInvoiceViewer();
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceFrom, setServiceFrom] = useState("");
  const [serviceTo, setServiceTo] = useState("");
  const [serviceStatus, setServiceStatus] = useState("");
  const { data: invoices, isLoading: loadingInvoices } = useMyPurchaseHistory();
  const { data: appointments, isLoading: loadingAppts } = useMyAppointments();

  const filteredInvoices = useMemo(() => {
    let list = invoices ?? [];
    list = filterByDateRange(list, fromDate, toDate, "createdAt");
    if (payStatus === "paid") list = list.filter((i) => i.status === "Completed");
    if (payStatus === "unpaid") list = list.filter((i) => i.status !== "Completed");
    list = filterBySearch(list, search, (i) =>
      `${getInvoiceId(i)} ${i.status} ${i.finalAmount}`
    );
    return list;
  }, [invoices, fromDate, toDate, payStatus, search]);

  const purchaseRows = filteredInvoices.map((inv) => ({
    invoiceId: getInvoiceId(inv),
    date: inv.createdAt,
    totalAmount: inv.totalAmount ?? 0,
    discountApplied: inv.discountApplied ?? 0,
    finalAmount: inv.finalAmount ?? inv.totalAmount ?? 0,
    status: normalizeStatusLabel(inv.status),
  }));

  const filteredAppointments = useMemo(() => {
    let list = appointments ?? [];
    list = filterByDateRange(
      list.map((a) => ({ ...a, createdAt: a.scheduledDate })),
      serviceFrom,
      serviceTo
    );
    if (serviceStatus) {
      list = list.filter(
        (a) => formatAppointmentStatus(a.status).toLowerCase() === serviceStatus.toLowerCase()
      );
    }
    list = filterBySearch(list, serviceSearch, (a) =>
      `${formatAppointmentStatus(a.status)} ${a.notes ?? ""} ${a.scheduledDate}`
    );
    return list;
  }, [appointments, serviceFrom, serviceTo, serviceStatus, serviceSearch]);

  const serviceRows = filteredAppointments.map((appt) => ({
    scheduledDate: appt.scheduledDate,
    status: formatAppointmentStatus(appt.status),
    notes: appt.notes,
  }));

  const canExportPurchases = !loadingInvoices && purchaseRows.length > 0;
  const canExportServices = !loadingAppts && serviceRows.length > 0;

  return (
    <div>
      <PageHeader
        title="My History"
        subtitle="All your purchases and service visits"
        breadcrumb={[{ label: "Customer" }, { label: "History" }]}
        action={
          tab === "purchases" ? (
            <ExportPdfButton
              size="md"
              label="Export Purchases PDF"
              onExport={() =>
                exportCustomerPurchaseHistoryPdf(purchaseRows, user?.name)
              }
              className={!canExportPurchases ? "opacity-50 pointer-events-none" : ""}
            />
          ) : (
            <ExportPdfButton
              size="md"
              label="Export Services PDF"
              onExport={() =>
                exportCustomerServiceHistoryPdf(serviceRows, user?.name)
              }
              className={!canExportServices ? "opacity-50 pointer-events-none" : ""}
            />
          )
        }
      />

      <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl w-full sm:w-fit mb-6">
        {(["purchases", "services"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all capitalize text-center ${
              tab === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {t === "purchases" ? "Purchases" : "Services"}
          </button>
        ))}
      </div>


      {tab === "purchases" && (
        <ListFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search invoice # or amount…"
          showDateRange
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          status={payStatus}
          onStatusChange={setPayStatus}
          statusLabel="Payment"
          statusOptions={[
            { value: "", label: "All" },
            { value: "paid", label: "Paid" },
            { value: "unpaid", label: "Unpaid" },
          ]}
          onClear={() => {
            setSearch("");
            setFromDate("");
            setToDate("");
            setPayStatus("");
          }}
        />
      )}

      {tab === "purchases" &&
        (loadingInvoices ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="text-orange-500" />
          </div>
        ) : !(invoices ?? []).length ? (
          <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
            No purchase history yet.
          </div>
        ) : !filteredInvoices.length ? (
          <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
            No invoices match your filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((inv) => {
              const id = getInvoiceId(inv);
              return (
                <Card key={id} padding="md" className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">Invoice #{id.slice(0, 8)}</p>
                      <p className="text-xs text-zinc-400">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-sm font-semibold text-zinc-900">
                      Rs. {(inv.finalAmount ?? inv.totalAmount ?? 0).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        label={normalizeStatusLabel(inv.status)}
                        variant={statusVariant(inv.status)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          openInvoice(id, (inv as PurchaseHistoryInvoice).invoiceDetail)
                        }
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ))}

      {tab === "services" && (
        <ListFilters
          search={serviceSearch}
          onSearchChange={setServiceSearch}
          searchPlaceholder="Search notes or status…"
          showDateRange
          fromDate={serviceFrom}
          toDate={serviceTo}
          onFromDateChange={setServiceFrom}
          onToDateChange={setServiceTo}
          status={serviceStatus}
          onStatusChange={setServiceStatus}
          statusLabel="Status"
          statusOptions={[
            { value: "", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          onClear={() => {
            setServiceSearch("");
            setServiceFrom("");
            setServiceTo("");
            setServiceStatus("");
          }}
        />
      )}

      {tab === "services" &&
        (loadingAppts ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="text-orange-500" />
          </div>
        ) : appointments?.length ? (
          !filteredAppointments.length ? (
            <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
              No appointments match your filters.
            </div>
          ) : (
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Date &amp; Time</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Service Type</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Notes</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appt, idx) => {
                    const id = appt.appointmentId ?? String(appt.id ?? idx);
                    const statusLabel = formatAppointmentStatus(appt.status);
                    const date = new Date(appt.scheduledDate);
                    const serviceType = (appt as typeof appt & { serviceType?: string }).serviceType || "Service";
                    return (
                      <tr key={id} className="border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors last:border-b-0">
                        <td className="px-5 py-3.5">
                          <div className="text-[13px] font-semibold text-zinc-800">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center flex-shrink-0">
                              <Car className="w-3 h-3 text-zinc-400" />
                            </div>
                            <span className="text-[13px] text-zinc-700 font-medium">{serviceType}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[13px] text-zinc-500">{appt.notes ?? "—"}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge label={statusLabel} variant={statusVariant(appt.status)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          )
        ) : (
          <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
            No service history yet.
          </div>
        ))}

      <CustomerInvoiceViewModal
        invoiceId={invoiceId}
        preview={preview}
        open={isOpen}
        onClose={closeInvoice}
      />
    </div>
  );
}

"use client";

// Feature 14 — Purchase + Service History (Customer)
// Assigned to: [Siddhartha Raj Thapa]
// Branch: feature/customer-history
// API endpoints: GET /api/invoices/sales/my, GET /api/appointments/my

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { useMyPurchaseHistory } from "@/hooks/useInvoices";
import { useMyAppointments } from "@/hooks/useAppointments";
import { FileText, Calendar } from "lucide-react";

type Tab = "purchases" | "services";

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>("purchases");
  const { data: invoices, isLoading: loadingInvoices } = useMyPurchaseHistory();
  const { data: appointments, isLoading: loadingAppts } = useMyAppointments();

  return (
    <div>
      <PageHeader
        title="My History"
        subtitle="All your purchases and service visits"
        breadcrumb={[{ label: "Customer" }, { label: "History" }]}
      />

      {/* TODO [Siddhartha Raj Thapa]: Implement tabbed history view.
          Purchases tab: list of sales invoices with items, total, discount, date.
          Services tab: list of completed appointments with service type, date, vehicle. */}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl w-fit mb-6">
        {(["purchases", "services"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {t === "purchases" ? "Purchases" : "Services"}
          </button>
        ))}
      </div>

      {tab === "purchases" && (
        loadingInvoices ? (
          <div className="flex justify-center py-16"><Spinner size="lg" className="text-orange-500" /></div>
        ) : invoices?.length ? (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <Card key={inv.id} padding="md" className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Invoice #{inv.id}</p>
                    <p className="text-xs text-zinc-400">{new Date(inv.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-900">Rs. {inv.finalAmount.toLocaleString()}</p>
                  <Badge label={inv.status} variant={statusVariant(inv.status)} />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
            No purchase history yet.
          </div>
        )
      )}

      {tab === "services" && (
        loadingAppts ? (
          <div className="flex justify-center py-16"><Spinner size="lg" className="text-orange-500" /></div>
        ) : appointments?.length ? (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <Card key={appt.id} padding="md" className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Service Appointment</p>
                    <p className="text-xs text-zinc-400">{new Date(appt.scheduledDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge label={appt.status} variant={statusVariant(appt.status)} />
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
            No service history yet.
          </div>
        )
      )}
    </div>
  );
}

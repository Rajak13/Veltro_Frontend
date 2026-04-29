"use client";

// Feature 8 — Customer Detail + History (Staff)
// Assigned to: [Punya Kumari Tamang]
// Branch: feature/customer-history
// API endpoints:
//   GET /api/staff/customers/:id
//   GET /api/staff/customers/:id/history

import { use } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { useCustomer, useCustomerHistory } from "@/hooks/useCustomers";
import { ROUTES } from "@/constants/routes";
import { User, Car, ShoppingBag, CalendarClock } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRs(amount: number) {
  return `Rs. ${amount.toLocaleString()}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: customer, isLoading: loadingCustomer } = useCustomer(id);
  const { data: history,  isLoading: loadingHistory  } = useCustomerHistory(id);

  if (loadingCustomer) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" className="text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={customer?.fullName ?? "Customer Detail"}
        subtitle={customer?.email}
        breadcrumb={[
          { label: "Staff" },
          { label: "Customers", href: ROUTES.STAFF_CUSTOMERS },
          { label: customer?.fullName ?? "Detail" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Profile card ─────────────────────────────────────────────────── */}
        <Card padding="md" className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900">{customer?.fullName}</p>
              <p className="text-sm text-zinc-400">{customer?.phone ?? "—"}</p>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Email</span>
              <span className="font-medium text-zinc-700 text-right max-w-[60%] truncate">
                {customer?.email ?? "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Address</span>
              <span className="font-medium text-zinc-700 text-right max-w-[60%]">
                {customer?.address ?? "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Credit Balance</span>
              <span className="font-medium text-zinc-700">
                {formatRs(customer?.creditBalance ?? 0)}
              </span>
            </div>
          </div>
        </Card>

        {/* ── Vehicles ─────────────────────────────────────────────────────── */}
        <Card padding="md" className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-800">Vehicles</h2>
            <span className="ml-auto text-xs text-zinc-400">
              {customer?.vehicles?.length ?? 0} registered
            </span>
          </div>
          {customer?.vehicles?.length ? (
            <div className="space-y-2">
              {customer.vehicles.map((v) => (
                <div
                  key={v.vehicleId}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-800">
                      {v.make} {v.model} — {v.year}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {v.registrationNumber ?? "No plate"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No vehicles registered.</p>
          )}
        </Card>

        {/* ── Purchase History ─────────────────────────────────────────────── */}
        <Card padding="md" className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-800">Purchase History</h2>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <Spinner size="sm" className="text-orange-400" />
            </div>
          ) : (history?.purchases?.length ?? 0) === 0 ? (
            <p className="text-sm text-zinc-400 py-4 text-center">No purchases yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {["Date", "Total Amount", "Discount", "Final Amount", "Paid"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history!.purchases.map((p) => (
                    <tr key={p.invoiceId} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 text-zinc-600 border-b border-zinc-50">
                        {formatDate(p.saleDate)}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-zinc-800 font-medium border-b border-zinc-50">
                        {formatRs(p.totalAmount)}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-zinc-500 border-b border-zinc-50">
                        {p.discountApplied > 0 ? `- ${formatRs(p.discountApplied)}` : "—"}
                      </td>
                      <td className="px-4 py-3 tabular-nums font-semibold text-zinc-900 border-b border-zinc-50">
                        {formatRs(p.totalAmount - p.discountApplied)}
                      </td>
                      <td className="px-4 py-3 border-b border-zinc-50">
                        <Badge
                          label={p.isPaid ? "Paid" : "Unpaid"}
                          variant={p.isPaid ? "success" : "warning"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ── Appointment History ──────────────────────────────────────────── */}
        <Card padding="md" className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-800">Service Appointments</h2>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <Spinner size="sm" className="text-orange-400" />
            </div>
          ) : (history?.appointments?.length ?? 0) === 0 ? (
            <p className="text-sm text-zinc-400 py-4 text-center">No appointments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {["Scheduled Date", "Status", "Notes"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history!.appointments.map((a) => (
                    <tr key={a.appointmentId} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 text-zinc-600 border-b border-zinc-50">
                        {formatDate(a.scheduledDate)}
                      </td>
                      <td className="px-4 py-3 border-b border-zinc-50">
                        <Badge
                          label={a.status}
                          variant={statusVariant(a.status)}
                        />
                      </td>
                      <td className="px-4 py-3 text-zinc-500 border-b border-zinc-50">
                        {a.notes ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}

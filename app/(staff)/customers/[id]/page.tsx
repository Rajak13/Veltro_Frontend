"use client";

// Feature 8 — Customer Detail + History (Staff)
// Assigned to: [Punya Kumari Tamang]
// Branch: feature/customer-detail
// API endpoints: GET /api/customers/:id, GET /api/customers/:id/history

import { use } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { useCustomer } from "@/hooks/useCustomers";
import { ROUTES } from "@/constants/routes";
import { User, Car, FileText } from "lucide-react";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: customer, isLoading } = useCustomer(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" className="text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={customer?.user?.name ?? "Customer Detail"}
        subtitle={customer?.user?.email}
        breadcrumb={[
          { label: "Staff" },
          { label: "Customers", href: ROUTES.STAFF_CUSTOMERS },
          { label: customer?.user?.name ?? "Detail" },
        ]}
      />

      {/* TODO [Punya Kumari Tamang]: Implement full customer profile card, vehicles list,
          purchase history table, and service history table.
          Fetch history from GET /api/customers/:id/history */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card padding="md" className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <User className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900">{customer?.user?.name}</p>
              <p className="text-sm text-zinc-400">{customer?.phone}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Loyalty Points</span>
              <span className="font-medium text-orange-600">{customer?.loyaltyPoints ?? 0} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Address</span>
              <span className="font-medium text-zinc-700 text-right max-w-[60%]">{customer?.address ?? "—"}</span>
            </div>
          </div>
        </Card>

        {/* Vehicles */}
        <Card padding="md" className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-800">Vehicles</h2>
          </div>
          {customer?.vehicles?.length ? (
            <div className="space-y-2">
              {customer.vehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{v.make} {v.model} {v.year}</p>
                    <p className="text-xs text-zinc-400">{v.registrationNumber}</p>
                  </div>
                  <span className="text-xs text-zinc-400">{v.mileage?.toLocaleString()} km</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No vehicles registered.</p>
          )}
        </Card>

        {/* History placeholder */}
        <Card padding="md" className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-800">Purchase & Service History</h2>
          </div>
          <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-lg">
            {/* TODO [Punya Kumari Tamang]: Fetch and render history from /api/customers/:id/history */}
            History table will render here
          </div>
        </Card>
      </div>
    </div>
  );
}

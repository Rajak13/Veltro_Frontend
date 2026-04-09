"use client";

// Feature 13 — Request Unavailable Parts (Customer)
// Assigned to: [Siddhartha Raj Thapa]
// Branch: feature/part-requests
// API endpoints: GET /api/part-requests/my, POST /api/part-requests

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { Plus, Package } from "lucide-react";
import type { PartRequest } from "@/types";

export default function PartRequestsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // TODO [Siddhartha Raj Thapa]: Replace with useQuery hook for part requests
  const requests: PartRequest[] = [];
  const isLoading = false;

  return (
    <div>
      <PageHeader
        title="Part Requests"
        subtitle="Request parts that aren't currently in stock"
        breadcrumb={[{ label: "Customer" }, { label: "Part Requests" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Request a Part
          </Button>
        }
      />

      {/* TODO [Siddhartha Raj Thapa]: Implement part request list with status tracking.
          Show part name, description, status badge, and date submitted.
          Notify customer when status changes to "Sourced". */}

      {requests.length ? (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} padding="md" className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">{req.partName}</p>
                  <p className="text-xs text-zinc-400">{req.description}</p>
                </div>
              </div>
              <Badge label={req.status} variant={statusVariant(req.status)} />
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          No part requests yet.
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request a Part">
        {/* TODO [Siddhartha Raj Thapa]: Add form with partName + description fields using react-hook-form + zod */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}

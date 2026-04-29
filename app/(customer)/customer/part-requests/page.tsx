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
import Spinner from "@/components/ui/Spinner";
import CreatePartRequestForm from "@/components/forms/CreatePartRequestForm";
import { useMyPartRequests } from "@/hooks/usePartRequests";
import { Plus, Package, Clock, Check, X } from "lucide-react";

export default function PartRequestsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: requests, isLoading } = useMyPartRequests();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Sourced":
        return <Check className="w-5 h-5 text-green-600" />;
      case "Unavailable":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sourced":
        return "bg-green-50";
      case "Unavailable":
        return "bg-red-50";
      default:
        return "bg-orange-50";
    }
  };

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

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : requests?.length ? (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} padding="md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl ${getStatusColor(req.status)} flex items-center justify-center flex-shrink-0`}>
                    {getStatusIcon(req.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-800">{req.partName}</p>
                    <p className="text-xs text-zinc-500 mt-1">{req.description}</p>
                    <p className="text-xs text-zinc-400 mt-2">
                      Requested on {new Date(req.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge label={req.status} variant={statusVariant(req.status)} />
                  {req.status === "Sourced" && (
                    <span className="text-xs text-green-600 font-medium">
                      ✓ Available now
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center gap-3 text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          <Package className="w-12 h-12 text-zinc-300" />
          <p>No part requests yet.</p>
          <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Request Your First Part
          </Button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request a Part">
        <CreatePartRequestForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}

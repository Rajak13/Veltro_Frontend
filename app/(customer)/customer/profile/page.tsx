"use client";

// Feature 12 — Manage Profile + Vehicles (Customer)
// Assigned to: [Siddhartha Raj Thapa]
// Branch: feature/customer-profile
// API endpoints: GET/PUT /api/customers/me, POST/DELETE /api/vehicles

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { User, Car, Plus, Edit } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // TODO [Siddhartha Raj Thapa]: Fetch full customer profile from /api/customers/me
  // to get vehicles, loyalty points, address, phone

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your account and vehicles"
        breadcrumb={[{ label: "Customer" }, { label: "Profile" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile info */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <User className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900">{user?.name}</p>
                <p className="text-sm text-zinc-400">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditProfileOpen(true)}>
              <Edit className="w-3.5 h-3.5" /> Edit
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            {/* TODO [Siddhartha Raj Thapa]: Show phone, address, loyalty points from customer profile */}
            <div className="h-24 flex items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-100 rounded-lg">
              Profile details will render here
            </div>
          </div>
        </Card>

        {/* Vehicles */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-zinc-400" />
              <h2 className="text-base font-semibold text-zinc-800">My Vehicles</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => setAddVehicleOpen(true)}>
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>
          {/* TODO [Siddhartha Raj Thapa]: Render vehicle list from customer profile.
              Each vehicle: make, model, year, reg number, mileage.
              Allow editing mileage and deleting vehicles. */}
          <div className="h-32 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-lg">
            Vehicles will render here
          </div>
        </Card>
      </div>

      <Modal open={editProfileOpen} onClose={() => setEditProfileOpen(false)} title="Edit Profile">
        {/* TODO [Siddhartha Raj Thapa]: Add edit profile form (name, phone, address) */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>

      <Modal open={addVehicleOpen} onClose={() => setAddVehicleOpen(false)} title="Add Vehicle">
        {/* TODO [Siddhartha Raj Thapa]: Add vehicle form (make, model, year, reg number, mileage) */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}

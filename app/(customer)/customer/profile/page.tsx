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
import Spinner from "@/components/ui/Spinner";
import EditProfileForm from "@/components/forms/EditProfileForm";
import AddVehicleForm from "@/components/forms/AddVehicleForm";
import { useMyProfile, useDeleteVehicle } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";
import { User, Car, Plus, Edit, Trash2, MapPin, Phone, Gift } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const { user } = useAuth();
  const { data: profile, isLoading } = useMyProfile();
  const { mutateAsync: deleteVehicle } = useDeleteVehicle();

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    
    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted successfully");
    } catch {
      toast.error("Failed to delete vehicle");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" className="text-orange-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400">
        Failed to load profile
      </div>
    );
  }

  // Use user from auth as fallback if profile.user is not populated
  const displayName = profile.user?.name || user?.name || "User";
  const displayEmail = profile.user?.email || user?.email || "";

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
                <p className="font-semibold text-zinc-900">{displayName}</p>
                <p className="text-sm text-zinc-400">{displayEmail}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditProfileOpen(true)}>
              <Edit className="w-3.5 h-3.5" /> Edit
            </Button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-zinc-600">
              <Phone className="w-4 h-4 text-zinc-400" />
              <span>{profile.phone || "No phone number"}</span>
            </div>
            
            <div className="flex items-start gap-2 text-zinc-600">
              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
              <span>{profile.address || "No address"}</span>
            </div>
            
            <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
              <Gift className="w-4 h-4 text-orange-500" />
              <span className="text-zinc-700">
                <span className="font-semibold text-orange-600">{profile.loyaltyPoints || 0}</span> loyalty points
              </span>
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
          
          {profile.vehicles?.length ? (
            <div className="space-y-3">
              {profile.vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-3 rounded-lg border border-zinc-200 hover:border-orange-200 hover:bg-orange-50/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-800">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                        <span className="font-mono">{vehicle.registrationNumber}</span>
                        {vehicle.mileage && (
                          <>
                            <span key={`${vehicle.id}-separator`}>•</span>
                            <span key={`${vehicle.id}-mileage`}>{vehicle.mileage.toLocaleString()} km</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center gap-2 text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-lg">
              <Car className="w-8 h-8 text-zinc-300" />
              <p>No vehicles added yet</p>
            </div>
          )}
        </Card>
      </div>

      {editProfileOpen && (
        <Modal key="edit-profile" open={editProfileOpen} onClose={() => setEditProfileOpen(false)} title="Edit Profile">
          <EditProfileForm profile={profile} onSuccess={() => setEditProfileOpen(false)} />
        </Modal>
      )}

      <Modal key="add-vehicle" open={addVehicleOpen} onClose={() => setAddVehicleOpen(false)} title="Add Vehicle">
        <AddVehicleForm onSuccess={() => setAddVehicleOpen(false)} />
      </Modal>
    </div>
  );
}

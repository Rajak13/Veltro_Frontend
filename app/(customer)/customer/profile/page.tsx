"use client";

// Feature 12 — Manage Profile + Vehicles (Customer)

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import EditProfileForm from "@/components/forms/EditProfileForm";
import AddVehicleForm from "@/components/forms/AddVehicleForm";
import EditVehicleForm from "@/components/forms/EditVehicleForm";
import { useMyProfile, useDeleteVehicle } from "@/hooks/useCustomers";
import type { CustomerSearchResult } from "@/hooks/useCustomers";
import { useMyPurchaseHistory } from "@/hooks/useInvoices";
import { useAuth } from "@/hooks/useAuth";
import {
  User, Car, Plus, Edit, Trash2, MapPin, Phone,
  Gift, Mail, ChevronLeft, ChevronRight, Hash, Gauge,
  CheckCircle2, Percent,
} from "lucide-react";
import toast from "react-hot-toast";

type VehicleSummary = CustomerSearchResult["vehicles"][number];

const LOYALTY_THRESHOLD = 5000;

export default function ProfilePage() {
  const [addVehicleOpen, setAddVehicleOpen]   = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editingVehicle, setEditingVehicle]   = useState<VehicleSummary | null>(null);
  const [viewingVehicle, setViewingVehicle]   = useState<VehicleSummary | null>(null);
  const [carouselIdx, setCarouselIdx]         = useState(0);

  const { user } = useAuth();
  const { data: profile, isLoading } = useMyProfile();
  const { data: purchaseHistory } = useMyPurchaseHistory();
  const { mutateAsync: deleteVehicle } = useDeleteVehicle();

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted");
      setCarouselIdx(prev => Math.max(0, prev - 1));
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

  const displayName   = profile.fullName || user?.name  || "User";
  const displayEmail  = profile.email    || user?.email || "";
  const vehicles      = profile.vehicles ?? [];
  const activeVehicle = vehicles[carouselIdx];

  // Loyalty calculations
  const invoices       = purchaseHistory ?? [];
  const bestOrder      = invoices.reduce((max, inv) => Math.max(max, inv.finalAmount ?? 0), 0);
  const progressPct    = Math.min(100, Math.round((bestOrder / LOYALTY_THRESHOLD) * 100));
  const amountToUnlock = Math.max(0, LOYALTY_THRESHOLD - bestOrder);
  const unlocked       = bestOrder >= LOYALTY_THRESHOLD;
  const totalSaved     = invoices.reduce((s, inv) => s + ((inv.totalAmount ?? 0) - (inv.finalAmount ?? 0)), 0);

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your account and vehicles"
        breadcrumb={[{ label: "Customer" }, { label: "Profile" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Profile info card ── */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Orange accent bar */}
          <div className="h-1 bg-orange-500" />

          <div className="p-6">
            {/* Avatar + name row */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">{displayName}</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-100 mt-1">
                    Customer
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditProfileOpen(true)}>
                <Edit className="w-3.5 h-3.5" /> Edit
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-100 mb-5" />

            {/* Contact details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Email</p>
                  <p className="text-sm text-zinc-800 font-medium">{displayEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Phone</p>
                  <p className="text-sm text-zinc-800 font-medium">{profile.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Address</p>
                  <p className="text-sm text-zinc-800 font-medium">{profile.address || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-100 my-5" />

            {/* ── Loyalty Rewards card ── */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)", border: "1px solid #3f3f46" }}>
              {/* Header */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                      <Gift className="w-4.5 h-4.5 text-orange-400" style={{ width: "18px", height: "18px" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Loyalty Rewards</p>
                      <p className="text-[10px] text-zinc-400">10% discount on orders over Rs. 5,000</p>
                    </div>
                  </div>
                  {unlocked && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>
              </div>

              {/* Progress section */}
              <div className="mx-4 mb-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] text-zinc-400 font-medium">Progress to Next Discount</p>
                  <p className="text-[11px] font-semibold text-orange-400">{progressPct}%</p>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-zinc-700 overflow-hidden mb-2.5">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progressPct}%`,
                      background: unlocked
                        ? "linear-gradient(90deg, #22c55e, #16a34a)"
                        : "linear-gradient(90deg, #f97316, #ea580c)",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-zinc-300">
                    {unlocked ? (
                      <span className="text-green-400 font-semibold">✓ Discount unlocked on your next order!</span>
                    ) : (
                      <>
                        <span className="text-white font-semibold">Rs. {amountToUnlock.toLocaleString()}</span>
                        <span className="text-zinc-400"> more to unlock 10% OFF</span>
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-1 text-orange-400">
                    <Percent className="w-3 h-3" />
                    <span className="text-[10px] font-bold">10</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-px mx-4 mb-4 rounded-xl overflow-hidden border border-zinc-700/50">
                <div className="p-3 bg-zinc-800/60">
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wide mb-0.5">Best Single Order</p>
                  <p className="text-sm font-bold text-white tabular-nums">
                    Rs. {bestOrder.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-zinc-800/60">
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wide mb-0.5">Total Saved</p>
                  <p className="text-sm font-bold text-green-400 tabular-nums">
                    Rs. {totalSaved.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Vehicles carousel card ── */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-orange-500" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-zinc-400" />
                <h2 className="text-base font-semibold text-zinc-800">My Vehicles</h2>
                {vehicles.length > 0 && (
                  <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                    {vehicles.length}
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setAddVehicleOpen(true)}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>

            {vehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed border-zinc-100 rounded-xl">
                <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center">
                  <Car className="w-7 h-7 text-zinc-300" />
                </div>
                <p className="text-sm text-zinc-400">No vehicles added yet</p>
                <Button variant="outline" size="sm" onClick={() => setAddVehicleOpen(true)}>
                  <Plus className="w-3.5 h-3.5" /> Add your first vehicle
                </Button>
              </div>
            ) : (
              <>
                {/* Vehicle image / placeholder */}
                <button
                  type="button"
                  onClick={() => activeVehicle && setViewingVehicle(activeVehicle)}
                  className="w-full rounded-xl overflow-hidden mb-4 block"
                >
                  {activeVehicle?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeVehicle.imageUrl}
                      alt={`${activeVehicle.make} ${activeVehicle.model}`}
                      className="w-full h-44 object-cover hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-44 bg-zinc-50 border border-zinc-100 rounded-xl flex flex-col items-center justify-center gap-2 text-zinc-300 hover:bg-zinc-100 transition-colors">
                      <Car className="w-10 h-10" />
                      <span className="text-xs">Click to view details</span>
                    </div>
                  )}
                </button>

                {/* Vehicle info */}
                {activeVehicle && (
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-zinc-900">
                          {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingVehicle(activeVehicle)}
                          className="text-zinc-400 hover:text-orange-600 hover:bg-orange-50"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVehicle(activeVehicle.vehicleId)}
                          className="text-zinc-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                        <Hash className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                        <div>
                          <p className="text-[9px] text-zinc-400">Registration</p>
                          <p className="text-xs font-semibold text-zinc-800 font-mono">
                            {activeVehicle.registrationNumber || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                        <Gauge className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                        <div>
                          <p className="text-[9px] text-zinc-400">Odometer</p>
                          <p className="text-xs font-semibold text-zinc-800">
                            {activeVehicle.mileage > 0 ? `${activeVehicle.mileage.toLocaleString()} km` : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Carousel navigation */}
                {vehicles.length > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setCarouselIdx(i => Math.max(0, i - 1))}
                      disabled={carouselIdx === 0}
                      className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-1.5">
                      {vehicles.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCarouselIdx(i)}
                          className={`rounded-full transition-all ${
                            i === carouselIdx
                              ? "w-5 h-2 bg-orange-500"
                              : "w-2 h-2 bg-zinc-200 hover:bg-zinc-300"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCarouselIdx(i => Math.min(vehicles.length - 1, i + 1))}
                      disabled={carouselIdx === vehicles.length - 1}
                      className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit profile modal */}
      {editProfileOpen && (
        <Modal open={editProfileOpen} onClose={() => setEditProfileOpen(false)} title="Edit Profile">
          <EditProfileForm profile={profile} onSuccess={() => setEditProfileOpen(false)} />
        </Modal>
      )}

      {/* Add vehicle modal */}
      <Modal open={addVehicleOpen} onClose={() => setAddVehicleOpen(false)} title="Add Vehicle">
        <AddVehicleForm onSuccess={() => setAddVehicleOpen(false)} />
      </Modal>

      {/* Edit vehicle modal */}
      {editingVehicle && (
        <Modal
          open={!!editingVehicle}
          onClose={() => setEditingVehicle(null)}
          title={`Edit — ${editingVehicle.year} ${editingVehicle.make} ${editingVehicle.model}`}
        >
          <EditVehicleForm vehicle={editingVehicle} onSuccess={() => setEditingVehicle(null)} />
        </Modal>
      )}

      {/* Vehicle detail modal (read-only) */}
      {viewingVehicle && (
        <Modal
          open={!!viewingVehicle}
          onClose={() => setViewingVehicle(null)}
          title={`${viewingVehicle.year} ${viewingVehicle.make} ${viewingVehicle.model}`}
        >
          <div className="space-y-4">
            {viewingVehicle.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={viewingVehicle.imageUrl}
                alt={`${viewingVehicle.make} ${viewingVehicle.model}`}
                className="w-full h-48 object-cover rounded-xl"
              />
            )}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Make",             value: viewingVehicle.make },
                { label: "Model",            value: viewingVehicle.model },
                { label: "Year",             value: String(viewingVehicle.year) },
                { label: "Registration No.", value: viewingVehicle.registrationNumber || "—" },
                { label: "Mileage",          value: viewingVehicle.mileage > 0 ? `${viewingVehicle.mileage.toLocaleString()} km` : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                  <p className="text-[10px] text-zinc-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-zinc-800">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => { setViewingVehicle(null); setEditingVehicle(viewingVehicle); }}>
                <Edit className="w-3.5 h-3.5" /> Edit Vehicle
              </Button>
              <Button variant="outline" onClick={() => setViewingVehicle(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

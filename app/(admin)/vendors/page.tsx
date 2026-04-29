"use client";

// Feature: Vendor Management (Admin)
// API endpoints: GET /api/vendors, POST /api/vendors, PUT /api/vendors/{id}, DELETE /api/vendors/{id}

import { useState } from "react";
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor } from "@/hooks/useVendors";
import { Plus, Pencil, Trash2, Building2, Mail, Phone, MapPin, User } from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Vendor } from "@/types";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type VendorFormData = {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export default function VendorsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, refetch } = useVendors(page, pageSize);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const createMutation = useCreateVendor();
  const updateMutation = useUpdateVendor();
  const deleteMutation = useDeleteVendor();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VendorFormData>();

  const openCreateModal = () => {
    setEditingVendor(null);
    reset({ name: "", contactPerson: "", phone: "", email: "", address: "" });
    setModalOpen(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    const phoneWithoutPrefix = vendor.phone?.startsWith('977') 
      ? vendor.phone.substring(3) 
      : vendor.phone;
    
    reset({
      name: vendor.name,
      contactPerson: vendor.contactPerson ?? "",
      phone: phoneWithoutPrefix ?? "",
      email: vendor.email ?? "",
      address: vendor.address ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData: VendorFormData) => {
    try {
      const dataToSubmit = {
        ...formData,
        phone: formData.phone ? `977${formData.phone}` : formData.phone,
      };
      
      if (editingVendor) {
        await updateMutation.mutateAsync({ vendorId: editingVendor.vendorId, ...dataToSubmit });
        toast.success("Vendor updated successfully");
      } else {
        await createMutation.mutateAsync(dataToSubmit);
        toast.success("Vendor created successfully");
      }
      setModalOpen(false);
      reset();
      refetch(); // Explicitly refetch the vendors list
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Vendor deleted successfully");
      setDeleteConfirm(null);
      refetch(); // Explicitly refetch the vendors list
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Delete failed");
    }
  };

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "name",
      header: "Vendor Name",
      render: (row) => {
        const vendor = row as Vendor;
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <div className="font-medium text-zinc-900">{vendor.name}</div>
              {vendor.contactPerson && (
                <div className="text-xs text-zinc-400 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {vendor.contactPerson}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      header: "Contact Info",
      render: (row) => {
        const vendor = row as Vendor;
        return (
          <div className="space-y-1">
            {vendor.email && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                <Mail className="w-3 h-3 text-zinc-400" />
                {vendor.email}
              </div>
            )}
            {vendor.phone && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                <Phone className="w-3 h-3 text-zinc-400" />
                {vendor.phone}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "address",
      header: "Address",
      render: (row) => {
        const vendor = row as Vendor;
        return vendor.address ? (
          <div className="flex items-start gap-1.5 text-xs text-zinc-600 max-w-xs">
            <MapPin className="w-3 h-3 text-zinc-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{vendor.address}</span>
          </div>
        ) : (
          <span className="text-xs text-zinc-300">—</span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => {
        const vendor = row as Vendor;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditModal(vendor)}
              className="text-zinc-600 hover:text-orange-600"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirm(vendor.vendorId)}
              className="text-zinc-600 hover:text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Vendor Management</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your suppliers and vendor relationships
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">Total Vendors</p>
              <p className="text-2xl font-bold text-zinc-900">{data?.totalCount ?? 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6">
        <Table
          columns={columns}
          data={(data?.data ?? []) as Record<string, unknown>[]}
          isLoading={isLoading}
          emptyMessage="No vendors found. Add your first vendor to get started."
          page={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingVendor ? "Edit Vendor" : "Add New Vendor"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Vendor Name *"
            placeholder="Enter vendor name"
            {...register("name", { required: "Vendor name is required" })}
            error={errors.name?.message}
          />
          <Input
            label="Contact Person"
            placeholder="Enter contact person name"
            {...register("contactPerson")}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Phone</label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-lg text-sm text-zinc-600 font-medium">
                  +977
                </span>
                <input
                  type="tel"
                  placeholder="9800000000"
                  className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  {...register("phone", {
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Phone must be exactly 10 digits"
                    },
                    minLength: {
                      value: 10,
                      message: "Phone must be exactly 10 digits"
                    },
                    maxLength: {
                      value: 10,
                      message: "Phone must be exactly 10 digits"
                    }
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="vendor@gmail.com"
              {...register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: "Email must end with @gmail.com"
                }
              })}
              error={errors.email?.message}
            />
          </div>
          <Input
            label="Address"
            placeholder="Enter vendor address"
            {...register("address")}
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
            >
              {editingVendor ? "Update Vendor" : "Create Vendor"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Are you sure you want to delete this vendor? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              loading={deleteMutation.isPending}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

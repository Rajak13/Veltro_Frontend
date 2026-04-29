"use client";

// Feature: Parts Management (Admin)
// API endpoints: GET /api/parts, POST /api/parts, PUT /api/parts/{id}, DELETE /api/parts/{id}

import { useState } from "react";
import { useParts, useCreatePart, useUpdatePart, useDeletePart } from "@/hooks/useParts";
import { useVendors } from "@/hooks/useVendors";
import { Plus, Pencil, Trash2, Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Part } from "@/types";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type PartFormData = {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
  vendorId: string;
};

export default function PartsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, refetch } = useParts(page, pageSize);
  const { data: vendorsData, refetch: refetchVendors } = useVendors(1, 100);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterLowStock, setFilterLowStock] = useState(false);

  const createMutation = useCreatePart();
  const updateMutation = useUpdatePart();
  const deleteMutation = useDeletePart();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PartFormData>();

  const openCreateModal = () => {
    setEditingPart(null);
    refetchVendors(); // Refresh vendors list
    reset({ 
      name: "", 
      description: "", 
      price: 0, 
      stockQuantity: 0, 
      lowStockThreshold: 10,
      vendorId: "" 
    });
    setModalOpen(true);
  };

  const openEditModal = (part: Part) => {
    setEditingPart(part);
    reset({
      name: part.name,
      description: part.description ?? "",
      price: part.price,
      stockQuantity: part.stockQuantity,
      lowStockThreshold: part.lowStockThreshold,
      vendorId: part.vendorId,
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData: PartFormData) => {
    try {
      if (editingPart) {
        await updateMutation.mutateAsync({ partId: editingPart.partId, ...formData });
        toast.success("Part updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Part created successfully");
      }
      setModalOpen(false);
      reset();
      refetch(); // Explicitly refetch the parts list
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Part deleted successfully");
      setDeleteConfirm(null);
      refetch(); // Explicitly refetch the parts list
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Delete failed");
    }
  };

  const filteredData = filterLowStock 
    ? data?.data?.filter((p) => p.isLowStock) ?? []
    : data?.data ?? [];

  const lowStockCount = data?.data?.filter((p) => p.isLowStock).length ?? 0;
  const totalValue = data?.data?.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0) ?? 0;

  const columns: Column<Part>[] = [
    {
      key: "name",
      header: "Part Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            row.isLowStock ? "bg-red-50 border border-red-100" : "bg-blue-50 border border-blue-100"
          }`}>
            <Package className={`w-5 h-5 ${row.isLowStock ? "text-red-500" : "text-blue-500"}`} />
          </div>
          <div>
            <div className="font-medium text-zinc-900 flex items-center gap-2">
              {row.name}
              {row.isLowStock && (
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              )}
            </div>
            {row.description && (
              <div className="text-xs text-zinc-400 line-clamp-1 max-w-xs">
                {row.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "vendorName",
      header: "Vendor",
      render: (row) => (
        <div className="text-sm text-zinc-600">{row.vendorName}</div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => (
        <div className="font-semibold text-zinc-900 tabular-nums">
          Rs. {row.price.toLocaleString()}
        </div>
      ),
    },
    {
      key: "stockQuantity",
      header: "Stock",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-semibold tabular-nums ${
                row.isLowStock ? "text-red-600" : "text-zinc-900"
              }`}>
                {row.stockQuantity}
              </span>
              <span className="text-xs text-zinc-400">/ {row.lowStockThreshold}</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  row.isLowStock ? "bg-red-500" : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min((row.stockQuantity / row.lowStockThreshold) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge
          label={row.isLowStock ? "Low Stock" : "In Stock"}
          variant={row.isLowStock ? "danger" : "success"}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(row)}
            className="text-zinc-600 hover:text-orange-600"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteConfirm(row.partId)}
            className="text-zinc-600 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Parts Inventory</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage vehicle parts, stock levels, and pricing
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Part
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">Total Parts</p>
              <p className="text-2xl font-bold text-zinc-900">{data?.totalCount ?? 0}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">Total Stock Value</p>
              <p className="text-2xl font-bold text-green-600">
                Rs. {totalValue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">Avg. Part Price</p>
              <p className="text-2xl font-bold text-orange-600">
                Rs. {data?.data?.length ? Math.round(data.data.reduce((sum, p) => sum + p.price, 0) / data.data.length).toLocaleString() : 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant={filterLowStock ? "primary" : "outline"}
          size="sm"
          onClick={() => setFilterLowStock(!filterLowStock)}
          className="gap-2"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Low Stock Only
          {lowStockCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              {lowStockCount}
            </span>
          )}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6">
        <Table
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          emptyMessage={filterLowStock ? "No low stock items found." : "No parts found. Add your first part to get started."}
          page={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPart ? "Edit Part" : "Add New Part"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Part Name *"
            placeholder="Enter part name"
            {...register("name", { required: "Part name is required" })}
            error={errors.name?.message}
          />
          <Input
            label="Description"
            placeholder="Enter part description"
            {...register("description")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (Rs.) *"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", { 
                required: "Price is required",
                min: { value: 0.01, message: "Price must be greater than 0" }
              })}
              error={errors.price?.message}
            />
            <Input
              label="Stock Quantity *"
              type="number"
              placeholder="0"
              {...register("stockQuantity", { 
                required: "Stock quantity is required",
                min: { value: 0, message: "Stock cannot be negative" }
              })}
              error={errors.stockQuantity?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Low Stock Threshold *"
              type="number"
              placeholder="10"
              {...register("lowStockThreshold", { 
                required: "Threshold is required",
                min: { value: 1, message: "Threshold must be at least 1" }
              })}
              error={errors.lowStockThreshold?.message}
              hint="Alert when stock falls below this number"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Vendor *</label>
              <select
                {...register("vendorId", { required: "Vendor is required" })}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">Select vendor</option>
                {vendorsData?.data?.filter((v) => v.isActive).map((vendor) => (
                  <option key={vendor.vendorId} value={vendor.vendorId}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {errors.vendorId && (
                <p className="text-xs text-red-500">{errors.vendorId.message}</p>
              )}
            </div>
          </div>
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
              {editingPart ? "Update Part" : "Create Part"}
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
            Are you sure you want to delete this part? This action cannot be undone.
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

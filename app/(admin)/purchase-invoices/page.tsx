"use client";

// Feature: Purchase Invoice Management (Admin)
// API endpoints: GET /api/invoices/purchase, POST /api/invoices/purchase, GET /api/invoices/purchase/{id}

import { useState } from "react";
import { usePurchaseInvoices, useCreatePurchaseInvoice } from "@/hooks/useInvoices";
import { useVendors } from "@/hooks/useVendors";
import { useParts } from "@/hooks/useParts";
import { Plus, FileText, Eye, Trash2, ShoppingCart, DollarSign, TrendingUp, Package } from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { PurchaseInvoice } from "@/types";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";

type InvoiceItemForm = {
  partId: string;
  quantity: number;
  unitPrice: number;
};

type PurchaseInvoiceFormData = {
  vendorId: string;
  notes?: string;
  items: InvoiceItemForm[];
};

export default function PurchaseInvoicesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, refetch } = usePurchaseInvoices(page, pageSize);
  const { data: vendorsData, refetch: refetchVendors } = useVendors(1, 100);
  const { data: partsData, refetch: refetchParts } = useParts(1, 100);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<PurchaseInvoice | null>(null);

  const createMutation = useCreatePurchaseInvoice();

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<PurchaseInvoiceFormData>({
    defaultValues: {
      vendorId: "",
      notes: "",
      items: [{ partId: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  const calculateTotal = () => {
    return watchItems.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return sum + (qty * price);
    }, 0);
  };

  const openCreateModal = () => {
    refetchVendors(); // Refresh vendors list
    refetchParts(); // Refresh parts list
    reset({
      vendorId: "",
      notes: "",
      items: [{ partId: "", quantity: 1, unitPrice: 0 }],
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData: PurchaseInvoiceFormData) => {
    try {
      if (formData.items.length === 0) {
        toast.error("Please add at least one item");
        return;
      }
      await createMutation.mutateAsync(formData);
      toast.success("Purchase invoice created successfully");
      setModalOpen(false);
      reset();
      refetch(); // Explicitly refetch the invoices list
      refetchParts(); // Refetch parts to update stock quantities
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Operation failed");
    }
  };

  const totalInvoices = data?.totalCount ?? 0;
  const totalAmount = data?.data?.reduce((sum, inv) => sum + inv.totalAmount, 0) ?? 0;
  const avgInvoiceValue = totalInvoices > 0 ? totalAmount / totalInvoices : 0;

  const columns: Column<PurchaseInvoice>[] = [
    {
      key: "invoiceId",
      header: "Invoice ID",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="font-mono text-xs text-zinc-600">
            #{row.invoiceId.slice(0, 8).toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      key: "vendorName",
      header: "Vendor",
      render: (row) => (
        <div className="font-medium text-zinc-900">{row.vendorName}</div>
      ),
    },
    {
      key: "purchaseDate",
      header: "Purchase Date",
      render: (row) => (
        <div className="text-sm text-zinc-600">
          {new Date(row.purchaseDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-sm text-zinc-600">{row.items.length} items</span>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Total Amount",
      render: (row) => (
        <div className="font-bold text-zinc-900 tabular-nums">
          Rs. {row.totalAmount.toLocaleString()}
        </div>
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
            onClick={() => setViewInvoice(row)}
            className="text-zinc-600 hover:text-blue-600"
          >
            <Eye className="w-3.5 h-3.5" />
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
          <h1 className="text-2xl font-bold text-zinc-900">Purchase Invoices</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Track inventory purchases from vendors
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">Total Invoices</p>
              <p className="text-2xl font-bold text-zinc-900">{totalInvoices}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-red-600">
                Rs. {totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">Avg. Invoice Value</p>
              <p className="text-2xl font-bold text-orange-600">
                Rs. {Math.round(avgInvoiceValue).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-1">This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {data?.data?.filter((inv) => {
                  const invDate = new Date(inv.purchaseDate);
                  const now = new Date();
                  return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
                }).length ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6">
        <Table
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyMessage="No purchase invoices found. Create your first invoice to get started."
          page={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>

      {/* Create Invoice Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Purchase Invoice"
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Vendor Selection */}
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

          {/* Invoice Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">Invoice Items *</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ partId: "", quantity: 1, unitPrice: 0 })}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <select
                        {...register(`items.${index}.partId`, { required: "Part is required" })}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      >
                        <option value="">Select part</option>
                        {partsData?.data?.map((part) => (
                          <option key={part.partId} value={part.partId}>
                            {part.name}
                          </option>
                        ))}
                      </select>
                      {errors.items?.[index]?.partId && (
                        <p className="text-xs text-red-500 mt-1">{errors.items[index]?.partId?.message}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Qty"
                        {...register(`items.${index}.quantity`, {
                          required: "Quantity is required",
                          min: { value: 1, message: "Min 1" },
                        })}
                        error={errors.items?.[index]?.quantity?.message}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Unit Price"
                        {...register(`items.${index}.unitPrice`, {
                          required: "Price is required",
                          min: { value: 0.01, message: "Min 0.01" },
                        })}
                        error={errors.items?.[index]?.unitPrice?.message}
                      />
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <Input
            label="Notes"
            placeholder="Add any additional notes..."
            {...register("notes")}
          />

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-lg">
            <span className="text-sm font-semibold text-zinc-700">Total Amount:</span>
            <span className="text-2xl font-bold text-orange-600 tabular-nums">
              Rs. {calculateTotal().toLocaleString()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
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
              loading={createMutation.isPending}
              className="flex-1"
            >
              Create Invoice
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        open={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        title="Invoice Details"
        size="lg"
      >
        {viewInvoice && (
          <div className="space-y-5">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-lg">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Invoice ID</p>
                <p className="font-mono text-sm font-semibold text-zinc-900">
                  #{viewInvoice.invoiceId.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Purchase Date</p>
                <p className="text-sm font-medium text-zinc-900">
                  {new Date(viewInvoice.purchaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Vendor</p>
                <p className="text-sm font-medium text-zinc-900">{viewInvoice.vendorName}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Total Items</p>
                <p className="text-sm font-medium text-zinc-900">{viewInvoice.items.length}</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">Items</h3>
              <div className="border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-zinc-500">Part</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-zinc-500">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-zinc-500">Unit Price</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-zinc-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.items.map((item) => (
                      <tr key={item.itemId} className="border-b border-zinc-100 last:border-0">
                        <td className="px-4 py-3 text-zinc-900">{item.partName}</td>
                        <td className="px-4 py-3 text-right text-zinc-600 tabular-nums">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-zinc-600 tabular-nums">
                          Rs. {item.unitPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-zinc-900 tabular-nums">
                          Rs. {item.lineTotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {viewInvoice.notes && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">Notes</h3>
                <p className="text-sm text-zinc-600 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  {viewInvoice.notes}
                </p>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-lg">
              <span className="text-sm font-semibold text-zinc-700">Total Amount:</span>
              <span className="text-2xl font-bold text-orange-600 tabular-nums">
                Rs. {viewInvoice.totalAmount.toLocaleString()}
              </span>
            </div>

            <Button
              variant="outline"
              onClick={() => setViewInvoice(null)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { SalesInvoice, PurchaseInvoice, ApiResponse, PaginatedResponse } from "@/types";
import toast from "react-hot-toast";

export const useSalesInvoices = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["sales-invoices", page, pageSize],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<SalesInvoice>>>("/invoices/sales", {
        params: { page, pageSize },
      });
      return res.data.data;
    },
  });

export const usePurchaseInvoices = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["purchase-invoices", page, pageSize],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<PurchaseInvoice>>>("/invoices/purchase", {
        params: { page, pageSize },
      });
      return res.data.data;
    },
  });

export const useCreateSalesInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SalesInvoice>) =>
      api.post<ApiResponse<SalesInvoice>>("/invoices/sales", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sales-invoices"] }),
  });
};

export const useCreatePurchaseInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PurchaseInvoice>) =>
      api.post<ApiResponse<PurchaseInvoice>>("/invoices/purchase", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-invoices"] }),
  });
};

export const useSendInvoiceEmail = () =>
  useMutation({
    mutationFn: (invoiceId: string) =>
      api.post<ApiResponse<object>>(`/invoices/sales/${invoiceId}/send-email`).then((r) => r.data),
    onSuccess: () => toast.success("Invoice email sent to customer"),
    onError: () => toast.error("Failed to send invoice email"),
  });

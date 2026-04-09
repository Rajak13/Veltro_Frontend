import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { SalesInvoice, PurchaseInvoice, ApiResponse, PaginatedResponse } from "@/types";

export const useSalesInvoices = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["sales-invoices", page, pageSize],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<SalesInvoice>>("/invoices/sales", {
        params: { page, pageSize },
      });
      return res.data;
    },
  });

export const usePurchaseInvoices = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["purchase-invoices", page, pageSize],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<PurchaseInvoice>>("/invoices/purchase", {
        params: { page, pageSize },
      });
      return res.data;
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

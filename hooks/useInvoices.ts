import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import api from "@/lib/api";
import type { SalesInvoice, PurchaseInvoice, ApiResponse, PagedResult } from "@/types";
import {
  getInvoiceId,
  isValidInvoiceId,
  mapRawToCustomerInvoiceDetail,
  type CustomerInvoiceDetail,
} from "@/lib/invoices";
import toast from "react-hot-toast";

export type PurchaseHistoryInvoice = SalesInvoice & {
  invoiceDetail?: CustomerInvoiceDetail;
};

async function fetchCustomerInvoiceDetail(
  invoiceId: string
): Promise<CustomerInvoiceDetail> {
  const paths = [`/customers/invoices/${invoiceId}`, `/invoices/sales/${invoiceId}`];

  for (const path of paths) {
    try {
      const res = await api.get<ApiResponse<Record<string, unknown>>>(path);
      if (res.data?.success && res.data.data) {
        return mapRawToCustomerInvoiceDetail(res.data.data, invoiceId);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) continue;
      throw err;
    }
  }

  throw new Error("Invoice not found.");
}

export const useSalesInvoices = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["sales-invoices", page, pageSize],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PagedResult<SalesInvoice>>>("/invoices/sales", {
        params: { page, pageSize },
      });
      const pagedResult = res.data.data;
      return {
        data: pagedResult?.items || [],
        totalCount: pagedResult?.totalCount || 0,
        page: pagedResult?.page || page,
        pageSize: pagedResult?.pageSize || pageSize,
        totalPages: pagedResult?.totalPages || 1,
      };
    },
  });

export const useMySalesInvoice = (
  invoiceId?: string,
  enabled = true,
  preview?: CustomerInvoiceDetail | null
) =>
  useQuery({
    queryKey: ["sales-invoice", "mine", invoiceId],
    enabled: enabled && !!invoiceId && isValidInvoiceId(invoiceId),
    placeholderData: preview ?? undefined,
    queryFn: () => fetchCustomerInvoiceDetail(invoiceId!),
  });

export const useMyPurchaseHistory = () =>
  useQuery({
    queryKey: ["purchase-history", "mine"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Record<string, unknown>[]>>(
        "/customers/history/purchases"
      );
      return (res.data.data ?? []).map((item) => {
        const invoiceId = String(item.invoiceId ?? item.InvoiceId ?? "").trim();
        const total = Number(item.totalAmount ?? item.TotalAmount ?? 0);
        const discount = Number(item.discountApplied ?? item.DiscountApplied ?? 0);
        const invoiceDetail = mapRawToCustomerInvoiceDetail(item, invoiceId);
        return {
          id: invoiceId as unknown as number,
          invoiceId,
          customerId: 0,
          staffId: 0,
          items: [],
          totalAmount: total,
          discountApplied: discount,
          finalAmount: total - discount,
          status: item.isPaid ?? item.IsPaid ? "Completed" : "Pending",
          createdAt: String(item.saleDate ?? item.SaleDate ?? ""),
          invoiceDetail,
        } as PurchaseHistoryInvoice;
      });
    },
  });

export const usePurchaseInvoices = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["purchase-invoices", page, pageSize],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PagedResult<PurchaseInvoice>>>("/invoices/purchase", {
        params: { page, pageSize },
      });
      const pagedResult = res.data.data;
      return {
        data: pagedResult?.items || [],
        totalCount: pagedResult?.totalCount || 0,
        page: pagedResult?.page || page,
        pageSize: pagedResult?.pageSize || pageSize,
        totalPages: pagedResult?.totalPages || 1,
      };
    },
  });

export const useCreateSalesInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SalesInvoice>) =>
      api.post<ApiResponse<SalesInvoice>>("/invoices/sales", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales-invoices"] });
      qc.refetchQueries({ queryKey: ["sales-invoices"] });
    },
  });
};

export const useCreatePurchaseInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PurchaseInvoice>) =>
      api.post<ApiResponse<PurchaseInvoice>>("/invoices/purchase", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase-invoices"] });
      qc.refetchQueries({ queryKey: ["purchase-invoices"] });
      qc.invalidateQueries({ queryKey: ["parts"] });
      qc.refetchQueries({ queryKey: ["parts"] });
    },
  });
};

export const useSendInvoiceEmail = () =>
  useMutation({
    mutationFn: (invoiceId: string) =>
      api.post<ApiResponse<object>>(`/invoices/sales/${invoiceId}/send-email`).then((r) => r.data),
    onSuccess: () => toast.success("Invoice email sent to customer"),
    onError: () => toast.error("Failed to send invoice email"),
  });

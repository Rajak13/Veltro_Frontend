import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Customer, ApiResponse } from "@/types";
import type { Customer, Vehicle, ApiResponse, PaginatedResponse } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PurchaseHistoryItem {
  invoiceId: string;
  saleDate: string;
  totalAmount: number;
  discountApplied: number;
  isPaid: boolean;
}

export interface AppointmentHistoryItem {
  appointmentId: string;
  scheduledDate: string;
  status: string;
  notes?: string;
}

export interface CustomerHistory {
  customerId: string;
  customerName: string;
  purchases: PurchaseHistoryItem[];
  appointments: AppointmentHistoryItem[];
}

export interface CustomerSearchResult {
  customerId: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  creditBalance: number;
  vehicles: {
    vehicleId: string;
    make: string;
    model: string;
    year: number;
    registrationNumber?: string;
  }[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** List all customers with optional search (staff route) */
export const useCustomers = (page = 1, pageSize = 10, search?: string) =>
  useQuery({
    queryKey: ["customers", page, pageSize, search],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PagedResult<CustomerSearchResult>>>("/staff/customers", {
        params: { page, pageSize, ...(search ? { search } : {}) },
      });
      return res.data.data;
    },
  });

/** Get a single customer by ID (staff route) */
export const useCustomer = (id: string) =>
  useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<CustomerSearchResult>>(`/staff/customers/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

/** Get a customer's full purchase + appointment history (staff route) */
export const useCustomerHistory = (id: string) =>
  useQuery({
    queryKey: ["customers", id, "history"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<CustomerHistory>>(`/staff/customers/${id}/history`);
      return res.data.data;
    },
    enabled: !!id,
  });

/** Search customers by name, phone, id, or vehicle registration (staff route) */
export const useSearchCustomers = (q: string, type = "name", page = 1, pageSize = 20) =>
  useQuery({
    queryKey: ["customers", "search", q, type, page, pageSize],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PagedResult<CustomerSearchResult>>>(
        "/staff/customers/search",
        { params: { q, type, page, pageSize } }
      );
      return res.data.data;
    },
    enabled: q.trim().length > 0,
  });

/** Register a new customer (staff route) */
export const useMyProfile = () =>
  useQuery({
    queryKey: ["customers", "profile"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Customer>>("/customers/profile");
      return res.data.data;
    },
  });

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<ApiResponse<CustomerSearchResult>>("/staff/customers", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Customer> & { id: number }) =>
      api.put<ApiResponse<Customer>>(`/staff/customers/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
};

export const useUpdateMyProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; phone?: string; address?: string }) =>
      api.put<ApiResponse<Customer>>("/customers/profile", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers", "profile"] });
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useAddVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Vehicle, "id" | "customerId">) =>
      api.post<ApiResponse<Vehicle>>("/customers/vehicles", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers", "profile"] }),
  });
};

export const useUpdateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Vehicle> & { id: number }) =>
      api.put<ApiResponse<Vehicle>>(`/customers/vehicles/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers", "profile"] }),
  });
};

export const useDeleteVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/customers/vehicles/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers", "profile"] }),
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Customer, ApiResponse, PaginatedResponse } from "@/types";

export const useCustomers = (page = 1, pageSize = 10, search?: string) =>
  useQuery({
    queryKey: ["customers", page, pageSize, search],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<Customer>>>("/customers", {
        params: { page, pageSize, search },
      });
      return res.data.data;
    },
  });

export const useCustomer = (id: number) =>
  useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Customer>) =>
      api.post<ApiResponse<Customer>>("/customers", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Customer> & { id: number }) =>
      api.put<ApiResponse<Customer>>(`/customers/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
};

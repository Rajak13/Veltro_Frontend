import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Vendor, ApiResponse, PaginatedResponse } from "@/types";

export const useVendors = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["vendors", page, pageSize],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Vendor>>("/vendors", {
        params: { page, pageSize },
      });
      return res.data;
    },
  });

export const useVendor = (id: number) =>
  useQuery({
    queryKey: ["vendors", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Vendor>>(`/vendors/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

export const useCreateVendor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Vendor>) =>
      api.post<ApiResponse<Vendor>>("/vendors", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendors"] }),
  });
};

export const useUpdateVendor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Vendor> & { id: number }) =>
      api.put<ApiResponse<Vendor>>(`/vendors/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendors"] }),
  });
};

export const useDeleteVendor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/vendors/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendors"] }),
  });
};

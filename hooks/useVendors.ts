import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Vendor, ApiResponse, PagedResult } from "@/types";

export const useVendors = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["vendors", page, pageSize],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PagedResult<Vendor>>>("/vendors", {
        params: { page, pageSize },
      });
      // Backend returns: { success, data: { items, totalCount, page, pageSize, totalPages } }
      const pagedResult = res.data.data;
      // Filter out inactive vendors (soft-deleted)
      const activeVendors = (pagedResult?.items || []).filter((v) => v.isActive);
      return {
        data: activeVendors,
        totalCount: activeVendors.length,
        page: pagedResult?.page || page,
        pageSize: pagedResult?.pageSize || pageSize,
        totalPages: Math.ceil(activeVendors.length / pageSize) || 1,
      };
    },
  });

export const useVendor = (id: string) =>
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
      qc.refetchQueries({ queryKey: ["vendors"] });
    },
  });
};

export const useUpdateVendor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ vendorId, ...data }: Partial<Vendor> & { vendorId: string }) =>
      api.put<ApiResponse<Vendor>>(`/vendors/${vendorId}`, data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
      qc.refetchQueries({ queryKey: ["vendors"] });
    },
  });
};

export const useDeleteVendor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/vendors/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
      qc.refetchQueries({ queryKey: ["vendors"] });
    },
  });
};

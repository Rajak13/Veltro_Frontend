import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Part, ApiResponse, PagedResult } from "@/types";

export const useParts = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["parts", page, pageSize],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PagedResult<Part>>>("/parts", {
        params: { page, pageSize },
      });
      // Backend returns: { success, data: { items, totalCount, page, pageSize, totalPages } }
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

export const usePart = (id: string) =>
  useQuery({
    queryKey: ["parts", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Part>>(`/parts/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

export const useCreatePart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Part>) =>
      api.post<ApiResponse<Part>>("/parts", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parts"] });
      qc.refetchQueries({ queryKey: ["parts"] });
    },
  });
};

export const useUpdatePart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ partId, ...data }: Partial<Part> & { partId: string }) =>
      api.put<ApiResponse<Part>>(`/parts/${partId}`, data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parts"] });
      qc.refetchQueries({ queryKey: ["parts"] });
    },
  });
};

export const useDeletePart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/parts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parts"] });
      qc.refetchQueries({ queryKey: ["parts"] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Part, ApiResponse, PaginatedResponse } from "@/types";

export const useParts = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["parts", page, pageSize],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Part>>("/parts", {
        params: { page, pageSize },
      });
      return res.data;
    },
  });

export const usePart = (id: number) =>
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parts"] }),
  });
};

export const useUpdatePart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Part> & { id: number }) =>
      api.put<ApiResponse<Part>>(`/parts/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parts"] }),
  });
};

export const useDeletePart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/parts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["parts"] }),
  });
};

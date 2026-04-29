import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PartRequest, ApiResponse } from "@/types";

export const useMyPartRequests = () =>
  useQuery({
    queryKey: ["partRequests", "mine"],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<PartRequest[]>>("/part-requests/my");
        return res.data.data;
      } catch (error: any) {
        // Return empty array if endpoint doesn't exist yet
        if (error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
  });

export const useCreatePartRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { partName: string; description: string }) =>
      api.post<ApiResponse<PartRequest>>("/part-requests", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["partRequests"] }),
  });
};

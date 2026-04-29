import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PartRequest, ApiResponse } from "@/types";

export const useMyPartRequests = () =>
  useQuery({
    queryKey: ["partRequests", "mine"],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<any[]>>("/part-requests/my");
        // Map backend PascalCase to frontend camelCase
        return res.data.data.map((item: any) => ({
          id: item.RequestId || item.requestId || item.id,
          partName: item.PartName || item.partName,
          description: item.Description || item.description,
          status: item.Status || item.status,
          createdAt: item.RequestedAt || item.requestedAt || item.createdAt,
        })) as PartRequest[];
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

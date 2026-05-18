import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PartRequest, ApiResponse } from "@/types";
import { formatPartRequestStatus } from "@/lib/status";

export const useMyPartRequests = () =>
  useQuery({
    queryKey: ["partRequests", "mine"],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<any[]>>("/part-requests/my");
        // Map backend PascalCase to frontend camelCase
        return res.data.data.map((item: Record<string, unknown>, index: number) => {
          const rawId = item.requestId ?? item.RequestId ?? item.id ?? item.Id;
          const parsedId = rawId !== undefined && rawId !== null ? Number(rawId) : NaN;
          const id = Number.isFinite(parsedId) ? parsedId : index;
          return {
            id,
            partName: String(item.partName ?? item.PartName ?? ""),
            description: String(item.description ?? item.Description ?? ""),
            status: formatPartRequestStatus(item.status ?? item.Status) as PartRequest["status"],
            createdAt: String(item.requestedAt ?? item.RequestedAt ?? item.createdAt ?? ""),
          };
        }) as PartRequest[];
      } catch (error: any) {
        // Return empty array if endpoint doesn't exist yet
        if (error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
  });

export interface StaffPartRequest {
  requestId: string;
  partName: string;
  description?: string;
  status: string;
  requestedAt: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export const useStaffPartRequests = (statusFilter?: string) =>
  useQuery({
    queryKey: ["partRequests", "staff", statusFilter],
    queryFn: async () => {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await api.get<ApiResponse<StaffPartRequest[]>>("/part-requests", { params });
      return res.data.data ?? [];
    },
  });

export const useUpdatePartRequestStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: string }) =>
      api.put(`/part-requests/${requestId}/status`, { status }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partRequests"] });
    },
  });
};

export const useCreatePartRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { partName: string; description: string }) =>
      api.post<ApiResponse<PartRequest>>("/part-requests", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["partRequests"] }),
  });
};

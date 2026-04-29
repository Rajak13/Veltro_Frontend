import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export interface StaffMember extends Record<string, unknown> {
  id: string;
  fullName: string;
  email: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateStaffPayload {
  fullName: string;
  email: string;
  password: string;
  position?: string;
}

export const useStaff = () =>
  useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<StaffMember[]>>("/admin/staff");
      return res.data.data ?? [];
    },
  });

export const useCreateStaff = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStaffPayload) =>
      api.post<ApiResponse<StaffMember>>("/admin/staff", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
};

export const useUpdateStaff = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: CreateStaffPayload & { id: string }) =>
      api.put<ApiResponse<StaffMember>>(`/admin/staff/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
};

export const useDeactivateStaff = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/staff/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
};

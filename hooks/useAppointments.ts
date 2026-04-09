import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Appointment, ApiResponse, PaginatedResponse } from "@/types";

export const useAppointments = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ["appointments", page, pageSize],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Appointment>>("/appointments", {
        params: { page, pageSize },
      });
      return res.data;
    },
  });

export const useMyAppointments = () =>
  useQuery({
    queryKey: ["appointments", "mine"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Appointment[]>>("/appointments/my");
      return res.data.data;
    },
  });

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Appointment>) =>
      api.post<ApiResponse<Appointment>>("/appointments", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

export const useCancelAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.put<ApiResponse<Appointment>>(`/appointments/${id}/cancel`).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

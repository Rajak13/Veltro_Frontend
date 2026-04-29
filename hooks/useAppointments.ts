import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Appointment, ApiResponse } from "@/types";

export const useAppointments = () =>
  useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Appointment[]>>("/appointments");
      return res.data.data;
    },
  });

export const useMyAppointments = () =>
  useQuery({
    queryKey: ["appointments", "mine"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Appointment[]>>("/appointments");
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
    mutationFn: (id: string) =>
      api.put<ApiResponse<Appointment>>(`/appointments/${id}`).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

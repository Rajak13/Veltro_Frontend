import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Customer, Vehicle, ApiResponse, PaginatedResponse } from "@/types";

export const useCustomers = (page = 1, pageSize = 10, search?: string) =>
  useQuery({
    queryKey: ["customers", page, pageSize, search],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedResponse<Customer>>>("/customers", {
        params: { page, pageSize, search },
      });
      return res.data.data;
    },
  });

export const useCustomer = (id: number) =>
  useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

export const useMyProfile = () =>
  useQuery({
    queryKey: ["customers", "profile"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Customer>>("/customers/profile");
      return res.data.data;
    },
  });

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Customer>) =>
      api.post<ApiResponse<Customer>>("/customers", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Customer> & { id: number }) =>
      api.put<ApiResponse<Customer>>(`/customers/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
};

export const useUpdateMyProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; phone?: string; address?: string }) =>
      api.put<ApiResponse<Customer>>("/customers/profile", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers", "profile"] });
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useAddVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Vehicle, "id" | "customerId">) =>
      api.post<ApiResponse<Vehicle>>("/customers/vehicles", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers", "profile"] }),
  });
};

export const useUpdateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Vehicle> & { id: number }) =>
      api.put<ApiResponse<Vehicle>>(`/customers/vehicles/${id}`, data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers", "profile"] }),
  });
};

export const useDeleteVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/customers/vehicles/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers", "profile"] }),
  });
};

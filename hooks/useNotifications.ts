import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export interface NotificationItem {
  notificationId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: "LowStock" | "CreditOverdue" | "General";
}

export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<NotificationItem[]>>("/notifications");
      return res.data.data ?? [];
    },
    refetchInterval: 60_000, // poll every 60s
  });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};

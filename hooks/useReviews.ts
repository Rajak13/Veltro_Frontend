import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Review, ApiResponse } from "@/types";

export interface AdminReview {
  reviewId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
}

export interface PublicReview {
  reviewId: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerName?: string;
}

export const useMyReviews = () =>
  useQuery({
    queryKey: ["reviews", "mine"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Review[]>>("/reviews/my");
      return res.data.data ?? [];
    },
  });

export const usePublicReviews = () =>
  useQuery({
    queryKey: ["reviews", "public"],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<PublicReview[]>>("/reviews");
        return res.data.data ?? [];
      } catch {
        return [];
      }
    },
    retry: false,
    staleTime: 60_000,
  });

export const useAdminReviews = (filter?: "pending" | "approved" | "all") =>
  useQuery({
    queryKey: ["reviews", "admin", filter],
    queryFn: async () => {
      const params =
        filter === "pending"
          ? { approved: false }
          : filter === "approved"
            ? { approved: true }
            : {};
      const res = await api.get<ApiResponse<AdminReview[]>>("/admin/reviews", { params });
      return res.data.data ?? [];
    },
  });

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) =>
      api.post<ApiResponse<Review>>("/reviews", data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useApproveReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) =>
      api.put(`/admin/reviews/${reviewId}/approve`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useRejectReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) =>
      api.put(`/admin/reviews/${reviewId}/reject`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useDeleteReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) =>
      api.delete(`/admin/reviews/${reviewId}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

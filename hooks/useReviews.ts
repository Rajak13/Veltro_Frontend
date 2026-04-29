import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Review, ApiResponse } from "@/types";

export const useMyReviews = () =>
  useQuery({
    queryKey: ["reviews", "mine"],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<Review[]>>("/reviews/my");
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

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) =>
      api.post<ApiResponse<Review>>("/reviews", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
};

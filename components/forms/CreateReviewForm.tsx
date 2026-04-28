"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { useCreateReview } from "@/hooks/useReviews";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

const schema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

export default function CreateReviewForm({ onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { mutateAsync, isPending } = useCreateReview();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, comment: "" },
  });

  const handleRatingClick = (value: number) => {
    setRating(value);
    setValue("rating", value);
  };

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      toast.success("Review submitted successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-2">Your Rating</label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleRatingClick(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    starValue <= (hoverRating || rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-zinc-200"
                  }`}
                />
              </button>
            );
          })}
        </div>
        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1.5">Your Review</label>
        <textarea
          {...register("comment")}
          rows={4}
          placeholder="Share your experience with our service..."
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
        />
        {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Submit Review</Button>
      </div>
    </form>
  );
}

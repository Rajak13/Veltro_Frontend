"use client";

// Feature 13 — Submit Review (Customer)
// Assigned to: [Siddhartha Raj Thapa]
// Branch: feature/reviews
// API endpoints: GET /api/reviews/my, POST /api/reviews

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import CreateReviewForm from "@/components/forms/CreateReviewForm";
import { useMyReviews } from "@/hooks/useReviews";
import { Star } from "lucide-react";

export default function ReviewsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: reviews, isLoading } = useMyReviews();

  return (
    <div>
      <PageHeader
        title="My Reviews"
        subtitle="Share your experience with our service"
        breadcrumb={[{ label: "Customer" }, { label: "Reviews" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Star className="w-4 h-4" /> Write a Review
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : reviews?.length ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id} padding="md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"}`}
                    />
                  ))}
                  <span className="text-xs text-zinc-400 ml-2">
                    {review.rating} out of 5 stars
                  </span>
                </div>
                {review.isApproved ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                    ✓ Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                    ⏳ Pending Approval
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed">{review.comment}</p>
              <p className="text-xs text-zinc-400 mt-3">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          No reviews yet. Share your experience.
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Write a Review">
        <CreateReviewForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}

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
import { Star } from "lucide-react";
import type { Review } from "@/types";

export default function ReviewsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // TODO [Siddhartha Raj Thapa]: Replace with useQuery hook for reviews
  const reviews: Review[] = [];

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

      {/* TODO [Siddhartha Raj Thapa]: Implement review list with star rating display,
          comment text, and date. Add star rating input in the form. */}

      {reviews.length ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id} padding="md">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-zinc-700">{review.comment}</p>
              <p className="text-xs text-zinc-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          No reviews yet. Share your experience.
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Write a Review">
        {/* TODO [Siddhartha Raj Thapa]: Add star rating selector + comment textarea using react-hook-form + zod */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}

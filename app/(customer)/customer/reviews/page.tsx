"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import CreateReviewForm from "@/components/forms/CreateReviewForm";
import { useMyReviews, usePublicReviews } from "@/hooks/useReviews";
import { Star } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: publicReviews, isLoading: loadingPublic } = usePublicReviews();
  const { data: myReviews, isLoading: loadingMine } = useMyReviews();
  const loading = loadingPublic || loadingMine;

  // Check if the customer already submitted a review this calendar month
  const now = new Date();
  const hasReviewThisMonth = (myReviews ?? []).some((r) => {
    const d = new Date(r.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const monthName = now.toLocaleString("en-US", { month: "long" });

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="Read community reviews and share your own experience"
        breadcrumb={[{ label: "Customer" }, { label: "Reviews" }]}
        action={
          <div className="flex flex-col items-end gap-1">
            <Button
              onClick={() => setModalOpen(true)}
              disabled={hasReviewThisMonth}
              title={hasReviewThisMonth ? `You already submitted a review in ${monthName}` : undefined}
            >
              <Star className="w-4 h-4" /> Write a Review
            </Button>
            {hasReviewThisMonth && (
              <p className="text-[11px] text-zinc-400">
                Already reviewed in {monthName} — next review available in{" "}
                {new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleString("en-US", { month: "long" })}
              </p>
            )}
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-zinc-900 mb-1">All Reviews</h2>
            <p className="text-xs text-zinc-500 mb-4">
              Approved reviews from all customers. New submissions appear here after admin approval.
            </p>
            {(publicReviews ?? []).length > 0 ? (
              <div className="space-y-3">
                {(publicReviews ?? []).map((review) => (
                  <Card key={review.reviewId} padding="md">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-zinc-800">
                          {review.customerName ?? "Customer"}
                        </p>
                        <StarRating rating={review.rating} />
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200 shrink-0">
                        Approved
                      </span>
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
              <div className="h-32 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">No approved reviews yet.</div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold text-zinc-900 mb-1">Your Reviews</h2>
            <p className="text-xs text-zinc-500 mb-4">
              Reviews you submitted, including those waiting for admin approval.
            </p>
            {(myReviews ?? []).length > 0 ? (
              <div className="space-y-3">
                {(myReviews ?? []).map((review) => (
                  <Card key={review.reviewId} padding="md">
                    <div className="flex items-center justify-between mb-2">
                      <StarRating rating={review.rating} />
                      {review.isApproved ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-700 leading-relaxed mt-3">{review.comment}</p>
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
              <div className="h-32 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">You have not submitted a review yet.</div>
            )}
          </section>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Write a Review">
        <CreateReviewForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}

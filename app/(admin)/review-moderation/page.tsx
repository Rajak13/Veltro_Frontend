"use client";

import { useMemo, useState } from "react";
import ListFilters from "@/components/filters/ListFilters";
import { filterBySearch } from "@/lib/invoices";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import {
  useAdminReviews,
  useApproveReview,
  useRejectReview,
  useDeleteReview,
} from "@/hooks/useReviews";
import { Check, Star, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

type Filter = "pending" | "approved" | "all";

export default function ReviewModerationPage() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [search, setSearch] = useState("");
  const { data: reviews, isLoading } = useAdminReviews(filter);

  const filteredReviews = useMemo(
    () =>
      filterBySearch(reviews ?? [], search, (r) =>
        `${r.customerName ?? ""} ${r.comment ?? ""} ${r.rating ?? ""}`
      ),
    [reviews, search]
  );
  const approve = useApproveReview();
  const reject = useRejectReview();
  const remove = useDeleteReview();

  const filters: { value: Filter; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "all", label: "All" },
  ];

  const handleApprove = async (id: string) => {
    try {
      await approve.mutateAsync(id);
      toast.success("Review approved — now visible to everyone");
    } catch {
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await reject.mutateAsync(id);
      toast.success("Review rejected — hidden from public");
    } catch {
      toast.error("Failed to reject review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div>
      <PageHeader
        title="Review Moderation"
        subtitle="Approve customer reviews before they appear publicly"
        breadcrumb={[{ label: "Admin" }, { label: "Review Moderation" }]}
      />

      <p className="text-sm text-zinc-500 mb-4 max-w-2xl">
        When a customer submits a review, it stays <strong>pending</strong> until you approve it.
        Only approved reviews are shown on the public site and to other customers.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border-[1.5px] transition-all ${
              filter === f.value
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ListFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search customer or comment…"
        onClear={() => setSearch("")}
      />

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center text-sm text-zinc-400 border-2 border-dashed border-zinc-100 rounded-2xl">
          {(reviews ?? []).length === 0 ? "No reviews in this category." : "No reviews match your search."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <Card key={review.reviewId} padding="md">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <ReviewMeta review={review} />
                  <p className="text-sm text-zinc-700 leading-relaxed mt-3">{review.comment}</p>
                  <p className="text-xs text-zinc-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
                  {!review.isApproved && (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(review.reviewId)}
                      disabled={approve.isPending}
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </Button>
                  )}
                  {review.isApproved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(review.reviewId)}
                      disabled={reject.isPending}
                    >
                      <X className="w-3.5 h-3.5" /> Unpublish
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(review.reviewId)}
                    disabled={remove.isPending}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewMeta({ review }: { review: { customerName?: string; customerEmail?: string; rating: number; isApproved: boolean } }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-semibold text-zinc-900">{review.customerName ?? "Customer"}</span>
      {review.customerEmail && (
        <span className="text-xs text-zinc-400">({review.customerEmail})</span>
      )}
      <div className="flex items-center gap-0.5 ml-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"}`}
          />
        ))}
      </div>
      {review.isApproved ? (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
          Public
        </span>
      ) : (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
          Pending
        </span>
      )}
    </div>
  );
}

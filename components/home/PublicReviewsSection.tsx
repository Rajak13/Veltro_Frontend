"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { usePublicReviews } from "@/hooks/useReviews";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const FALLBACK = [
  { name: "Anita R.", car: "Hyundai i20 Owner", quote: "Excellent service and transparent pricing.", rating: 5 },
  { name: "Bikash S.", car: "Toyota Corolla Owner", quote: "Finding the right parts is easy now.", rating: 5 },
  { name: "Priya M.", car: "Honda Civic Owner", quote: "Great loyalty discount on my purchase.", rating: 5 },
];

export default function PublicReviewsSection() {
  const { data: approved } = usePublicReviews();
  const items =
    (approved ?? []).length > 0
      ? (approved ?? []).slice(0, 3).map((r) => ({
          name: r.customerName ?? "Customer",
          car: "Verified customer",
          quote: r.comment,
          rating: r.rating,
        }))
      : FALLBACK;

  return (
    <section className="relative py-32" style={{ zIndex: 10 }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">Reviews</div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
            Trusted by vehicle owners.
          </h2>
          <p className="text-sm text-zinc-400 mt-3">Only admin-approved reviews are shown here.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ name, car, quote, rating }, i) => (
            <motion.div
              key={`${name}-${i}`}
              {...fadeUp(i * 0.1)}
              className="testi-card bg-white border border-zinc-200 rounded-2xl p-7"
            >
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < rating ? "text-orange-400 fill-orange-400" : "text-zinc-200"}`}
                  />
                ))}
              </div>
              <p className="text-base font-light text-zinc-600 leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-500 flex-shrink-0">
                  {name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800">{name}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{car}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

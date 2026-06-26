"use client";

import { useState } from "react";
import { Star, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { submitTestimonial } from "@/lib/actions";

interface TestimonialFormProps {
  onClose: () => void;
}

export function TestimonialForm({ onClose }: TestimonialFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    comment: "",
    website: "", // honeypot
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitTestimonial({
      customer_name: form.customer_name,
      rating,
      comment: form.comment,
      website: form.website,
    });

    setLoading(false);

    if (result.success) {
      toast.success("Review submitted! It will appear once approved.");
      onClose();
    } else {
      toast.error(result.error ?? "Failed to submit review.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-display text-xl font-bold text-charcoal">Leave a Review</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-gold text-gold"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="customer_name" className="block text-sm font-semibold text-charcoal mb-2">
                Your Name
              </label>
              <input
                id="customer_name"
                type="text"
                required
                minLength={2}
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-semibold text-charcoal mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                required
                minLength={10}
                rows={4}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember transition-colors"
                placeholder="Tell us about your experience..."
              />
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="absolute -left-[9999px] hidden"
              aria-hidden="true"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ember px-8 py-4 font-semibold text-white transition-all hover:bg-ember/90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

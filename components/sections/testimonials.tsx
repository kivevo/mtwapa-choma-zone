"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialForm } from "@/components/sections/testimonial-form";
import type { Testimonial } from "@/types/database.types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials.length) {
    return (
      <AnimatedSection className="bg-sand py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            eyebrow="Reviews"
            title="What People Say About Us"
          />
          <p className="mt-4 text-charcoal/70 mb-8">
            Enjoyed your visit? We&apos;d love to hear from you.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-xl bg-ember px-8 py-3 font-semibold text-white transition-all hover:bg-ember/90 shadow-sm"
          >
            Leave a Review
          </button>
          {showForm && <TestimonialForm onClose={() => setShowForm(false)} />}
        </div>
      </AnimatedSection>
    );
  }

  const t = testimonials[current];

  return (
    <AnimatedSection className="bg-sand py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <SectionHeading
            eyebrow="Reviews"
            title="What People Say About Us"
          />
        </div>

        <div className="relative rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <div className="mb-4 flex gap-1">
            {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-gold text-gold"
              />
            ))}
          </div>
          <blockquote className="font-display text-xl leading-relaxed text-charcoal md:text-2xl">
            &ldquo;{t.comment}&rdquo;
          </blockquote>
          <p className="mt-6 font-semibold text-ember">{t.customer_name}</p>


        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-xl bg-ember px-8 py-3 font-semibold text-white transition-all hover:bg-ember/90 shadow-sm"
          >
            Leave a Review
          </button>
        </div>

        {showForm && <TestimonialForm onClose={() => setShowForm(false)} />}
      </div>
    </AnimatedSection>
  );
}

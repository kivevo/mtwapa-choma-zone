"use client";

import { motion } from "framer-motion";
import { cn } from "@/components/ui/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-[0.2em]",
            dark ? "text-gold" : "text-ember"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl",
          dark ? "text-sand" : "text-charcoal"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            dark ? "text-sand/75" : "text-charcoal/70"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

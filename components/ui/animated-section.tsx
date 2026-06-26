"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/components/ui/cn";

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  ...props
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}

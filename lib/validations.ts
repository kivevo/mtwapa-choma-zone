import { z } from "zod";

export const eventInquirySchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s+\-()]+$/, "Invalid phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  event_type_id: z.string().optional(),
  preferred_date: z.string().optional(),
  guest_count: z.string().optional(),
  message: z.string().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export const contactMessageSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  website: z.string().max(0).optional(), // honeypot
});

export type EventInquiryInput = z.infer<typeof eventInquirySchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const testimonialSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().min(1, "Please provide a rating").max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000),
  website: z.string().max(0).optional(), // honeypot
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const reservationSchema = z.object({
  guest_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s+\-()]+$/, "Invalid phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  reservation_date: z.string().min(1, "Please select a date"),
  reservation_time: z.string().min(1, "Please select a time"),
  party_size: z.coerce.number().min(1, "At least 1 guest required").max(50, "For parties larger than 50, please use Event Inquiry"),
  special_requests: z.string().max(1000).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export type ReservationInput = z.infer<typeof reservationSchema>;

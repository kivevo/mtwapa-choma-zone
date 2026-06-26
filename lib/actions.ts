"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { sendAdminEmailNotification } from "@/lib/email";
import {
  contactMessageSchema,
  eventInquirySchema,
  testimonialSchema,
  reservationSchema,
  type ContactMessageInput,
  type EventInquiryInput,
  type TestimonialInput,
  type ReservationInput,
} from "@/lib/validations";

export async function submitEventInquiry(data: EventInquiryInput) {
  const parsed = eventInquirySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    console.log("[Demo mode] Event inquiry:", parsed.data);
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("event_inquiries").insert({
    full_name: parsed.data.full_name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    event_type_id: parsed.data.event_type_id || null,
    preferred_date: parsed.data.preferred_date || null,
    guest_count: parsed.data.guest_count
      ? parseInt(parsed.data.guest_count, 10) || null
      : null,
    message: parsed.data.message || null,
  });

  if (error) {
    return { success: false, error: "Failed to submit inquiry. Please try again or WhatsApp us." };
  }

  // Trigger Email Notification
  await sendAdminEmailNotification({
    subject: `New Event Inquiry: ${parsed.data.full_name}`,
    html: `
      <h2>New Event Inquiry Received</h2>
      <p><strong>Name:</strong> ${parsed.data.full_name}</p>
      <p><strong>Phone:</strong> ${parsed.data.phone}</p>
      <p><strong>Email:</strong> ${parsed.data.email || "N/A"}</p>
      <p><strong>Date:</strong> ${parsed.data.preferred_date || "N/A"}</p>
      <p><strong>Guests:</strong> ${parsed.data.guest_count || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #ccc;">
        ${parsed.data.message || "No message provided"}
      </blockquote>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard">View in Dashboard</a></p>
    `
  }).catch(e => console.error("Email notification failed:", e));

  return { success: true };
}

export async function submitContactMessage(data: ContactMessageInput) {
  const parsed = contactMessageSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    console.log("[Demo mode] Contact message:", parsed.data);
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    full_name: parsed.data.full_name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    return { success: false, error: "Failed to send message. Please try again or call us." };
  }

  // Trigger Email Notification
  await sendAdminEmailNotification({
    subject: `New Contact Message: ${parsed.data.full_name}`,
    html: `
      <h2>New Contact Message Received</h2>
      <p><strong>Name:</strong> ${parsed.data.full_name}</p>
      <p><strong>Phone:</strong> ${parsed.data.phone || "N/A"}</p>
      <p><strong>Email:</strong> ${parsed.data.email || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #ccc;">
        ${parsed.data.message}
      </blockquote>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard">View in Dashboard</a></p>
    `
  }).catch(e => console.error("Email notification failed:", e));

  return { success: true };
}

export async function submitTestimonial(data: TestimonialInput) {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    console.log("[Demo mode] Testimonial:", parsed.data);
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    customer_name: parsed.data.customer_name,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    approved: false, // Default to false for new submissions
  });

  if (error) {
    return { success: false, error: "Failed to submit review. Please try again." };
  }

  // Trigger Email Notification
  await sendAdminEmailNotification({
    subject: `New Review for Moderation: ${parsed.data.customer_name} (${parsed.data.rating} Stars)`,
    html: `
      <h2>New Customer Review Submitted</h2>
      <p><strong>Customer:</strong> ${parsed.data.customer_name}</p>
      <p><strong>Rating:</strong> ${parsed.data.rating} / 5 Stars</p>
      <p><strong>Comment:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #ccc;">
        ${parsed.data.comment}
      </blockquote>
      <p><em>Note: This review is hidden from the public website until you approve it.</em></p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard">Approve Review in Dashboard</a></p>
    `
  }).catch(e => console.error("Email notification failed:", e));

  return { success: true };
}

export async function submitReservation(data: ReservationInput) {
  const parsed = reservationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  if (parsed.data.website) {
    return { success: true };
  }

  if (!isSupabaseConfigured()) {
    console.log("[Demo mode] Reservation:", parsed.data);
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("table_reservations").insert({
    guest_name: parsed.data.guest_name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    reservation_date: parsed.data.reservation_date,
    reservation_time: parsed.data.reservation_time,
    party_size: parsed.data.party_size,
    special_requests: parsed.data.special_requests || null,
    status: "pending",
  });

  if (error) {
    return { success: false, error: "Failed to submit reservation. Please try again or call us." };
  }

  // Trigger Email Notification
  await sendAdminEmailNotification({
    subject: `New Reservation Request: ${parsed.data.guest_name}`,
    html: `
      <h2>New Table Reservation Request</h2>
      <p><strong>Guest Name:</strong> ${parsed.data.guest_name}</p>
      <p><strong>Phone:</strong> ${parsed.data.phone}</p>
      <p><strong>Email:</strong> ${parsed.data.email || "N/A"}</p>
      <p><strong>Date:</strong> ${parsed.data.reservation_date}</p>
      <p><strong>Time:</strong> ${parsed.data.reservation_time}</p>
      <p><strong>Party Size:</strong> ${parsed.data.party_size} people</p>
      <p><strong>Special Requests:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #ccc;">
        ${parsed.data.special_requests || "None"}
      </blockquote>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard">Manage Reservations in Dashboard</a></p>
    `
  }).catch(e => console.error("Email notification failed:", e));

  return { success: true };
}

export async function updateReservationStatus(id: string, status: string) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("table_reservations")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateInquiryStatus(id: string, status: string) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("event_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleTestimonialApproval(id: string, approved: boolean) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ approved })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };

  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateSiteSettings(data: Partial<{
  business_name: string;
  tagline: string;
  happy_hour_text: string;
  opening_hours: Record<string, string>;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  google_place_id: string;
  latitude: number;
  longitude: number;
  stat_years_open: number;
  stat_parking_capacity: number;
  stat_happy_customers: string;
  frontend_content: Record<string, string>;
}>) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .single();

  if (!settings) return { success: false, error: "Settings not found" };

  const { error } = await supabase
    .from("site_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", settings.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── MENU CATEGORIES ──────────────────────────────────────────────
export async function createMenuCategory(data: {
  name: string; slug: string; display_order: number; is_signature: boolean;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("menu_categories").insert(data);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateMenuCategory(id: string, data: {
  name: string; slug: string; display_order: number; is_signature: boolean;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("menu_categories").update(data).eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteMenuCategory(id: string) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── MENU ITEMS ───────────────────────────────────────────────────
export async function createMenuItem(data: {
  category_id: string; name: string; description: string;
  price_kes: number; display_order: number; is_available: boolean;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").insert(data);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateMenuItem(id: string, data: {
  category_id: string; name: string; description: string;
  price_kes: number; display_order: number; is_available: boolean;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").update(data).eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteMenuItem(id: string) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── GALLERY ──────────────────────────────────────────────────────
export async function createGalleryImage(data: {
  category: string; storage_path: string; caption: string; display_order: number;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").insert(data);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateGalleryImage(id: string, data: {
  category: string; caption: string; display_order: number; storage_path?: string;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_images").update(data).eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── EVENT TYPES ───────────────────────────────────────────────────
export async function createEventType(data: {
  name: string; description: string; icon_name: string; display_order: number;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("event_types").insert(data);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateEventType(id: string, data: {
  name: string; description: string; icon_name: string; display_order: number;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("event_types").update(data).eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteEventType(id: string) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("event_types").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── CALENDAR EVENTS ───────────────────────────────────────────────
export async function createCalendarEvent(data: {
  title: string; description: string; day_of_week: string;
  event_date: string | null; is_recurring: boolean;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("events_calendar").insert(data);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateCalendarEvent(id: string, data: {
  title: string; description: string; day_of_week: string;
  event_date: string | null; is_recurring: boolean;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("events_calendar").update(data).eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteCalendarEvent(id: string) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("events_calendar").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── TESTIMONIALS ──────────────────────────────────────────────────
export async function createTestimonial(data: {
  customer_name: string; rating: number; comment: string; approved: boolean;
}) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(data);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  if (!isSupabaseConfigured()) return { success: false, error: "Not configured" };
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function signInAdmin(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

import {
  FALLBACK_CALENDAR,
  FALLBACK_EVENT_TYPES,
  FALLBACK_GALLERY,
  FALLBACK_MENU,
  FALLBACK_SETTINGS,
  FALLBACK_TESTIMONIALS,
} from "@/lib/fallback-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  CalendarEvent,
  EventType,
  GalleryImage,
  MenuCategoryWithItems,
  SiteSettings,
  Testimonial,
} from "@/types/database.types";

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return FALLBACK_SETTINGS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) return FALLBACK_SETTINGS;
  return data as SiteSettings;
}

export async function getMenuCategories(): Promise<MenuCategoryWithItems[]> {
  if (!isSupabaseConfigured()) return FALLBACK_MENU;

  const supabase = await createClient();
  const { data: categories, error: catError } = await supabase
    .from("menu_categories")
    .select("*")
    .order("display_order");

  if (catError || !categories?.length) return FALLBACK_MENU;

  const { data: items, error: itemError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("display_order");

  if (itemError) return FALLBACK_MENU;

  return categories.map((cat) => ({
    ...cat,
    menu_items: (items ?? []).filter((item) => item.category_id === cat.id),
  })) as MenuCategoryWithItems[];
}

export async function getGalleryImages(
  category?: string
): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) {
    if (category && category !== "all") {
      return FALLBACK_GALLERY.filter((img) => img.category === category);
    }
    return FALLBACK_GALLERY;
  }

  const supabase = await createClient();
  let query = supabase
    .from("gallery_images")
    .select("*")
    .order("display_order");

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error || !data?.length) {
    if (category && category !== "all") {
      return FALLBACK_GALLERY.filter((img) => img.category === category);
    }
    return FALLBACK_GALLERY;
  }

  return data as GalleryImage[];
}

export async function getEventTypes(): Promise<EventType[]> {
  if (!isSupabaseConfigured()) return FALLBACK_EVENT_TYPES;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_types")
    .select("*")
    .order("display_order");

  if (error || !data?.length) return FALLBACK_EVENT_TYPES;
  return data as EventType[];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return FALLBACK_TESTIMONIALS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return FALLBACK_TESTIMONIALS;
  return data as Testimonial[];
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured()) return FALLBACK_CALENDAR;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events_calendar")
    .select("*")
    .order("created_at");

  if (error || !data?.length) return FALLBACK_CALENDAR;
  return data as CalendarEvent[];
}

export function getSupabasePublicUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.includes("your-project")) return undefined;
  return url;
}

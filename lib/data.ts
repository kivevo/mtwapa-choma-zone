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
  GalleryCategoryRow,
  GalleryImage,
  MenuCategoryWithItems,
  SiteSettings,
  Testimonial,
} from "@/types/database.types";

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return FALLBACK_SETTINGS;
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
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

  const activeCats = categories.filter((c) => !c.deleted_at);
  const activeItems = (items ?? []).filter((item) => !item.deleted_at);

  return activeCats.map((cat) => ({
    ...cat,
    menu_items: activeItems.filter((item) => item.category_id === cat.id),
  })) as MenuCategoryWithItems[];
}

export async function getGalleryCategories(): Promise<GalleryCategoryRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error: catErr } = await supabase
    .from("gallery_categories")
    .select("*")
    .order("display_order");
  if (catErr) return [];
  return ((data ?? []).filter((c) => !c.deleted_at)) as GalleryCategoryRow[];
}

export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) {
    if (category && category !== "all") return FALLBACK_GALLERY.filter((img) => img.category === category);
    return FALLBACK_GALLERY;
  }

  const supabase = await createClient();
  let query = supabase
    .from("gallery_images")
    .select("*")
    .eq("is_visible", true)
    .neq("category", "website_assets")
    .order("display_order");

  if (category && category !== "all") query = query.eq("category", category);

  const { data, error } = await query;
  if (error || !data?.length) {
    if (category && category !== "all") return FALLBACK_GALLERY.filter((img) => img.category === category);
    return FALLBACK_GALLERY;
  }
  // Filter soft-deleted in JS (resilient if column doesn't exist yet)
  const active = data.filter((img) => !img.deleted_at);

  return active as GalleryImage[];
}

export async function getEventTypes(): Promise<EventType[]> {
  if (!isSupabaseConfigured()) return FALLBACK_EVENT_TYPES;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_types")
    .select("*")
    .order("display_order");
  if (error || !data?.length) return FALLBACK_EVENT_TYPES;
  return data.filter((e) => !e.deleted_at) as EventType[];
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
  return data.filter((t) => !t.deleted_at) as Testimonial[];
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  if (!isSupabaseConfigured()) return FALLBACK_CALENDAR;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events_calendar")
    .select("*")
    .order("created_at");
  if (error || !data?.length) return FALLBACK_CALENDAR;
  return data.filter((e) => !e.deleted_at) as CalendarEvent[];
}

export function getSupabasePublicUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.includes("your-project")) return undefined;
  return url;
}

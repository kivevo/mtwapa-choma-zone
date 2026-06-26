export type GalleryCategory =
  | "garden"
  | "food_choma"
  | "kids_playground"
  | "choma_area"
  | "coffee_shop"
  | "parking"
  | "signage"
  | "bar_area"
  | "events";

export interface SiteSettings {
  id: string;
  business_name: string;
  tagline: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  google_place_id: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  opening_hours: Record<string, string>;
  happy_hour_text: string;
  stat_years_open?: number;
  stat_parking_capacity?: number;
  stat_happy_customers?: string;
  frontend_content?: Record<string, string>;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_signature: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_kes: number | null;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
}

export interface GalleryImage {
  id: string;
  category: GalleryCategory;
  storage_path: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface EventType {
  id: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  display_order: number;
}

export interface EventInquiry {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  event_type_id: string | null;
  preferred_date: string | null;
  guest_count: number | null;
  message: string | null;
  status: "new" | "contacted" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  rating: number | null;
  comment: string;
  approved: boolean;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  day_of_week: string | null;
  event_date: string | null;
  is_recurring: boolean;
  created_at: string;
}

export interface MenuCategoryWithItems extends MenuCategory {
  menu_items: MenuItem[];
}

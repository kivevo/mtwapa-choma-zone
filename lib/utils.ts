import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageUrl(url: string | null | undefined, supabaseUrl?: string): string {
  if (!url) return "";
  const envUrl = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  // If url contains localhost or 127.0.0.1 (saved from dev environment), replace with production Supabase URL
  if ((url.includes("localhost") || url.includes("127.0.0.1")) && envUrl) {
    const parts = url.split("/storage/v1/object/public/");
    if (parts.length > 1) {
      return `${envUrl}/storage/v1/object/public/${parts[1]}`;
    }
  }

  // If it's already a valid external HTTP/HTTPS URL or static root asset (/...), return as is
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }

  // If it's a relative storage path, construct full Supabase public storage URL
  if (envUrl) {
    const cleanPath = url.startsWith("gallery/") ? url : `gallery/${url}`;
    return `${envUrl}/storage/v1/object/public/${cleanPath}`;
  }

  return url;
}

export function formatKES(amount: number | null | undefined): string {
  if (amount == null) return "";
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function formatPhoneForTel(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  if (digits.startsWith("254")) return `+${digits}`;
  return `+254${digits}`;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

export const WHATSAPP_NUMBER = "254711333090";
export const WHATSAPP_URL =
  "https://wa.me/254711333090?text=Hi%20Choma%20Zone%20Mtwapa%20Palms%2C%20I%27d%20like%20to%20inquire...";

export function generateWhatsAppOrderUrl(itemName: string, phoneStr: string = WHATSAPP_NUMBER): string {
  const digits = phoneStr.replace(/\D/g, "");
  const basePhone = digits.startsWith("0") ? `254${digits.slice(1)}` : digits;
  const message = `Hi Choma Zone Mtwapa Palms, I would like to order:\n\n1x ${itemName}\n\nPlease let me know if this is available.`;
  return `https://wa.me/${basePhone}?text=${encodeURIComponent(message)}`;
}

export const GOOGLE_MAPS_EMBED =
  "https://maps.google.com/maps?q=-3.943549,39.745274&z=16&output=embed";

export const GOOGLE_MAPS_DIRECTIONS =
  "https://www.google.com/maps/search/?api=1&query=Choma+Zone+Mtwapa+Palms&query_place_id=ChIJH9J-1GcJQBgRsgp0tmZBpBY";


export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#events", label: "Events" },
  { href: "#happy-hour", label: "Happy Hour" },
  { href: "#location", label: "Location" },
  { href: "#contact", label: "Contact" },
] as const;

import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getSupabasePublicUrl } from "@/lib/data";

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal p-4 text-sand">
        <p>Configure Supabase credentials in .env.local to use the admin dashboard.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  const [
    { data: inquiries },
    { data: contacts },
    { data: testimonials },
    { data: menuCategories },
    { data: menuItems },
    { data: galleryImages },
    { data: eventTypes },
    { data: calendarEvents },
    { data: settings },
    { data: tableReservations },
  ] = await Promise.all([
    supabase
      .from("event_inquiries")
      .select("*, event_types(name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
    supabase.from("menu_categories").select("*").order("display_order"),
    supabase
      .from("menu_items")
      .select("*, menu_categories(name)")
      .order("display_order"),
    supabase.from("gallery_images").select("*").order("display_order"),
    supabase.from("event_types").select("*").order("display_order"),
    supabase.from("events_calendar").select("*").order("created_at"),
    supabase.from("site_settings").select("*").limit(1).single(),
    supabase.from("table_reservations").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <AdminDashboard
      inquiries={inquiries ?? []}
      contacts={contacts ?? []}
      testimonials={testimonials ?? []}
      menuCategories={menuCategories ?? []}
      menuItems={menuItems ?? []}
      galleryImages={galleryImages ?? []}
      eventTypes={eventTypes ?? []}
      calendarEvents={calendarEvents ?? []}
      settings={settings}
      tableReservations={tableReservations ?? []}
      supabaseUrl={getSupabasePublicUrl()}
    />
  );
}


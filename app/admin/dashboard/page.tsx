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

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

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
    { data: galleryCategories },
    recycleBinItems,
  ] = await Promise.all([
    supabase.from("event_inquiries").select("*, event_types(name)").is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("*").is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("testimonials").select("*").is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("menu_categories").select("*").is("deleted_at", null).order("display_order"),
    supabase.from("menu_items").select("*, menu_categories(name)").is("deleted_at", null).order("display_order"),
    supabase.from("gallery_images").select("*").is("deleted_at", null).order("display_order"),
    supabase.from("event_types").select("*").is("deleted_at", null).order("display_order"),
    supabase.from("events_calendar").select("*").is("deleted_at", null).order("created_at"),
    supabase.from("site_settings").select("*").limit(1).single(),
    supabase.from("table_reservations").select("*").is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("gallery_categories").select("*").is("deleted_at", null).order("display_order"),
    // Recycle bin: items soft-deleted in the past 30 days
    Promise.all([
      supabase.from("gallery_images").select("id, caption, storage_path, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("menu_items").select("id, name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("menu_categories").select("id, name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("event_types").select("id, name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("events_calendar").select("id, title, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
    ]).then(([gallery, mi, mc, et, ce]) => [
      ...(gallery.data ?? []).map((r) => ({ ...r, table: "gallery_images", label: r.caption || r.storage_path })),
      ...(mi.data ?? []).map((r) => ({ ...r, table: "menu_items", label: r.name })),
      ...(mc.data ?? []).map((r) => ({ ...r, table: "menu_categories", label: r.name })),
      ...(et.data ?? []).map((r) => ({ ...r, table: "event_types", label: r.name })),
      ...(ce.data ?? []).map((r) => ({ ...r, table: "events_calendar", label: r.title })),
    ].sort((a, b) => new Date(b.deleted_at!).getTime() - new Date(a.deleted_at!).getTime())),
  ]);

  return (
    <AdminDashboard
      inquiries={inquiries ?? []}
      contacts={contacts ?? []}
      testimonials={testimonials ?? []}
      menuCategories={menuCategories ?? []}
      menuItems={menuItems ?? []}
      galleryImages={galleryImages ?? []}
      galleryCategories={galleryCategories ?? []}
      eventTypes={eventTypes ?? []}
      calendarEvents={calendarEvents ?? []}
      settings={settings}
      tableReservations={tableReservations ?? []}
      supabaseUrl={getSupabasePublicUrl()}
      recycleBinItems={recycleBinItems ?? []}
    />
  );
}

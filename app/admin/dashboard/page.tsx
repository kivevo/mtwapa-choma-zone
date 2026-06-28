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

  // NOTE: We intentionally do NOT filter by deleted_at in these admin queries.
  // The deleted_at column may not yet exist (migrations pending), and admins
  // need to see all data. Public site queries (lib/data.ts) handle filtering.
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
  ] = await Promise.all([
    supabase.from("event_inquiries").select("*, event_types(name)").order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
    supabase.from("menu_categories").select("*").order("display_order"),
    supabase.from("menu_items").select("*, menu_categories(name)").order("display_order"),
    supabase.from("gallery_images").select("*").order("display_order"),
    supabase.from("event_types").select("*").order("display_order"),
    supabase.from("events_calendar").select("*").order("created_at"),
    supabase.from("site_settings").select("*").limit(1).single(),
    supabase.from("table_reservations").select("*").order("created_at", { ascending: false }),
    // gallery_categories may not exist yet — silently fall back to empty
    supabase.from("gallery_categories").select("*").order("display_order").then(
      (res) => res,
      () => ({ data: [] })
    ),
  ]);

  // Recycle bin — only fetch if deleted_at column exists (after migration 009)
  // We catch errors gracefully so the dashboard still loads before migrations are run.
  let recycleBinItems: Array<Record<string, unknown>> = [];
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const [g, mi, mc, et, ce, gc, testims, contacts, inq, resv] = await Promise.all([
      supabase.from("gallery_images").select("id, caption, storage_path, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("menu_items").select("id, name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("menu_categories").select("id, name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("event_types").select("id, name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("events_calendar").select("id, title, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("gallery_categories").select("id, name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("testimonials").select("id, customer_name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("contact_messages").select("id, full_name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("event_inquiries").select("id, full_name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
      supabase.from("table_reservations").select("id, guest_name, deleted_at").not("deleted_at", "is", null).gte("deleted_at", cutoff.toISOString()),
    ]);

    recycleBinItems = [
      ...(g.data ?? []).map((r) => ({ ...r, table: "gallery_images", label: r.caption || r.storage_path })),
      ...(mi.data ?? []).map((r) => ({ ...r, table: "menu_items", label: r.name })),
      ...(mc.data ?? []).map((r) => ({ ...r, table: "menu_categories", label: r.name })),
      ...(et.data ?? []).map((r) => ({ ...r, table: "event_types", label: r.name })),
      ...(ce.data ?? []).map((r) => ({ ...r, table: "events_calendar", label: r.title })),
      ...(gc.data ?? []).map((r) => ({ ...r, table: "gallery_categories", label: r.name })),
      ...(testims.data ?? []).map((r) => ({ ...r, table: "testimonials", label: r.customer_name })),
      ...(contacts.data ?? []).map((r) => ({ ...r, table: "contact_messages", label: r.full_name })),
      ...(inq.data ?? []).map((r) => ({ ...r, table: "event_inquiries", label: r.full_name })),
      ...(resv.data ?? []).map((r) => ({ ...r, table: "table_reservations", label: r.guest_name })),
    ].sort((a, b) => new Date(b.deleted_at as string).getTime() - new Date(a.deleted_at as string).getTime());
  } catch {
    // Migration not yet applied — recycle bin is empty until then
  }

  // Also filter out already-soft-deleted items for admin view IF the column exists
  const activeGalleryImages = (galleryImages ?? []).filter((img) => !img.deleted_at);
  const activeMenuItems = (menuItems ?? []).filter((item) => !item.deleted_at);
  const activeMenuCategories = (menuCategories ?? []).filter((cat) => !cat.deleted_at);
  const activeGalleryCategories = (galleryCategories ?? []).filter((cat) => !cat.deleted_at);

  return (
    <AdminDashboard
      inquiries={(inquiries ?? []).filter((i) => !i.deleted_at)}
      contacts={(contacts ?? []).filter((c) => !c.deleted_at)}
      testimonials={(testimonials ?? []).filter((t) => !t.deleted_at)}
      menuCategories={activeMenuCategories}
      menuItems={activeMenuItems}
      galleryImages={activeGalleryImages}
      galleryCategories={activeGalleryCategories}
      eventTypes={(eventTypes ?? []).filter((e) => !e.deleted_at)}
      calendarEvents={(calendarEvents ?? []).filter((e) => !e.deleted_at)}
      settings={settings}
      tableReservations={(tableReservations ?? []).filter((r) => !r.deleted_at)}
      supabaseUrl={getSupabasePublicUrl()}
      recycleBinItems={recycleBinItems}
    />
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginClient } from "@/components/admin/admin-login";
import { getSiteSettings } from "@/lib/data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/admin/dashboard");
    }
  }

  const settings = await getSiteSettings();
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal p-4">
      <AdminLoginClient settings={settings} />
    </div>
  );
}

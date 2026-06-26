import type { Metadata } from "next";
import { AdminLoginClient } from "@/components/admin/admin-login";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const settings = await getSiteSettings();
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal p-4">
      <AdminLoginClient settings={settings} />
    </div>
  );
}

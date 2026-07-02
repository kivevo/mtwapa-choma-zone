import type { Metadata } from "next";
import { getMenuCategories, getSiteSettings } from "@/lib/data";
import { MenuSection } from "@/components/sections/menu-section";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Nyama choma, Kenyan cuisine, pizza, coffee, ice cream, and bar drinks at Choma Zone Mtwapa Palms. Best choma on the North Coast.",
};

export default async function MenuPage() {
  const [categories, settings] = await Promise.all([
    getMenuCategories(),
    getSiteSettings()
  ]);

  return (
    <div className="pt-24">
      <MenuSection categories={categories} settings={settings} />
    </div>
  );
}

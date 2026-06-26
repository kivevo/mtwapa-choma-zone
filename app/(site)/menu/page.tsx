import type { Metadata } from "next";
import { getMenuCategories } from "@/lib/data";
import { MenuSection } from "@/components/sections/menu-section";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Nyama choma, Kenyan cuisine, pizza, coffee, ice cream, and bar drinks at Choma Zone Mtwapa Palms. Best choma on the North Coast.",
};

export default async function MenuPage() {
  const categories = await getMenuCategories();

  return (
    <div className="pt-24">
      <MenuSection categories={categories} />
    </div>
  );
}

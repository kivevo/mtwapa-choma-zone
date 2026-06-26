import type { Metadata } from "next";
import {
  getGalleryImages,
  getSiteSettings,
  getSupabasePublicUrl,
} from "@/lib/data";
import { GallerySection } from "@/components/sections/gallery-section";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos of the Choma Zone Mtwapa Palms garden, nyama choma, kids playground, bar, and the iconic I ❤️ MTWAPA sign.",
};

export default async function GalleryPage() {
  const [images, settings] = await Promise.all([
    getGalleryImages(),
    getSiteSettings(),
  ]);
  const supabaseUrl = getSupabasePublicUrl();

  return (
    <div className="pt-24">
      <GallerySection
        images={images}
        supabaseUrl={supabaseUrl}
        settings={settings}
      />
    </div>
  );
}

import type { Metadata } from "next";
import {
  getGalleryImages,
  getSiteSettings,
  getSupabasePublicUrl,
  getGalleryCategories,
} from "@/lib/data";
import { GallerySection } from "@/components/sections/gallery-section";
import { VideoShowcase } from "@/components/sections/video-showcase";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos of the Choma Zone Mtwapa Palms garden, nyama choma, kids playground, bar, and the iconic I ❤️ MTWAPA sign.",
};

export default async function GalleryPage() {
  const [images, settings, categories] = await Promise.all([
    getGalleryImages(),
    getSiteSettings(),
    getGalleryCategories(),
  ]);
  const supabaseUrl = getSupabasePublicUrl();
  const photos = images.filter((img) => img.media_type !== "video");
  const videos = images.filter((img) => img.media_type === "video");

  return (
    <div className="pt-24">
      <GallerySection
        images={photos}
        categories={categories}
        supabaseUrl={supabaseUrl}
        settings={settings}
      />
      <VideoShowcase videos={videos} supabaseUrl={supabaseUrl} />
    </div>
  );
}

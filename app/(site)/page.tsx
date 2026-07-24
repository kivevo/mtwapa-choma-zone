import {
  getSiteSettings,
  getMenuCategories,
  getGalleryImages,
  getEventTypes,
  getTestimonials,
  getCalendarEvents,
  getSupabasePublicUrl,
  getGalleryCategories,
} from "@/lib/data";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { MenuSection } from "@/components/sections/menu-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { EventsSection } from "@/components/sections/events-section";
import { FamilyFunSection } from "@/components/sections/family-fun";
import { StopoverSection } from "@/components/sections/stopover";
import { HappyHourSection } from "@/components/sections/happy-hour";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { SocialShowcaseSection } from "@/components/sections/social-showcase";
import { LocationSection } from "@/components/sections/location-section";
import { RestaurantJsonLd } from "@/components/seo/json-ld";
import { WhatsAppFab } from "@/components/ui/whatsapp-fab";

export default async function HomePage() {
  const [
    settings,
    menuCategories,
    galleryImages,
    eventTypes,
    testimonials,
    calendarEvents,
    galleryCategories,
  ] = await Promise.all([
    getSiteSettings(),
    getMenuCategories(),
    getGalleryImages(),
    getEventTypes(),
    getTestimonials(),
    getCalendarEvents(),
    getGalleryCategories(),
  ]);

  const supabaseUrl = getSupabasePublicUrl();
  const photos = galleryImages.filter((img) => img.media_type !== "video");

  return (
    <>
      <RestaurantJsonLd settings={settings} />
      <Hero settings={settings} />
      <About settings={settings} />
      <MenuSection categories={menuCategories} settings={settings} preview />
      <GallerySection
        images={photos}
        categories={galleryCategories}
        supabaseUrl={supabaseUrl}
        settings={settings}
        preview
      />
      <EventsSection eventTypes={eventTypes} settings={settings} />
      <FamilyFunSection settings={settings} />
      <StopoverSection settings={settings} />
      <HappyHourSection
        settings={settings}
        calendarEvents={calendarEvents}
      />
      <TestimonialsSection testimonials={testimonials} />
      <SocialShowcaseSection settings={settings} />
      <LocationSection settings={settings} />
      <WhatsAppFab phone={settings.phone_primary} />
    </>
  );
}


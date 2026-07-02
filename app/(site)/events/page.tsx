import type { Metadata } from "next";
import { getEventTypes, getSiteSettings } from "@/lib/data";
import { EventsSection } from "@/components/sections/events-section";

export const metadata: Metadata = {
  title: "Events & Celebrations",
  description:
    "Host birthdays, mbuzi choma parties, corporate events, wedding photoshoots, and Family Fun Days at Choma Zone Mtwapa Palms garden venue.",
};

export default async function EventsPage() {
  const [eventTypes, settings] = await Promise.all([
    getEventTypes(),
    getSiteSettings()
  ]);

  return (
    <div className="pt-24">
      <EventsSection eventTypes={eventTypes} settings={settings} />
    </div>
  );
}

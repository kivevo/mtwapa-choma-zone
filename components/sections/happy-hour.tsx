"use client";

import { Music, Wine, Calendar } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CalendarEvent, SiteSettings } from "@/types/database.types";

interface HappyHourSectionProps {
  settings: SiteSettings;
  calendarEvents: CalendarEvent[];
}

export function HappyHourSection({
  settings,
  calendarEvents,
}: HappyHourSectionProps) {
  return (
    <AnimatedSection
      id="happy-hour"
      className="relative overflow-hidden bg-charcoal py-20 lg:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ember/15 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Evenings & Bar"
          title="Smooth Evenings, Good Music, Cold Drinks"
          description="As the sun sets over Mtwapa, the garden transforms. Happy hour deals, live Rhumba and Mugithi nights, DJ sets, and the best sundowner spot on the North Coast."
          dark
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gold/20 bg-charcoal/80 p-8">
            <div className="mb-4 inline-flex rounded-full bg-ember/20 p-3 text-ember">
              <Wine className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-gold">
              Happy Hour
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-sand/80">
              {settings.happy_hour_text}
            </p>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-charcoal/80 p-8">
            <div className="mb-4 inline-flex rounded-full bg-gold/20 p-3 text-gold">
              <Music className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-gold">
              What&apos;s On This Week
            </h3>
            <ul className="mt-4 space-y-4">
              {calendarEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-start gap-3 border-b border-white/5 pb-4 last:border-0"
                >
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                  <div>
                    <p className="font-semibold text-sand">{event.title}</p>
                    {event.day_of_week && (
                      <p className="text-sm text-gold">{event.day_of_week}</p>
                    )}
                    {event.description && (
                      <p className="mt-1 text-sm text-sand/60">
                        {event.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

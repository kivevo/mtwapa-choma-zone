"use client";

import {
  Cake,
  Baby,
  GraduationCap,
  Camera,
  Flame,
  Users,
  Briefcase,
  Presentation,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventInquiryForm } from "@/components/forms/event-inquiry-form";
import { Button } from "@/components/ui/button";
import { generateWhatsAppUrl } from "@/lib/utils";
import type { EventType, SiteSettings } from "@/types/database.types";

const ICON_MAP: Record<string, LucideIcon> = {
  cake: Cake,
  baby: Baby,
  "graduation-cap": GraduationCap,
  camera: Camera,
  flame: Flame,
  users: Users,
  briefcase: Briefcase,
  presentation: Presentation,
  heart: Heart,
  sparkles: Sparkles,
};

interface EventsSectionProps {
  eventTypes: EventType[];
  settings: SiteSettings;
}

export function EventsSection({ eventTypes, settings }: EventsSectionProps) {
  return (
    <AnimatedSection id="events" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Events & Celebrations"
          title="Host Your Event With Us"
          description="Planning a birthday party, graduation, family gathering, or company get-together? We have open garden spaces and custom choma platters ready for your group."
        />

        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {eventTypes.map((event) => {
            const Icon = ICON_MAP[event.icon_name ?? ""] ?? Sparkles;
            return (
              <div
                key={event.id}
                className="group rounded-2xl border border-palm/10 bg-sand/30 p-5 transition-all hover:-translate-y-1 hover:border-ember/30 hover:shadow-lg"
              >
                <div className="mb-3 inline-flex rounded-xl bg-ember/10 p-2.5 text-ember transition-colors group-hover:bg-ember group-hover:text-sand">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-charcoal">
                  {event.name}
                </h3>
                {event.description && (
                  <p className="mt-1 text-sm text-charcoal/60">
                    {event.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-bold text-charcoal">
              Plan Your Event
            </h3>
            <p className="mt-3 text-charcoal/70">
              Tell us about your celebration and we&apos;ll get back to you
              quickly. For faster response, WhatsApp us directly.
            </p>
            <Button asChild variant="whatsapp" className="mt-6">
              <a href={generateWhatsAppUrl(settings.phone_primary)} target="_blank" rel="noopener noreferrer">
                Prefer to chat? WhatsApp us
              </a>
            </Button>
          </div>
          <EventInquiryForm eventTypes={eventTypes} />
        </div>
      </div>
    </AnimatedSection>
  );
}

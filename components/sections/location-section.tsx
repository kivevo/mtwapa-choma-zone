"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactButtons } from "@/components/contact-buttons";
import { Button } from "@/components/ui/button";
import { generateGoogleMapsDirections, generateGoogleMapsEmbed } from "@/lib/utils";
import { MapPin, Mail, Clock } from "lucide-react";
import { formatPhoneDisplay } from "@/lib/utils";
import type { SiteSettings } from "@/types/database.types";

interface LocationSectionProps {
  settings: SiteSettings;
}

export function LocationSection({ settings }: LocationSectionProps) {
  const hours = settings.opening_hours;

  return (
    <AnimatedSection id="location" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where to Find Us"
          title="We're on the Mombasa–Malindi Highway"
          description="Opposite Galana Petrol Station in Mtwapa. Easy to spot — look for our big garden, the I ❤️ MTWAPA sign, and plenty of parking."
        />

        <div id="contact" className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-ember" />
                <div>
                  <p className="font-semibold text-charcoal">Address</p>
                  <p className="text-charcoal/70">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-semibold text-charcoal">Opening Hours</p>
                  <p className="text-charcoal/70">
                    Mon – Fri: {hours.mon_fri}
                  </p>
                  <p className="text-charcoal/70">
                    Sat – Sun: {hours.sat_sun}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-ember" />
                <div>
                  <p className="font-semibold text-charcoal">Contact</p>
                  <p className="text-charcoal/70">
                    {formatPhoneDisplay(settings.phone_primary)} /{" "}
                    {formatPhoneDisplay(settings.phone_secondary)}
                  </p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-ember hover:underline"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <ContactButtons phone={settings.phone_primary} />
            </div>

            <div className="mt-10">
              <h3 className="font-display text-xl font-bold text-charcoal">
                Send Us a Message
              </h3>
              <div className="mt-4">
                <ContactForm />
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <iframe
                src={generateGoogleMapsEmbed(settings.latitude || 0, settings.longitude || 0)}
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Choma Zone Mtwapa Palms location map"
                className="w-full"
              />
            </div>
            <Button asChild className="mt-4 w-full" size="lg">
              <a
                href={generateGoogleMapsDirections(settings.google_place_id || "")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

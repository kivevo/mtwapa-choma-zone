"use client";

import { Trees, Car, Baby } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SiteSettings } from "@/types/database.types";

interface AboutProps {
  settings: SiteSettings;
}

const features = [
  {
    icon: Trees,
    title: "Garden Setting",
    description:
      "Lush makuti-roof pavilions, palm trees, and open-air dining under the coastal sky.",
  },
  {
    icon: Car,
    title: "Secure Parking",
    description:
      "Ample parking for families, travelers, and event guests — right on the highway.",
  },
  {
    icon: Baby,
    title: "Family Play Area",
    description:
      "Fully equipped, supervised children's playground — safe fun while you unwind.",
  },
];

export function About({ settings }: AboutProps) {
  return (
    <AnimatedSection id="about" className="bg-sand py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Story"
          title={settings.frontend_content?.about_title || "More Than a Restaurant — A Coastal Institution"}
          description={settings.frontend_content?.about_p1 || "Right on the Mombasa–Malindi Highway, opposite Galana Petrol Station, Choma Zone Mtwapa Palms is where families gather for Sunday lunch, travelers stop for coffee and choma, and friends meet for sundowners as the grill fires up at dusk."}
        />

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-charcoal/75">
            {settings.frontend_content?.about_p2 || "We're an open garden bar, restaurant, and events venue known across the North Coast for the best nyama choma in town. By day, we're your family's favourite lunch spot. By night, the garden comes alive with live music, cold drinks, and the glow of the choma fire."}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-palm/10 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-4 inline-flex rounded-2xl bg-palm/10 p-3 text-palm transition-colors group-hover:bg-ember group-hover:text-sand">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-charcoal">
                {feature.title}
              </h3>
              <p className="mt-2 text-charcoal/70">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 rounded-3xl bg-palm p-6 text-center text-sand md:gap-12 md:p-12">
          <div>
            <p className="font-display text-2xl font-bold text-gold sm:text-3xl md:text-4xl">
              {settings.stat_years_open ?? 8}+
            </p>
            <p className="mt-1 text-xs text-sand/80 sm:text-sm">Years Serving Mtwapa</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-gold sm:text-3xl md:text-4xl">
              {settings.stat_parking_capacity ?? 100}+
            </p>
            <p className="mt-1 text-xs text-sand/80 sm:text-sm">Parking Spaces</p>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-gold sm:text-2xl md:text-3xl">
              {settings.stat_happy_customers ?? "Thousands"}
            </p>
            <p className="mt-1 text-xs text-sand/80 sm:text-sm">Happy Choma Lovers</p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

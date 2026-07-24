"use client";

import { Coffee, IceCream, Pizza, Toilet, ParkingCircle, MapPin } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

import type { SiteSettings } from "@/types/database.types";

const stops = [
  { icon: Coffee, label: "Fresh Kenyan Coffee" },
  { icon: IceCream, label: "Ice Cream Counter" },
  { icon: Pizza, label: "Quick Pizza & Bites" },
  { icon: Toilet, label: "Clean Restrooms" },
  { icon: ParkingCircle, label: "Secure Parking" },
];

export function StopoverSection({ settings }: { settings: SiteSettings }) {
  return (
    <AnimatedSection className="border-y border-palm/10 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-lg text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-ember">
              Just Passing Through?
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-charcoal">
              {settings.frontend_content?.stopover_title || "Your Natural Stop Between Mombasa & Malindi"}
            </h2>
            <p className="mt-3 text-charcoal/70">
              {settings.frontend_content?.stopover_desc || "Right on the highway, opposite Galana Petrol Station — fuel up, stretch your legs, grab coffee or choma, and hit the road refreshed."}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-palm">
              <MapPin className="h-4 w-4" />
              Mombasa–Malindi Highway, Mtwapa
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {stops.map((stop) => (
              <div
                key={stop.label}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white px-5 py-4 text-center shadow-md shadow-charcoal/5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/10">
                  <stop.icon className="h-5 w-5 text-ember" />
                </div>
                <span className="text-xs font-semibold text-charcoal">
                  {stop.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

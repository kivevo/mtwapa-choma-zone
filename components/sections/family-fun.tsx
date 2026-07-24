"use client";

import { Shield, Smile, PartyPopper } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SiteSettings } from "@/types/database.types";

export function FamilyFunSection({ settings }: { settings: SiteSettings }) {
  return (
    <AnimatedSection className="relative overflow-hidden bg-gradient-to-br from-palm/5 to-sand py-20 lg:py-28">
      <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Family Fun"
          title={settings.frontend_content?.family_fun_title || "Kids' Playground & Family Dining"}
          description={settings.frontend_content?.family_fun_desc || "Every Sunday, bring the whole family. The kids play in our safe, fenced playground while you sit back, order fresh choma, and enjoy a cold drink."}
        />

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Fenced & Secure",
              text: "Our playground is fully fenced so you can eat and relax without worrying about the kids.",
            },
            {
              icon: Smile,
              title: "Fun for All Ages",
              text: "Slides, swings, and open space. From toddlers to older kids — there's room to run around.",
            },
            {
              icon: PartyPopper,
              title: "Sunday Family Days",
              text: "Every Sunday we have special family deals, kids' activities, and live entertainment.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-8 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-palm/10 p-3 text-palm">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-charcoal">
                {item.title}
              </h3>
              <p className="mt-2 text-charcoal/65">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

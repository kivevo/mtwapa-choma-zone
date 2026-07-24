"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export function About({ settings }: AboutProps) {
  const yearsTarget = settings.stat_years_open ?? 8;
  const parkingTarget = settings.stat_parking_capacity ?? 100;
  const { count: yearsCount, ref: yearsRef } = useCountUp(yearsTarget);
  const { count: parkingCount, ref: parkingRef } = useCountUp(parkingTarget, 2000);

  const aboutImage =
    settings.frontend_content?.about_image_1 ||
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80";

  return (
    <AnimatedSection id="about" className="bg-sand py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About Us"
          title={settings.frontend_content?.about_title || "Welcome to Choma Zone Mtwapa Palms"}
          description={
            settings.frontend_content?.about_p1 ||
            "Right on the Mombasa–Malindi Highway, opposite Galana Petrol Station, Choma Zone Mtwapa Palms is where families come together for Sunday lunch, travelers stop for a quick bite, and friends meet up for drinks and fresh choma."
          }
        />

        {/* Two-column: text + real food photo */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6 text-charcoal/80">
            <p className="text-lg leading-relaxed">
              {settings.frontend_content?.about_p1 ||
                "For over 8 years, Choma Zone Mtwapa Palms has been serving Mtwapa locals, Mombasa families, and upcountry travelers with authentic charcoal-grilled nyama choma, cold drinks, and friendly coastal service."}
            </p>
            <p className="text-lg leading-relaxed">
              {settings.frontend_content?.about_p2 ||
                "We've built our reputation on tender, well-seasoned nyama choma served with fresh kachumbari and ugali. By day, parents relax while kids play in our fenced playground. In the evening, the garden lights up with live bands, Rhumba nights, and cold drinks."}
            </p>
          </div>

          {/* Real photo */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-ember/10">
              <Image
                src={aboutImage}
                alt="Choma Zone Mtwapa Palms — fresh nyama choma"
                width={600}
                height={420}
                className="h-72 w-full object-cover lg:h-96"
              />
              {/* amber glow overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-xl bg-charcoal/80 px-4 py-2 backdrop-blur-sm">
                <p className="text-sm font-semibold text-sand">🔥 Fresh off the charcoal grill</p>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl bg-ember/10 blur-2xl" />
          </div>
        </div>

        {/* Feature cards with glow on hover */}
        <div className="mt-12 grid gap-4 sm:gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-palm/10 bg-white p-5 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ember/20 hover:shadow-xl hover:shadow-ember/10 hover:ring-1 hover:ring-ember/20"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-3 inline-flex rounded-xl bg-palm/10 p-2.5 text-palm transition-colors group-hover:bg-ember group-hover:text-sand sm:mb-4 sm:rounded-2xl sm:p-3">
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="font-display text-lg font-bold text-charcoal sm:text-xl">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-charcoal/70 sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Animated stats bar */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-palm via-palm to-palm/80 shadow-lg">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            <div ref={yearsRef} className="p-5 text-center sm:p-8 md:p-12">
              <p className="font-display text-3xl font-bold text-gold sm:text-4xl">
                {yearsCount}+
              </p>
              <p className="mt-1 text-[10px] leading-tight text-sand/80 sm:text-sm">Years Serving Mtwapa</p>
            </div>
            <div ref={parkingRef} className="p-5 text-center sm:p-8 md:p-12">
              <p className="font-display text-3xl font-bold text-gold sm:text-4xl">
                {parkingCount}+
              </p>
              <p className="mt-1 text-[10px] leading-tight text-sand/80 sm:text-sm">Parking Spaces</p>
            </div>
            <div className="p-5 text-center sm:p-8 md:p-12">
              <p className="font-display text-2xl font-bold text-gold sm:text-3xl md:text-4xl">
                {settings.stat_happy_customers ?? "1000s"}
              </p>
              <p className="mt-1 text-[10px] leading-tight text-sand/80 sm:text-sm">Happy Choma Lovers</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

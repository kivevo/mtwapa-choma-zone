"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactButtons } from "@/components/contact-buttons";
import { ReservationModal } from "@/components/sections/reservation-modal";
import type { SiteSettings } from "@/types/database.types";

interface HeroProps {
  settings: SiteSettings;
}

export function Hero({ settings }: HeroProps) {
  const [showReservation, setShowReservation] = useState(false);
  const hours = settings.opening_hours;

  return (
    <>
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {settings.frontend_content?.hero_bg_video ? (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={settings.frontend_content.hero_bg_video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/75 to-charcoal/95" />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              `linear-gradient(to bottom, rgba(28,26,23,0.55) 0%, rgba(28,26,23,0.75) 50%, rgba(28,26,23,0.95) 100%), url('${settings.frontend_content?.hero_bg_image || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80"}')`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-sand/20 via-transparent to-charcoal/30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-36 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold sm:mb-4 sm:text-sm sm:tracking-[0.25em]">
            {settings.tagline}
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight text-sand xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {settings.frontend_content?.hero_title_prefix || "Mtwapa's Best"}{" "}
            <span className="text-ember">{settings.frontend_content?.hero_title_highlight || "Nyama Choma"}</span>
            <br />
            <span className="block mt-1 text-xl font-medium sm:mt-2 sm:text-3xl md:text-4xl lg:text-5xl text-sand/90">
              {settings.frontend_content?.hero_title_suffix || "Open Garden Hospitality"}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-sand/85 sm:mt-6">
            {settings.frontend_content?.hero_description || "Charcoal-grilled perfection in a lush makuti garden on the Mombasa–Malindi Highway. Sundowners, family fun, events & the coast's favourite stopover spot."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:mt-10 sm:gap-4">
            <Button onClick={() => setShowReservation(true)} size="lg" className="bg-ember hover:bg-ember/90 text-white font-semibold shadow-md px-6">
              Book a Table
            </Button>
            <Button asChild variant="outline" size="lg" className="text-sand border-sand/40 hover:bg-white/10 hover:text-white px-6">
              <Link href="/#menu">View Menu</Link>
            </Button>
          </div>

          <div className="mt-6 flex justify-center sm:mt-8">
            <ContactButtons phone={settings.phone_primary} variant="dark" className="justify-center w-full xs:w-auto" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-10 inline-flex max-w-xl flex-col gap-2 rounded-2xl border border-white/10 bg-charcoal/70 px-4 py-3.5 backdrop-blur-md sm:mt-16 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-4 text-left sm:text-center"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm text-sand/80">
            <MapPin className="h-4 w-4 shrink-0 text-ember" />
            <span>Opposite Galana Petrol Station, Mtwapa</span>
          </div>
          <div className="hidden h-4 w-px bg-white/20 sm:block" />
          <div className="flex items-center gap-2 text-xs sm:text-sm text-sand/80">
            <Clock className="h-4 w-4 shrink-0 text-gold" />
            <span>
              Mon–Fri {hours.mon_fri} · Sat–Sun {hours.sat_sun}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sand to-transparent" />
    </section>
    {showReservation && <ReservationModal onClose={() => setShowReservation(false)} />}
    </>
  );
}

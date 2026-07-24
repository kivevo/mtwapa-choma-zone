"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactButtons } from "@/components/contact-buttons";
import { ReservationModal } from "@/components/sections/reservation-modal";
import { resolveImageUrl } from "@/lib/utils";
import type { SiteSettings } from "@/types/database.types";

interface HeroProps {
  settings: SiteSettings;
}

const HERO_SLIDES = [
  {
    title_prefix: "Mtwapa's Best",
    title_highlight: "Nyama Choma",
    title_suffix: "Open Garden Hospitality",
    description: "Freshly roasted goat & beef, cold drinks, and open-air garden seating right on the Mombasa–Malindi Highway.",
    image: "/images/real/insta_real_4.jpg", // Real venue exterior — clean sky & signage
  },
  {
    title_prefix: "Sundays are for",
    title_highlight: "Family Fun",
    title_suffix: "At the Palms",
    description: "Bring the whole family for our Sunday Fun Day. Great choma for you, a safe fenced playground for the kids.",
    image: "/images/real/insta_real_5.jpg", // Real venue exterior — different angle
  },
  {
    title_prefix: "The Perfect",
    title_highlight: "Garden Escape",
    title_suffix: "Events & Meetups",
    description: "Lush makuti pavilions, secure parking, and live Rhumba nights. Your favourite spot on the North Coast.",
    image: "/images/real/insta_real_9.jpg", // Garden dining with real ambience
  }
];

function useIsOpen(hours: SiteSettings["opening_hours"]) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const day = now.getDay();
      const hhmm = now.getHours() * 100 + now.getMinutes();
      const isWeekend = day === 0 || day === 6;
      const rangeStr = isWeekend ? hours.sat_sun : hours.mon_fri;
      try {
        const [openStr, closeStr] = rangeStr.split(/\s*[-–]\s*/);
        const toNum = (s: string) => {
          const [h, m] = s.trim().split(":").map(Number);
          return h * 100 + (m || 0);
        };
        const open = toNum(openStr);
        const close = closeStr?.toLowerCase().includes("late") ? 2359 : toNum(closeStr);
        setIsOpen(hhmm >= open && hhmm <= close);
      } catch {
        setIsOpen(false);
      }
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [hours]);
  return isOpen;
}

export function Hero({ settings }: HeroProps) {
  const [showReservation, setShowReservation] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const hours = settings.opening_hours;
  const isOpen = useIsOpen(hours);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <>
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        {/* Animated Background Slider */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(28,26,23,0.55) 0%, rgba(28,26,23,0.75) 50%, rgba(28,26,23,0.95) 100%), url('${resolveImageUrl(slide.image)}')`,
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-sand/20 via-transparent to-charcoal/30 z-[1]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-36 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4 inline-flex items-center gap-2"
          >
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                isOpen
                  ? "border-green-500/30 bg-green-500/20 text-green-300"
                  : "border-red-400/20 bg-red-500/15 text-red-300"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${isOpen ? "animate-pulse bg-green-400" : "bg-red-400"}`}
              />
              {isOpen ? "Open Now" : "Currently Closed"}
            </span>
          </motion.div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold sm:mb-4 sm:text-sm sm:tracking-[0.25em]">
            {settings.tagline}
          </p>

          {/* Animated Text Content */}
          <div className="h-[280px] xs:h-[260px] sm:h-[280px] md:h-[240px] lg:h-[260px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-display text-3xl font-bold leading-tight text-sand xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  {slide.title_prefix}{" "}
                  <span className="text-ember">{slide.title_highlight}</span>
                  <br />
                  <span className="mt-1 block text-xl font-medium sm:mt-2 sm:text-3xl md:text-4xl lg:text-5xl text-sand/90">
                    {slide.title_suffix}
                  </span>
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-sand/90 sm:mt-8">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Button onClick={() => setShowReservation(true)} className="bg-ember hover:bg-ember/90 text-white font-semibold shadow-md px-8 py-6 text-base rounded-full sm:py-6">
                Book a Table
              </Button>
              <Button asChild variant="outline" className="text-sand border-sand/40 hover:bg-white/10 hover:text-white px-8 py-6 text-base rounded-full sm:py-6">
                <Link href="/#menu">View Menu</Link>
              </Button>
            </div>

            <div className="mt-6 flex justify-center sm:mt-8">
              <ContactButtons phone={settings.phone_primary} variant="dark" className="justify-center w-full xs:w-auto" />
            </div>

            {/* Pagination Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? "w-6 bg-ember" : "w-2 bg-sand/30 hover:bg-sand/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-8 inline-flex max-w-xl flex-col gap-3 rounded-2xl border border-white/10 bg-charcoal/70 px-4 py-3.5 backdrop-blur-md sm:mt-12 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-4 text-left"
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

        {/* Animated scroll-down arrow */}
        <motion.a
          href="/#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-sand/40 transition-colors hover:text-sand sm:bottom-20 z-20"
          aria-label="Scroll down"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.a>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sand to-transparent z-[1]" />
      </section>
      {showReservation && <ReservationModal onClose={() => setShowReservation(false)} />}
    </>
  );
}

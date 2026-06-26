"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, MessageCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, NAV_LINKS, WHATSAPP_URL } from "@/lib/utils";
import { formatPhoneDisplay, formatPhoneForTel } from "@/lib/utils";
import { ReservationModal } from "@/components/sections/reservation-modal";
import type { SiteSettings } from "@/types/database.types";

interface HeaderProps {
  settings: SiteSettings;
}

export function Header({ settings }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showReservation, setShowReservation] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-charcoal/95 shadow-lg backdrop-blur-md"
            : "bg-gradient-to-b from-charcoal/80 to-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/#home" className="group flex items-center gap-2">
            {settings.frontend_content?.logo_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.frontend_content.logo_image}
                alt={settings.frontend_content.logo_full_name || "Choma Zone"}
                className="h-10 w-auto max-w-[120px] object-contain"
              />
            ) : (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember font-display text-lg font-bold text-sand">
                  {settings.frontend_content?.logo_text || "CZ"}
                </span>
                <div className="hidden sm:block">
                  <p className="font-display text-sm font-bold leading-tight text-sand">
                    {settings.frontend_content?.logo_full_name || "Choma Zone"}
                  </p>
                  <p className="text-xs text-gold">
                    {settings.frontend_content?.logo_subtitle || "Mtwapa Palms"}
                  </p>
                </div>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-sand/80 transition-colors hover:bg-white/10 hover:text-sand"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={`tel:${formatPhoneForTel(settings.phone_primary)}`}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-sand/90 transition-colors hover:text-gold"
              aria-label="Call us"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">
                {formatPhoneDisplay(settings.phone_primary)}
              </span>
            </a>
            <Button onClick={() => setShowReservation(true)} size="sm" className="bg-ember hover:bg-ember/90 text-white gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden xl:inline">Book a Table</span>
            </Button>
            <Button asChild size="sm" variant="outline" className="text-charcoal border-white/20 bg-white hover:bg-white/90">
              <Link href="/#events">Plan Event</Link>
            </Button>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-sand transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "absolute inset-x-0 top-full overflow-hidden bg-charcoal/95 backdrop-blur-md transition-all duration-300 lg:hidden",
            isOpen ? "max-h-96 border-t border-white/10" : "max-h-0"
          )}
        >
          <nav className="flex flex-col px-4 pb-6 pt-2 sm:px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-base font-medium text-sand/90 transition-colors hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Button onClick={() => { setIsOpen(false); setShowReservation(true); }} className="w-full bg-ember hover:bg-ember/90 gap-2">
                <CalendarDays className="h-4 w-4" /> Book a Table
              </Button>
              <Button asChild variant="whatsapp" className="w-full justify-center">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {showReservation && <ReservationModal onClose={() => setShowReservation(false)} />}
    </>
  );
}

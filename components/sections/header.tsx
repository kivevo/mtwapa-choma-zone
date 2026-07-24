"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Phone, MessageCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, NAV_LINKS, generateWhatsAppUrl, resolveImageUrl } from "@/lib/utils";
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

  const pathname = usePathname();
  const isHome = pathname === "/";

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
          (scrolled || isOpen || !isHome)
            ? "bg-charcoal/95 shadow-lg backdrop-blur-md"
            : "bg-gradient-to-b from-charcoal/80 to-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/#home" className="group flex items-center gap-2">
            {settings.frontend_content?.logo_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(settings.frontend_content.logo_image)}
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

          {/* Mobile: phone icon + hamburger */}
          <div className="flex items-center gap-1 lg:hidden">
            <a
              href={`tel:${formatPhoneForTel(settings.phone_primary)}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sand transition-colors hover:bg-ember"
              aria-label="Call us"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sand transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — full dropdown */}
        <div
          className={cn(
            "absolute inset-x-0 top-full overflow-hidden bg-charcoal/98 backdrop-blur-md transition-all duration-300 lg:hidden",
            isOpen ? "max-h-[32rem] border-t border-white/10" : "max-h-0"
          )}
        >
          <nav className="flex flex-col px-4 pb-6 pt-3 sm:px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center border-b border-white/5 py-4 text-base font-medium text-sand/90 transition-colors hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                onClick={() => { setIsOpen(false); setShowReservation(true); }}
                className="w-full bg-ember hover:bg-ember/90 text-white gap-2 py-5 text-sm font-semibold"
              >
                <CalendarDays className="h-4 w-4" />
                Book Table
              </Button>
              <Button asChild variant="whatsapp" className="w-full justify-center py-5 text-sm font-semibold">
                <a href={generateWhatsAppUrl(settings.phone_primary)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
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

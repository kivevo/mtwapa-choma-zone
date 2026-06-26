import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
} from "@/components/icons/social-icons";
import { formatPhoneDisplay, formatPhoneForTel, WHATSAPP_URL } from "@/lib/utils";
import type { SiteSettings } from "@/types/database.types";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const hours = settings.opening_hours;

  return (
    <footer className="bg-charcoal text-sand">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ember font-display text-xl font-bold">
                {settings.frontend_content?.logo_text || "CZ"}
              </span>
              <div>
                <p className="font-display text-lg font-bold">{settings.frontend_content?.logo_full_name || "Choma Zone"}</p>
                <p className="text-sm text-gold">{settings.frontend_content?.logo_subtitle || "Mtwapa Palms"}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-sand/70">
              {settings.frontend_content?.footer_text || `${settings.tagline}. Best nyama choma on the North Coast — open garden dining, events, and sundowners on the Mombasa–Malindi Highway.`}
            </p>
            <p className="mt-3 text-xs text-gold/80">
              Stopover travelers welcome — coffee, ice cream, restrooms & secure
              parking.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-gold">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-sand/70">
              <li>
                <Link href="/#about" className="hover:text-sand">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-sand">
                  Full Menu
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-sand">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-sand">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/#location" className="hover:text-sand">
                  Location
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-gold">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-sand/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                <span>{settings.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${formatPhoneForTel(settings.phone_primary)}`}
                  className="flex items-center gap-2 hover:text-sand"
                >
                  <Phone className="h-4 w-4 text-ember" />
                  {formatPhoneDisplay(settings.phone_primary)}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${formatPhoneForTel(settings.phone_secondary)}`}
                  className="flex items-center gap-2 hover:text-sand"
                >
                  <Phone className="h-4 w-4 text-ember" />
                  {formatPhoneDisplay(settings.phone_secondary)}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 hover:text-sand"
                >
                  <Mail className="h-4 w-4 text-ember" />
                  {settings.email}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-sand"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-gold">
              Opening Hours
            </h3>
            <ul className="space-y-2 text-sm text-sand/70">
              <li>
                <span className="text-sand">Mon – Fri:</span>{" "}
                {hours.mon_fri ?? "10:00 - 23:00"}
              </li>
              <li>
                <span className="text-sand">Sat – Sun:</span>{" "}
                {hours.sat_sun ?? "08:00 - late"}
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-ember"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-ember"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href={settings.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-ember"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-sand/50">
          <p>
            © {new Date().getFullYear()} {settings.business_name}. All rights
            reserved.
          </p>
          <p className="mt-1">
            Opposite Galana Petrol Station, Mtwapa — Mombasa–Malindi Highway
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/icons/social-icons";
import type { SiteSettings } from "@/types/database.types";

interface SocialShowcaseSectionProps {
  settings: SiteSettings;
}

const posts = [
  {
    image: "/images/fb-profile.jpg",
    alt: "Choma Zone Mtwapa Palms official logo/sign",
    caption: "Welcome to Choma Zone! Open-air garden restaurant, bar & delicious nyama choma.",
    likes: "4.6k",
    handle: "@ChomaZoneMtwapaPalm",
  },
  {
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    alt: "Garden dining area",
    caption: "Sunset in the garden. Perfect spot to unwind after a long drive.",
    likes: "329",
    handle: "@mtwapapalms",
  },
  {
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
    alt: "Cold drinks at bar",
    caption: "Cold drinks & good tunes. Join us for happy hour daily from 4PM.",
    likes: "615",
    handle: "@mtwapapalms",
  },
  {
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    alt: "Open air grill",
    caption: "Weekend vibes loading! Fire is lit, meat is ready.",
    likes: "841",
    handle: "@mtwapapalms",
  },
  {
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80",
    alt: "Kids play area",
    caption: "Family Fun Sunday! Kids having fun in the playground while parents enjoy choma.",
    likes: "512",
    handle: "@mtwapapalms",
  },
  {
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    alt: "Coffee stopover",
    caption: "Quick coffee & snack break on the Mombasa–Malindi Highway.",
    likes: "294",
    handle: "@mtwapapalms",
  },
];

export function SocialShowcaseSection({ settings }: SocialShowcaseSectionProps) {
  const instagramUrl = settings.instagram_url || "https://www.instagram.com/mtwapapalms";
  const facebookUrl = settings.facebook_url || "https://www.facebook.com/ChomaZoneMtwapaPalm";
  const tiktokUrl = settings.tiktok_url || "https://www.tiktok.com/@chomazonemtwapa";

  return (
    <AnimatedSection className="bg-charcoal py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 inline-block rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ember">
            Connect With Us
          </p>
          <h2 className="font-display text-3xl font-bold text-sand sm:text-4xl lg:text-5xl">
            Follow Us on Social Media
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sand/70 text-base">
            Check out our latest photos, upcoming weekend events, and real moments from Choma Zone Mtwapa Palms.
          </p>
          {/* Social handles */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-sand transition-all hover:border-ember hover:bg-ember hover:text-white"
            >
              <InstagramIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              Instagram
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-sand transition-all hover:border-[#1877f2] hover:bg-[#1877f2] hover:text-white"
            >
              <FacebookIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              Facebook
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-sand transition-all hover:border-white hover:bg-white hover:text-charcoal"
            >
              <TikTokIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              TikTok
            </a>
          </div>
        </div>

        {/* Real Photo Social Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post, i) => (
            <a
              key={i}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-charcoal/50 border border-white/10"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              
              {/* Permanent subtle gradient for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Instagram icon badge */}
              <div className="absolute right-2.5 top-2.5 z-10 rounded-full bg-black/60 p-1.5 backdrop-blur-md border border-white/20 text-white">
                <InstagramIcon className="h-3.5 w-3.5" />
              </div>

              {/* Hover overlay content */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-3 text-left">
                <p className="text-xs font-semibold text-gold mb-0.5">{post.handle}</p>
                <p className="text-xs font-normal leading-snug text-white line-clamp-2 drop-shadow">
                  {post.caption}
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-sand/80 flex items-center gap-1">
                  <span>❤️</span> {post.likes} likes
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-ember bg-ember/10 px-8 py-3 text-sm font-semibold text-sand transition-all hover:bg-ember hover:text-white"
          >
            <InstagramIcon className="h-4 w-4 text-ember group-hover:text-white" />
            Follow @mtwapapalms on Instagram
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}

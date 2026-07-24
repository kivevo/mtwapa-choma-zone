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
    image: "/images/real/insta_real_4.jpg",
    alt: "Choma Zone Mtwapa Palms exterior with I Love Mtwapa sign",
    caption: "Our iconic spot on the Mombasa–Malindi Highway. Swing by — you can't miss us! 📍",
    likes: "847",
    handle: "@mtwapapalms",
  },
  {
    image: "/images/real/insta_real_2.jpg",
    alt: "Nyama choma with Tusker beers in garden setting at night",
    caption: "Maskani with a cold drink 🍺 Great choma. Great friends. Great evenings. That's the vibe!",
    likes: "1.2k",
    handle: "@mtwapapalms",
  },
  {
    image: "/images/real/insta_real_7.jpg",
    alt: "Family weekend at Choma Zone with kids playground and choma",
    caption: "The perfect weekend family vibes 🧡 Food. Fun. Family. Memories that last!",
    likes: "963",
    handle: "@mtwapapalms",
  },
  {
    image: "/images/real/insta_real_8.jpg",
    alt: "Friends dining at Choma Zone garden ambience",
    caption: "The ambience & the hideout 💛 Perfect for couples, girlies & meetups. Come for the food, stay for the experience!",
    likes: "745",
    handle: "@mtwapapalms",
  },
  {
    image: "/images/real/insta_real_6.jpg",
    alt: "Choma Zone garden photoshoot location pool table and greenery",
    caption: "Your perfect photoshoot location 📸 Beautiful spaces. Stylish ambience. Natural backdrops. Every shot, every angle — unforgettable!",
    likes: "612",
    handle: "@mtwapapalms",
  },
  {
    image: "/images/real/fb_real_0.jpg",
    alt: "Choma Zone Mtwapa Palms official banner with nyama choma on grill",
    caption: "An open garden restaurant, bar & choma zone. Experience open-garden hospitality as you enjoy delicious meals 🔥",
    likes: "4.6k",
    handle: "@ChomaZoneMtwapaPalm",
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
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
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
        <div className="mt-8 text-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-ember bg-ember/10 px-8 py-4 text-sm font-semibold text-sand transition-all hover:bg-ember hover:text-white sm:w-auto sm:py-3"
          >
            <InstagramIcon className="h-4 w-4 text-ember group-hover:text-white" />
            Follow @mtwapapalms on Instagram
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}

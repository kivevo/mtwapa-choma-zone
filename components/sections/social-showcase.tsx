"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/icons/social-icons";
import type { SiteSettings } from "@/types/database.types";

interface SocialShowcaseSectionProps {
  settings: SiteSettings;
}

const posts = [
  {
    emoji: "🔥",
    caption: "Nyama Choma perfection every single time. 🔥 Come through!",
    likes: "1.2K",
    bg: "from-orange-400 to-red-500",
  },
  {
    emoji: "🌴",
    caption: "Sundowners in the garden 🌴 What a vibe! Every Friday from 5PM.",
    likes: "892",
    bg: "from-emerald-400 to-teal-600",
  },
  {
    emoji: "🎉",
    caption: "Events done right! Book your next celebration with us. 🎊",
    likes: "2.1K",
    bg: "from-purple-400 to-pink-500",
  },
  {
    emoji: "🍖",
    caption: "That slow-roasted coastal flavour. Goat choma on the grill! 🍖",
    likes: "3.4K",
    bg: "from-yellow-400 to-orange-500",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    caption: "Family Fun Day every Sunday! Kids love it here 💛 Come make memories.",
    likes: "1.7K",
    bg: "from-sky-400 to-blue-600",
  },
  {
    emoji: "🌅",
    caption: "Golden hour at Choma Zone. The best view on the highway 🌅✨",
    likes: "4.1K",
    bg: "from-amber-300 to-rose-400",
  },
];

export function SocialShowcaseSection({ settings }: SocialShowcaseSectionProps) {
  const instagramUrl = settings.instagram_url || "https://www.instagram.com";
  const facebookUrl = settings.facebook_url || "https://www.facebook.com";
  const tiktokUrl = settings.tiktok_url || "https://www.tiktok.com";

  return (
    <AnimatedSection className="bg-charcoal py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 inline-block rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-ember">
            Follow the Vibe
          </p>
          <h2 className="font-display text-3xl font-bold text-sand sm:text-4xl lg:text-5xl">
            We&apos;re on Social Media
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sand/60">
            Join thousands of food lovers following us for daily specials, events, and behind-the-scenes action at Choma Zone.
          </p>
          {/* Social handles */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-sand transition-all hover:border-ember hover:bg-ember hover:text-white"
            >
              <InstagramIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              Instagram
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-sand transition-all hover:border-[#1877f2] hover:bg-[#1877f2] hover:text-white"
            >
              <FacebookIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              Facebook
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-sand transition-all hover:border-white hover:bg-white hover:text-charcoal"
            >
              <TikTokIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              TikTok
            </a>
          </div>
        </div>

        {/* Mock Instagram Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post, i) => (
            <a
              key={i}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${post.bg} opacity-90 transition-opacity group-hover:opacity-100`}
              />
              {/* Emoji centered */}
              <div className="absolute inset-0 flex items-center justify-center text-5xl drop-shadow-lg transition-transform group-hover:scale-110">
                {post.emoji}
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <p className="text-xs font-medium leading-snug text-white line-clamp-2">
                  {post.caption}
                </p>
                <p className="mt-1 text-xs text-white/70">❤️ {post.likes} likes</p>
              </div>
              {/* Instagram icon badge */}
              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-full bg-black/50 p-1.5 backdrop-blur-sm">
                  <InstagramIcon className="h-3 w-3 text-white" />
                </div>
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
            className="inline-flex items-center gap-2.5 rounded-full border border-ember bg-transparent px-8 py-3 font-semibold text-ember transition-all hover:bg-ember hover:text-white"
          >
            <InstagramIcon className="h-5 w-5" />
            Follow @chomazonemtwapa
          </a>
          <p className="mt-3 text-xs text-sand/40">
            Tag us in your visit with <span className="text-ember">#ChomaZoneMtwapa</span>
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}

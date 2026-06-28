"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { InstagramIcon } from "@/components/icons/social-icons";
import { GalleryImage } from "@/components/gallery-image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import type { GalleryCategoryRow, GalleryImage as GalleryImageType, SiteSettings } from "@/types/database.types";

interface GallerySectionProps {
  images: GalleryImageType[];
  categories: GalleryCategoryRow[];
  supabaseUrl?: string;
  settings: SiteSettings;
  preview?: boolean;
}

export function GallerySection({
  images,
  categories,
  supabaseUrl,
  settings,
  preview = false,
}: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filterCategories = [{ slug: "all", name: "All" }, ...categories];

  const filtered =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const displayImages = preview ? filtered.slice(0, 6) : filtered;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (lightboxIndex === null) return;
      const next =
        (lightboxIndex + dir + displayImages.length) % displayImages.length;
      setLightboxIndex(next);
    },
    [lightboxIndex, displayImages.length]
  );

  return (
    <AnimatedSection id="gallery" className="bg-sand py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Step Into Our Garden"
          description="Golden-hour makuti pavilions, sizzling choma, kids at play, and the iconic I ❤️ MTWAPA sign — see why Mtwapa loves us."
        />

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {filterCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.slug
                  ? "bg-ember text-sand shadow-ember"
                  : "bg-white text-charcoal/70 hover:bg-palm/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {activeCategory === "signage" && (
          <div className="mb-8 rounded-2xl border-2 border-dashed border-gold/40 bg-gold/5 p-6 text-center">
            <p className="font-display text-xl font-bold text-charcoal">
              Find our iconic I ❤️ MTWAPA sign!
            </p>
            <p className="mt-2 text-charcoal/70">
              Snap a photo and tag us on Instagram — we love reposting our
              guests.
            </p>
            <Button asChild variant="secondary" className="mt-4">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="h-4 w-4" />
                @mtwapapalms
              </a>
            </Button>
          </div>
        )}

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {displayImages.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="group relative mb-4 block w-full overflow-hidden rounded-2xl break-inside-avoid focus:outline-none focus:ring-2 focus:ring-ember"
            >
              <div className="relative aspect-[4/3] w-full">
                <GalleryImage
                  src={img.storage_path}
                  alt={img.caption ?? "Choma Zone Mtwapa Palms"}
                  supabaseUrl={supabaseUrl}
                  className="transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-left text-sm text-sand">{img.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {preview && (
          <div className="mt-10 text-center">
            <Button asChild variant="secondary">
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-palm p-8 text-center">
          <p className="font-display text-xl font-semibold text-sand">
            Follow Our Story
          </p>
          <p className="mt-2 text-sand/70">
            Real moments from the garden, grill, and dance floor.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" className="border-sand/30 text-sand hover:bg-sand/10">
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </Button>
            <Button asChild variant="outline" className="border-sand/30 text-sand hover:bg-sand/10">
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </Button>
            <Button asChild variant="outline" className="border-sand/30 text-sand hover:bg-sand/10">
              <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && displayImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 p-4"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-sand"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-sand"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              className="absolute right-4 top-16 z-10 rounded-full bg-white/10 p-2 text-sand md:right-16 md:top-1/2 md:-translate-y-1/2"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[85vh] max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full min-w-[300px] sm:min-w-[600px]">
                <GalleryImage
                  src={displayImages[lightboxIndex].storage_path}
                  alt={
                    displayImages[lightboxIndex].caption ??
                    "Gallery image"
                  }
                  supabaseUrl={supabaseUrl}
                />
              </div>
              {displayImages[lightboxIndex].caption && (
                <p className="bg-charcoal p-4 text-center text-sand">
                  {displayImages[lightboxIndex].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedSection>
  );
}

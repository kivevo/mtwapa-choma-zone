"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Film } from "lucide-react";
import type { GalleryImage } from "@/types/database.types";

interface VideoShowcaseProps {
  videos: GalleryImage[];
  supabaseUrl?: string;
}

function getVideoUrl(path: string, supabaseUrl?: string) {
  if (path.startsWith("http")) return path;
  return `${supabaseUrl}/storage/v1/object/public/gallery/${path}`;
}

export function VideoShowcase({ videos, supabaseUrl }: VideoShowcaseProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => {
    if (videoRef.current) videoRef.current.pause();
    setLightboxIndex(null);
  };

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (lightboxIndex === null) return;
      if (videoRef.current) videoRef.current.pause();
      setLightboxIndex((lightboxIndex + dir + videos.length) % videos.length);
    },
    [lightboxIndex, videos.length]
  );

  if (videos.length === 0) return null;

  const activeVideo = lightboxIndex !== null ? videos[lightboxIndex] : null;

  return (
    <section className="bg-charcoal py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-1.5 text-sm font-medium text-ember mb-4">
            <Film className="h-4 w-4" />
            Videos
          </div>
          <h2 className="font-display text-3xl font-bold text-sand sm:text-4xl">
            See It Come Alive
          </h2>
          <p className="mt-3 text-sand/60 max-w-xl mx-auto text-sm sm:text-base">
            The sizzle of the grill, the laughter of guests, the glow of golden hour — watch the Choma Zone experience.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => {
            const url = getVideoUrl(video.storage_path, supabaseUrl);
            return (
              <motion.button
                key={video.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => openLightbox(index)}
                className="group relative overflow-hidden rounded-2xl bg-charcoal/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-ember text-left"
              >
                {/* Video thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <video
                    src={url}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  {/* Cinematic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-ember group-hover:bg-ember/20">
                      <Play className="h-6 w-6 fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  {/* Duration badge placeholder */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
                    <Film className="h-3 w-3 text-ember" />
                    <span className="text-[10px] font-medium text-white">Video</span>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-4">
                  <p className="font-medium text-sand truncate">
                    {video.caption || "Choma Zone Video"}
                  </p>
                  {video.description && (
                    <p className="mt-1 text-sm text-sand/50 line-clamp-2">{video.description}</p>
                  )}
                </div>

                {/* Ember glow on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ring-1 ring-ember/40" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-sand hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Prev */}
            {videos.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-sand hover:bg-white/20 transition-colors md:left-8"
                aria-label="Previous video"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Video player */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={videoRef}
                key={activeVideo.id}
                src={getVideoUrl(activeVideo.storage_path, supabaseUrl)}
                controls
                autoPlay
                className="w-full rounded-2xl shadow-2xl"
                style={{ maxHeight: "75vh" }}
              />
              {(activeVideo.caption || activeVideo.description) && (
                <div className="mt-4 text-center">
                  {activeVideo.caption && (
                    <p className="font-semibold text-sand text-lg">{activeVideo.caption}</p>
                  )}
                  {activeVideo.description && (
                    <p className="mt-1 text-sand/60 text-sm max-w-xl mx-auto">{activeVideo.description}</p>
                  )}
                </div>
              )}
              {videos.length > 1 && (
                <p className="mt-3 text-center text-xs text-sand/40">
                  {lightboxIndex + 1} of {videos.length}
                </p>
              )}
            </motion.div>

            {/* Next */}
            {videos.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-sand hover:bg-white/20 transition-colors md:right-8"
                aria-label="Next video"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

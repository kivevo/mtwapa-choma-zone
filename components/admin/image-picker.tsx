"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { X, Search, Check, Upload } from "lucide-react";

interface ImagePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  supabaseUrl: string;
  images: Array<Record<string, unknown>>;
  mediaType?: "image" | "video" | "all";
}

export function ImagePicker({ open, onClose, onSelect, supabaseUrl, images, mediaType = "image" }: ImagePickerProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const getUrl = useCallback((storagePath: string) => {
    if (storagePath.startsWith("http")) return storagePath;
    return `${supabaseUrl}/storage/v1/object/public/gallery/${storagePath}`;
  }, [supabaseUrl]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Close when clicking OUTSIDE the modal — but let the click pass through to whatever was clicked
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
        // We do NOT call stopPropagation — the click reaches the sidebar/nav underneath
      }
    };
    const timer = setTimeout(() => window.addEventListener("mousedown", handler), 100);
    return () => { clearTimeout(timer); window.removeEventListener("mousedown", handler); };
  }, [open, onClose]);

  const filtered = images.filter((img) => {
    const caption = String(img.caption ?? "").toLowerCase();
    const path = String(img.storage_path ?? "").toLowerCase();
    const type = String(img.media_type ?? "image");
    
    const matchesSearch = caption.includes(search.toLowerCase()) || path.includes(search.toLowerCase());
    const matchesType = mediaType === "all" || type === mediaType;

    return matchesSearch && matchesType;
  });

  if (!open) return null;

  return (
    // pointer-events-none on the wrapper so clicks pass through to elements behind (sidebar nav, etc.)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      {/* Modal itself has pointer-events-auto */}
      <div
        ref={modalRef}
        className="relative z-10 flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl max-h-[85vh] pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Select {mediaType === "video" ? "Video" : "Image"}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{filtered.length} {mediaType === "video" ? "videos" : "images"} in your media library</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by caption or filename..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Upload className="h-12 w-12 text-gray-300 mb-3" />
              <p className="font-medium text-gray-500">No {mediaType === "video" ? "videos" : "images"} found</p>
              <p className="text-sm text-gray-400 mt-1">Upload {mediaType === "video" ? "videos" : "images"} in the Gallery tab first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((img) => {
                const url = getUrl(String(img.storage_path));
                const isSelected = selected === url;
                return (
                  <button key={String(img.id)} onClick={() => setSelected(isSelected ? null : url)}
                    className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${isSelected ? "border-orange-500 ring-2 ring-orange-200" : "border-gray-200 hover:border-orange-300"}`}>
                    {/* Media element */}
                    {mediaType === "video" || String(img.media_type) === "video" ? (
                      <video 
                        src={url} 
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img src={url} alt={String(img.caption ?? "")}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3ENo preview%3C/text%3E%3C/svg%3E"; }} 
                      />
                    )}
                    
                    {isSelected && (
                      <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                        <div className="rounded-full bg-orange-500 p-1"><Check className="h-4 w-4 text-white" /></div>
                      </div>
                    )}
                    {String(img.caption ?? "") && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs text-white truncate">{String(img.caption)}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-sm text-gray-500">{selected ? `1 ${mediaType === "video" ? "video" : "image"} selected` : `No ${mediaType === "video" ? "video" : "image"} selected`}</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={() => { if (selected) { onSelect(selected); onClose(); setSelected(null); } }} disabled={!selected}
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-40 transition-colors">
              Use This {mediaType === "video" ? "Video" : "Image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

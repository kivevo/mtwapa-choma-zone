"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye, EyeOff, Trash2, Upload, FolderPlus, X, Film, ImageIcon, Tag,
} from "lucide-react";
import {
  createGalleryImage, deleteGalleryImage,
  toggleGalleryImageVisibility, createGalleryCategory, deleteGalleryCategory,
} from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import { useConfirmDialog } from "@/components/admin/confirm-dialog";

interface GalleryTabProps {
  galleryImages: Array<Record<string, unknown>>;
  galleryCategories: Array<Record<string, unknown>>;
  supabaseUrl?: string;
}

const BUCKET = "gallery";

export function GalleryTab({ galleryImages, galleryCategories, supabaseUrl }: GalleryTabProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { confirm, dialog } = useConfirmDialog();

  const [filterCat, setFilterCat] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState(galleryCategories[0] ? String(galleryCategories[0].slug) : "");
  const fileRef = useRef<HTMLInputElement>(null);

  // Category manager state
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const getUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabaseUrl) return;

    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File too large. Max ${isVideo ? "50MB for videos" : "10MB for images"}.`);
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${newCategory}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
    if (uploadError) { toast.error(uploadError.message); setUploading(false); return; }

    const res = await createGalleryImage({
      category: newCategory,
      storage_path: path,
      caption: newCaption || file.name.replace(/\.[^.]+$/, ""),
      display_order: galleryImages.length + 1,
      // @ts-expect-error extra field
      media_type: isVideo ? "video" : "image",
    });

    setUploading(false);
    if (res.success) {
      toast.success(`${isVideo ? "Video" : "Image"} uploaded!`);
      setNewCaption("");
      if (fileRef.current) fileRef.current.value = "";
      startTransition(() => router.refresh());
    } else {
      toast.error(res.error);
    }
  };

  const handleDelete = (img: Record<string, unknown>) => {
    confirm({
      title: "Move to Recycle Bin?",
      message: `"${String(img.caption || img.storage_path)}" will be moved to the Recycle Bin. You can restore it within 30 days.`,
      confirmLabel: "Move to Bin",
      danger: true,
      onConfirm: async () => {
        const res = await deleteGalleryImage(String(img.id));
        if (res.success) {
          toast.success("Moved to Recycle Bin.");
          startTransition(() => router.refresh());
        } else {
          toast.error(res.error);
        }
      },
    });
  };

  const handleToggleVisibility = async (img: Record<string, unknown>) => {
    const res = await toggleGalleryImageVisibility(String(img.id), !img.is_visible);
    if (res.success) {
      toast.success(img.is_visible ? "Hidden from public gallery." : "Visible on public gallery.");
      startTransition(() => router.refresh());
    } else {
      toast.error(res.error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const slug = newCatName.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    const res = await createGalleryCategory({ name: newCatName.trim(), slug, display_order: galleryCategories.length + 1 });
    if (res.success) {
      toast.success(`Category "${newCatName}" created!`);
      setNewCatName("");
      startTransition(() => router.refresh());
    } else {
      toast.error(res.error);
    }
  };

  const handleDeleteCategory = (cat: Record<string, unknown>) => {
    confirm({
      title: `Remove Category "${cat.name}"?`,
      message: "This removes the category. Images already in this category will remain but become uncategorized. This can be reversed from the Recycle Bin.",
      confirmLabel: "Remove Category",
      danger: true,
      onConfirm: async () => {
        const res = await deleteGalleryCategory(String(cat.id));
        if (res.success) {
          toast.success("Category removed.");
          startTransition(() => router.refresh());
        } else {
          toast.error(res.error);
        }
      },
    });
  };

  const filtered = filterCat === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === filterCat);

  return (
    <>
      {dialog}

      <div className="space-y-6">
        {/* Upload Panel */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">Upload Media</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {galleryCategories.map((cat) => (
                  <option key={String(cat.id)} value={String(cat.slug)}>{String(cat.name)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Caption (optional)</label>
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="e.g. Sunset BBQ Evening"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="mb-1 block text-xs font-medium text-gray-500">Image or Video (max 50MB)</label>
              <div className="flex gap-2">
                <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm" onChange={handleUpload} className="hidden" />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading || !newCategory}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploading ? "Uploading…" : "Choose File"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Manager */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Manage Categories</h3>
            <button
              onClick={() => setShowCatManager(!showCatManager)}
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
            >
              <Tag className="h-3.5 w-3.5" /> {showCatManager ? "Close" : "Edit Categories"}
            </button>
          </div>

          {showCatManager && (
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="New category name, e.g. VIP Lounge"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={!newCatName.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  <FolderPlus className="h-4 w-4" /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {galleryCategories.map((cat) => {
                  const count = galleryImages.filter((i) => i.category === cat.slug).length;
                  return (
                    <div key={String(cat.id)} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm">
                      <span className="font-medium text-gray-700">{String(cat.name)}</span>
                      <span className="text-xs text-gray-400">({count})</span>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="rounded-full p-0.5 text-gray-400 hover:bg-red-100 hover:text-red-600"
                        title="Remove category"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCat("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filterCat === "all" ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            All ({galleryImages.length})
          </button>
          {galleryCategories.map((cat) => {
            const count = galleryImages.filter((i) => i.category === cat.slug).length;
            return (
              <button
                key={String(cat.id)}
                onClick={() => setFilterCat(String(cat.slug))}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filterCat === cat.slug ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                {String(cat.name)} ({count})
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-gray-400">No media in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((img) => {
              const url = getUrl(String(img.storage_path));
              const isVideo = String(img.media_type || "image") === "video";
              const isVisible = Boolean(img.is_visible);

              return (
                <div key={String(img.id)} className="group relative overflow-hidden rounded-xl border bg-gray-100 shadow-sm">
                  {/* Media preview */}
                  <div className="relative aspect-square">
                    {isVideo ? (
                      <video src={url} className="h-full w-full object-cover" muted playsInline />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt={String(img.caption || "")} className="h-full w-full object-cover" loading="lazy" />
                    )}
                    {!isVisible && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <EyeOff className="h-6 w-6 text-white/80" />
                      </div>
                    )}
                    {isVideo && (
                      <div className="absolute bottom-2 left-2 rounded-full bg-black/60 p-1">
                        <Film className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Overlay actions */}
                  <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Top badges */}
                    <div className="flex justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isVisible ? "bg-green-500 text-white" : "bg-gray-600 text-white"}`}>
                        {isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    {/* Bottom action buttons */}
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => handleToggleVisibility(img)}
                        className="flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-white shadow"
                        title={isVisible ? "Hide" : "Show"}
                      >
                        {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={() => handleDelete(img)}
                        className="flex items-center gap-1 rounded-lg bg-red-500/90 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 shadow"
                        title="Move to Recycle Bin"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-2">
                    <p className="truncate text-xs text-gray-600">{String(img.caption || img.storage_path)}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400 capitalize">{String(img.category)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

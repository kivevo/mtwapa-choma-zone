"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X, Upload, Image as ImageIcon, Loader2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { createGalleryImage, updateGalleryImage, deleteGalleryImage, toggleGalleryImageVisibility } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import { ImagePicker } from "@/components/admin/image-picker";

const GALLERY_CATEGORIES = [
  "garden", "food_choma", "kids_playground", "choma_area",
  "coffee_shop", "parking", "signage", "bar_area", "events",
] as const;

const ALL_CATEGORIES = [...GALLERY_CATEGORIES, "website_assets"] as const;

const emptyForm = { category: "garden" as string, caption: "", display_order: 0 };

function getImageUrl(storagePath: string, supabaseUrl?: string): string {
  if (storagePath.startsWith("http")) return storagePath;
  if (supabaseUrl) return `${supabaseUrl}/storage/v1/object/public/gallery/${storagePath}`;
  return storagePath;
}

export function GalleryTab({
  galleryImages,
  supabaseUrl,
}: {
  galleryImages: Array<Record<string, unknown>>;
  supabaseUrl?: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [dragOver, setDragOver] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // For replacing the image when editing
  const replaceFileRef = useRef<HTMLInputElement>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacePreview, setReplacePreview] = useState<string | null>(null);
  const [replacing, setReplacing] = useState(false);
  const [showLibraryPicker, setShowLibraryPicker] = useState(false);
  const [libraryPickerTarget, setLibraryPickerTarget] = useState<"add" | "replace">("add");

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, WebP, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5 MB.");
      return;
    }
    setSelectedFile(file);
    setPreviewFile(URL.createObjectURL(file));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleUploadAndSave = async () => {
    if (!selectedFile) { toast.error("Please select an image file"); return; }
    if (!supabaseUrl) { toast.error("Supabase not configured — run the migration first"); return; }

    setUploading(true);
    const supabase = createClient();

    // Build a unique storage path
    const ext = selectedFile.name.split(".").pop() ?? "jpg";
    const uniqueName = `${form.category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(uniqueName, selectedFile, { upsert: false });

    if (uploadError) {
      setUploading(false);
      toast.error(`Upload failed: ${uploadError.message}`);
      return;
    }

    const result = await createGalleryImage({
      category: form.category,
      storage_path: uniqueName,
      caption: form.caption,
      display_order: form.display_order,
    });

    setUploading(false);
    if (result.success) {
      toast.success("Image uploaded & saved!");
      setShowAdd(false);
      setSelectedFile(null);
      setPreviewFile(null);
      setForm({ ...emptyForm });
      router.refresh();
    } else {
      // Cleanup orphaned storage file
      await supabase.storage.from("gallery").remove([uniqueName]);
      toast.error(result.error ?? "Failed to save record");
    }
  };

  const handleUpdateMeta = async () => {
    if (!editItem) return;
    setSaving(true);
    const result = await updateGalleryImage(String(editItem.id), {
      category: form.category,
      caption: form.caption,
      display_order: form.display_order,
    });
    setSaving(false);
    if (result.success) {
      toast.success("Image updated");
      setEditItem(null);
      setForm({ ...emptyForm });
      setReplaceFile(null);
      setReplacePreview(null);
      router.refresh();
    } else toast.error(result.error);
  };

  const handleReplaceFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large. Max 5 MB."); return; }
    setReplaceFile(file);
    setReplacePreview(URL.createObjectURL(file));
  };

  const handleReplaceImage = async () => {
    if (!editItem || !replaceFile || !supabaseUrl) return;
    setReplacing(true);
    const supabase = createClient();
    const ext = replaceFile.name.split(".").pop() ?? "jpg";
    const newPath = `${form.category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const oldPath = String(editItem.storage_path);

    const { error: uploadError } = await supabase.storage.from("gallery").upload(newPath, replaceFile, { upsert: false });
    if (uploadError) { setReplacing(false); toast.error(`Upload failed: ${uploadError.message}`); return; }

    const result = await updateGalleryImage(String(editItem.id), {
      storage_path: newPath,
      category: form.category,
      caption: form.caption,
      display_order: form.display_order,
    });

    if (result.success) {
      // Delete old file from storage (best effort)
      if (!oldPath.startsWith("http")) await supabase.storage.from("gallery").remove([oldPath]);
      toast.success("Image replaced!");
      setEditItem(null);
      setForm({ ...emptyForm });
      setReplaceFile(null);
      setReplacePreview(null);
      router.refresh();
    } else {
      await supabase.storage.from("gallery").remove([newPath]);
      toast.error(result.error ?? "Failed to update record");
    }
    setReplacing(false);
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm("Remove this image? This cannot be undone.")) return;
    const supabase = createClient();
    // Delete from storage (best effort)
    if (!storagePath.startsWith("http") && supabaseUrl) {
      await supabase.storage.from("gallery").remove([storagePath]);
    }
    const result = await deleteGalleryImage(id);
    if (result.success) { toast.success("Image deleted"); router.refresh(); }
    else toast.error(result.error);
  };

  const filtered = filterCat === "all"
    ? galleryImages
    : galleryImages.filter((g) => String(g.category) === filterCat);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Filter:</label>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All ({galleryImages.length})</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, " ")} ({galleryImages.filter((g) => String(g.category) === c).length})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditItem(null); setForm({ ...emptyForm }); setPreviewFile(null); setSelectedFile(null); }}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Upload className="h-4 w-4" /> Upload New Image
        </button>
      </div>

      {/* Upload Form */}
      {showAdd && !editItem && (
        <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Upload New Image</h3>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all ${
              dragOver ? "border-orange-400 bg-orange-100" : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
            />
            {previewFile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewFile} alt="Preview" className="max-h-48 max-w-full rounded-lg object-contain shadow" />
            ) : (
              <>
                <div className="rounded-full bg-orange-100 p-4">
                  <ImageIcon className="h-8 w-8 text-orange-400" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-700">Click or drag & drop an image here</p>
                  <p className="mt-1 text-sm text-gray-400">JPG, PNG, WebP — Max 5 MB</p>
                </div>
              </>
            )}
          </div>

          {previewFile && (
            <button
              onClick={(e) => { e.stopPropagation(); setPreviewFile(null); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="text-xs text-red-500 hover:underline"
            >
              ✕ Remove selected file
            </button>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                ))}
                <option value="website_assets">website assets (hidden from gallery)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Caption / Description <span className="text-gray-400 font-normal normal-case">(what this image shows)</span>
            </label>
            <input
              placeholder="e.g. The lush garden seating area at dusk"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUploadAndSave}
              disabled={uploading || !selectedFile}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><Check className="h-4 w-4" /> Upload & Save</>}
            </button>
            <button
              onClick={() => { setShowAdd(false); setPreviewFile(null); setSelectedFile(null); setForm({ ...emptyForm }); }}
              className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-white transition-colors"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* ImagePicker modal for library selection */}
      <ImagePicker
        open={showLibraryPicker}
        onClose={() => setShowLibraryPicker(false)}
        onSelect={(url) => {
          if (libraryPickerTarget === "replace" && editItem) {
            // Directly update the storage_path via updateGalleryImage with the URL
            updateGalleryImage(String(editItem.id), { storage_path: url, category: form.category, caption: form.caption, display_order: form.display_order })
              .then((r) => { if (r.success) { toast.success("Image replaced from library!"); setEditItem(null); setForm({ ...emptyForm }); router.refresh(); } else toast.error(r.error); });
          }
        }}
        supabaseUrl={supabaseUrl ?? ""}
        images={galleryImages}
      />

      {/* Edit metadata form */}
      {editItem && (
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Edit Image</h3>

          {/* Current image + replace options */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Current Image</p>
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={replacePreview || getImageUrl(String(editItem.storage_path), supabaseUrl)}
                alt="current"
                className="h-24 w-24 rounded-xl object-cover border-2 border-white shadow"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-500">Replace this image:</p>
                <input
                  ref={replaceFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleReplaceFileSelect(f); }}
                />
                <button type="button" onClick={() => replaceFileRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Upload className="h-3.5 w-3.5" /> Upload new file
                </button>
                <button type="button"
                  onClick={() => { setLibraryPickerTarget("replace"); setShowLibraryPicker(true); }}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <ImageIcon className="h-3.5 w-3.5" /> Pick from library
                </button>
                {replaceFile && (
                  <button onClick={handleReplaceImage} disabled={replacing}
                    className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors">
                    {replacing ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Replacing…</> : <><RefreshCw className="h-3.5 w-3.5" /> Confirm Replace</>}
                  </button>
                )}
              </div>
            </div>
            {replacePreview && (
              <button onClick={() => { setReplaceFile(null); setReplacePreview(null); if (replaceFileRef.current) replaceFileRef.current.value = ""; }}
                className="mt-1 text-xs text-red-500 hover:underline">✕ Cancel replacement</button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
                <option value="website_assets">website assets (hidden from gallery)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Display Order</label>
              <input type="number" value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Caption / Description</label>
            <input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleUpdateMeta} disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Check className="h-4 w-4" /> Save Details</>}
            </button>
            <button onClick={() => { setEditItem(null); setForm({ ...emptyForm }); setReplaceFile(null); setReplacePreview(null); }}
              className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-white transition-colors">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((img) => {
          const url = getImageUrl(String(img.storage_path), supabaseUrl);
          const isWebsiteAsset = String(img.category) === "website_assets";
          return (
            <div
              key={String(img.id)}
              className="group relative rounded-2xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              {/* Image preview */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={String(img.caption ?? "")}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {isWebsiteAsset && (
                  <div className="absolute top-2 right-2 rounded-full bg-purple-600 px-2 py-0.5 text-xs font-medium text-white">
                    Asset
                  </div>
                )}
                {/* Visibility badge */}
                {!isWebsiteAsset && (
                  <div className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    img.is_visible === false ? "bg-gray-700/80 text-gray-200" : "bg-green-600/80 text-white"
                  }`}>
                    {img.is_visible === false ? "Hidden" : "Visible"}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 capitalize">
                      {String(img.category).replace(/_/g, " ")}
                    </span>
                    <p className="mt-1 text-sm font-medium text-gray-800 truncate">
                      {String(img.caption || "No caption")}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{String(img.storage_path)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!isWebsiteAsset && (
                      <button
                        onClick={async () => {
                          const newVal = img.is_visible === false ? true : false;
                          const result = await toggleGalleryImageVisibility(String(img.id), newVal);
                          if (result.success) {
                            toast.success(newVal ? "Image is now visible on website" : "Image hidden from website");
                            router.refresh();
                          } else toast.error(result.error);
                        }}
                        className={`rounded-lg p-1.5 transition-colors ${
                          img.is_visible === false
                            ? "hover:bg-green-100 text-gray-400"
                            : "hover:bg-gray-100 text-green-600"
                        }`}
                        title={img.is_visible === false ? "Show on website" : "Hide from website"}
                      >
                        {img.is_visible === false
                          ? <EyeOff className="h-3.5 w-3.5" />
                          : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditItem(img);
                        setShowAdd(false);
                        setForm({
                          category: String(img.category),
                          caption: String(img.caption ?? ""),
                          display_order: Number(img.display_order),
                        });
                      }}
                      className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                      title="Edit details"
                    >
                      <Pencil className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(String(img.id), String(img.storage_path))}
                      className="rounded-lg p-1.5 hover:bg-red-100 transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="font-medium text-gray-500">No images in this category</p>
          <p className="text-sm text-gray-400 mt-1">Click &quot;Upload New Image&quot; to add one</p>
        </div>
      )}
    </div>
  );
}

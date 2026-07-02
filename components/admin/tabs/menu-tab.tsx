"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import {
  createMenuCategory, updateMenuCategory, deleteMenuCategory,
  createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability,
} from "@/lib/actions";
import { useConfirmDialog } from "@/components/admin/confirm-dialog";

const emptyItem = { category_id: "", name: "", description: "", price_kes: 0, display_order: 0, is_available: true };
const emptyCat = { name: "", slug: "", display_order: 0, is_signature: false };

export function MenuTab({
  categories,
  menuItems,
}: {
  categories: Array<Record<string, unknown>>;
  menuItems: Array<Record<string, unknown>>;
}) {
  const router = useRouter();
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [editCat, setEditCat] = useState<Record<string, unknown> | null>(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const [catForm, setCatForm] = useState(emptyCat);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [showAddItem, setShowAddItem] = useState<string | null>(null); // category id
  const [itemForm, setItemForm] = useState(emptyItem);
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirmDialog();

  const toggleCat = (id: string) => {
    setExpandedCats((prev) => {
      const s = new Set(prev);
      if (s.has(id)) {
        s.delete(id);
      } else {
        s.add(id);
      }
      return s;
    });
  };

  // ── Category actions ──
  const handleSaveCat = async () => {
    if (!catForm.name) { toast.error("Category name required"); return; }
    if (!catForm.slug) catForm.slug = catForm.name.toLowerCase().replace(/\s+/g, "-");
    setSaving(true);
    const result = editCat
      ? await updateMenuCategory(String(editCat.id), catForm)
      : await createMenuCategory(catForm);
    setSaving(false);
    if (result.success) { toast.success(editCat ? "Category updated" : "Category added"); setEditCat(null); setShowAddCat(false); setCatForm(emptyCat); router.refresh(); }
    else toast.error(result.error);
  };
  const handleDeleteCat = (id: string, name: string) => {
    confirm({
      title: "Delete Category",
      message: "Delete this category and ALL its items?",
      expectedText: name,
      onConfirm: async () => {
        const result = await deleteMenuCategory(id);
        if (result.success) { toast.success("Deleted"); router.refresh(); }
        else toast.error(result.error);
      }
    });
  };

  // ── Item actions ──
  const handleSaveItem = async () => {
    if (!itemForm.name || !itemForm.category_id) { toast.error("Name and category required"); return; }
    setSaving(true);
    const result = editItem
      ? await updateMenuItem(String(editItem.id), itemForm)
      : await createMenuItem(itemForm);
    setSaving(false);
    if (result.success) { toast.success(editItem ? "Item updated" : "Item added"); setEditItem(null); setShowAddItem(null); setItemForm(emptyItem); router.refresh(); }
    else toast.error(result.error);
  };
  const handleDeleteItem = (id: string, name: string) => {
    confirm({
      title: "Delete Menu Item",
      message: "Are you sure you want to delete this menu item?",
      expectedText: name,
      onConfirm: async () => {
        const result = await deleteMenuItem(id);
        if (result.success) { toast.success("Deleted"); router.refresh(); }
        else toast.error(result.error);
      }
    });
  };
  const handleToggleItem = async (id: string, current: boolean) => {
    const result = await toggleMenuItemAvailability(id, !current);
    if (result.success) { toast.success(!current ? "Item enabled" : "Item hidden"); router.refresh(); }
    else toast.error(result.error);
  };

  const catFormPanel = (isEdit: boolean) => (
    <div className="mt-3 rounded-xl border-2 border-orange-200 bg-orange-50 p-4 space-y-3">
      <h4 className="font-medium text-gray-800">{isEdit ? "Edit Category" : "New Category"}</h4>
      <input placeholder="Category name (e.g. Seafood)" value={catForm.name}
        onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      <input placeholder="Slug (auto-filled)" value={catForm.slug}
        onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Display order:</label>
          <input type="number" value={catForm.display_order}
            onChange={(e) => setCatForm({ ...catForm, display_order: parseInt(e.target.value) || 0 })}
            className="w-20 rounded-lg border px-2 py-1.5 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="sig" checked={catForm.is_signature}
            onChange={(e) => setCatForm({ ...catForm, is_signature: e.target.checked })} />
          <label htmlFor="sig" className="text-sm">Signature category</label>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSaveCat} disabled={saving}
          className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
          <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={() => { setShowAddCat(false); setEditCat(null); setCatForm(emptyCat); }}
          className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm hover:bg-white transition-colors">
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
    </div>
  );

  const itemFormPanel = (catId: string) => (
    <div className="mt-3 rounded-xl border-2 border-blue-200 bg-blue-50 p-4 space-y-3">
      <h4 className="font-medium text-gray-800">{editItem ? "Edit Item" : "New Item"}</h4>
      <input placeholder="Item name" value={itemForm.name}
        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <input placeholder="Description" value={itemForm.description ?? ""}
        onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Price (KES):</label>
          <input type="number" value={itemForm.price_kes}
            onChange={(e) => setItemForm({ ...itemForm, price_kes: parseInt(e.target.value) || 0 })}
            className="w-28 rounded-lg border px-2 py-1.5 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Order:</label>
          <input type="number" value={itemForm.display_order}
            onChange={(e) => setItemForm({ ...itemForm, display_order: parseInt(e.target.value) || 0 })}
            className="w-20 rounded-lg border px-2 py-1.5 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id={`avail-${catId}`} checked={itemForm.is_available}
            onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.checked })} />
          <label htmlFor={`avail-${catId}`} className="text-sm">Available</label>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSaveItem} disabled={saving}
          className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
          <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={() => { setShowAddItem(null); setEditItem(null); setItemForm(emptyItem); }}
          className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm hover:bg-white transition-colors">
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {dialog}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{categories.length} categories · {menuItems.length} items</p>
        <button onClick={() => { setShowAddCat(true); setEditCat(null); setCatForm(emptyCat); }}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showAddCat && !editCat && catFormPanel(false)}

      {categories.map((cat) => {
        const items = menuItems.filter((it) => String(it.category_id) === String(cat.id));
        const expanded = expandedCats.has(String(cat.id));
        return (
          <div key={String(cat.id)} className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleCat(String(cat.id))}>
              <div className="flex items-center gap-3">
                {expanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                <div>
                  <span className="font-semibold text-gray-900">{String(cat.name)}</span>
                  {!!cat.is_signature && <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">Signature</span>}
                  <span className="ml-2 text-xs text-gray-400">{items.length} item(s)</span>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => { setEditCat(cat); setCatForm({ name: String(cat.name), slug: String(cat.slug), display_order: Number(cat.display_order), is_signature: Boolean(cat.is_signature) }); setShowAddCat(false); }}
                  className="rounded-lg border p-1.5 hover:bg-gray-100 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => handleDeleteCat(String(cat.id), String(cat.name))}
                  className="rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>

            {editCat && String(editCat.id) === String(cat.id) && (
              <div className="border-t px-4 pb-4">{catFormPanel(true)}</div>
            )}

            {expanded && (
              <div className="border-t px-4 pb-4">
                <div className="mt-3 space-y-2">
                  {items.map((item) => (
                    <div key={String(item.id)} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                      <div>
                        <span className="font-medium text-sm text-gray-800">{String(item.name)}</span>
                        {!!item.description && <span className="ml-2 text-xs text-gray-500">{String(item.description)}</span>}
                        <span className="ml-2 text-xs font-medium text-orange-600">KES {String(item.price_kes ?? "—")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleItem(String(item.id), Boolean(item.is_available))}
                          className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${item.is_available ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>
                          {item.is_available ? "Available" : "Hidden"}
                        </button>
                        <button onClick={() => { setEditItem(item); setShowAddItem(String(cat.id)); setItemForm({ category_id: String(item.category_id), name: String(item.name), description: String(item.description ?? ""), price_kes: Number(item.price_kes ?? 0), display_order: Number(item.display_order), is_available: Boolean(item.is_available) }); }}
                          className="rounded p-1 hover:bg-gray-200 transition-colors"><Pencil className="h-3.5 w-3.5 text-gray-500" /></button>
                        <button onClick={() => handleDeleteItem(String(item.id), String(item.name))}
                          className="rounded p-1 hover:bg-red-100 transition-colors"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                      </div>
                    </div>
                  ))}
                  {showAddItem === String(cat.id) && itemFormPanel(String(cat.id))}
                  {showAddItem !== String(cat.id) && (
                    <button onClick={() => { setShowAddItem(String(cat.id)); setEditItem(null); setItemForm({ ...emptyItem, category_id: String(cat.id) }); }}
                      className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                      <Plus className="h-3.5 w-3.5" /> Add item
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

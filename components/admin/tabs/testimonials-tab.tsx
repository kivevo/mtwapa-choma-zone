"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Plus, X, Check, Edit2 } from "lucide-react";
import {
  toggleTestimonialApproval,
  createTestimonial,
  deleteTestimonial,
} from "@/lib/actions";
import { useConfirmDialog } from "@/components/admin/confirm-dialog";

export function TestimonialsTab({ testimonials }: { testimonials: Array<Record<string, unknown>> }) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ customer_name: "", rating: 5, comment: "", approved: true });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ customer_name: "", rating: 5, comment: "", approved: true });
  const { confirm, dialog } = useConfirmDialog();

  const handleToggle = async (id: string, approved: boolean) => {
    const result = await toggleTestimonialApproval(id, approved);
    if (result.success) { toast.success(approved ? "Approved" : "Hidden"); router.refresh(); }
    else toast.error(result.error);
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: "Delete Testimonial",
      message: "Are you sure you want to delete this testimonial?",
      expectedText: name,
      onConfirm: async () => {
        const result = await deleteTestimonial(id);
        if (result.success) { toast.success("Deleted"); router.refresh(); }
        else toast.error(result.error);
      }
    });
  };

  const handleAdd = async () => {
    if (!form.customer_name || !form.comment) { toast.error("Name and comment required"); return; }
    setSaving(true);
    const result = await createTestimonial(form);
    setSaving(false);
    if (result.success) {
      toast.success("Testimonial added");
      setShowAdd(false);
      setForm({ customer_name: "", rating: 5, comment: "", approved: true });
      router.refresh();
    } else toast.error(result.error);
  };

  const startEdit = (t: Record<string, unknown>) => {
    setEditingId(String(t.id));
    setEditForm({
      customer_name: String(t.customer_name || ""),
      rating: Number(t.rating) || 5,
      comment: String(t.comment || ""),
      approved: Boolean(t.approved),
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    if (!editForm.customer_name || !editForm.comment) { toast.error("Name and comment required"); return; }
    setSaving(true);
    const result = await updateTestimonial(editingId, editForm);
    setSaving(false);
    if (result.success) {
      toast.success("Testimonial updated");
      setEditingId(null);
      router.refresh();
    } else toast.error(result.error);
  };

  return (
    <div className="space-y-4">
      {dialog}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{testimonials.length} testimonial(s)</p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-5 space-y-3">
          <h3 className="font-semibold text-gray-800">New Testimonial</h3>
          <input
            placeholder="Customer name"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Rating:</label>
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setForm({ ...form, rating: n })}
                className={`text-xl ${form.rating >= n ? "text-yellow-400" : "text-gray-300"}`}>★</button>
            ))}
          </div>
          <textarea
            placeholder="Comment"
            rows={3}
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="approved" checked={form.approved}
              onChange={(e) => setForm({ ...form, approved: e.target.checked })} />
            <label htmlFor="approved" className="text-sm">Approve immediately</label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving}
              className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
              <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setShowAdd(false)}
              className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {testimonials.map((t) => (
        <div key={String(t.id)} className="flex items-start justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm">
          {editingId === String(t.id) ? (
            <div className="w-full space-y-3">
              <input
                placeholder="Customer name"
                value={editForm.customer_name}
                onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Rating:</label>
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setEditForm({ ...editForm, rating: n })}
                    className={`text-xl ${editForm.rating >= n ? "text-yellow-400" : "text-gray-300"}`}>★</button>
                ))}
              </div>
              <textarea
                placeholder="Comment"
                rows={3}
                value={editForm.comment}
                onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="flex items-center gap-2">
                <input type="checkbox" id={`approved-${t.id}`} checked={editForm.approved}
                  onChange={(e) => setEditForm({ ...editForm, approved: e.target.checked })} />
                <label htmlFor={`approved-${t.id}`} className="text-sm">Approved (Published)</label>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={handleUpdate} disabled={saving}
                  className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                  <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
                </button>
                <button onClick={() => setEditingId(null)}
                  className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                  <X className="h-4 w-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{String(t.customer_name)}</p>
                  <span className="text-yellow-400">{"★".repeat(Number(t.rating) || 5)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.approved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {t.approved ? "Approved" : "Hidden"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">&ldquo;{String(t.comment)}&rdquo;</p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(String(t.created_at)).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(t)}
                  className="rounded-lg bg-blue-50 p-1.5 text-blue-500 hover:bg-blue-100 transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggle(String(t.id), !t.approved)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${t.approved ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-green-100 hover:bg-green-200 text-green-700"}`}>
                  {t.approved ? "Hide" : "Approve"}
                </button>
                <button onClick={() => handleDelete(String(t.id), String(t.customer_name))}
                  className="rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import {
  createEventType, updateEventType, deleteEventType,
  createCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
} from "@/lib/actions";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const emptyType = { name: "", description: "", icon_name: "", display_order: 0 };
const emptyEvent = { title: "", description: "", day_of_week: "Friday", event_date: null as string | null, is_recurring: true };

export function EventsTab({
  eventTypes,
  calendarEvents,
}: {
  eventTypes: Array<Record<string, unknown>>;
  calendarEvents: Array<Record<string, unknown>>;
}) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"types" | "calendar">("types");
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [typeForm, setTypeForm] = useState({ ...emptyType });
  const [calForm, setCalForm] = useState({ ...emptyEvent });
  const [saving, setSaving] = useState(false);

  const reset = () => { setShowAdd(false); setEditItem(null); setTypeForm({ ...emptyType }); setCalForm({ ...emptyEvent }); };

  // ── Event Types ──
  const handleSaveType = async () => {
    if (!typeForm.name) { toast.error("Name required"); return; }
    setSaving(true);
    const result = editItem
      ? await updateEventType(String(editItem.id), typeForm)
      : await createEventType(typeForm);
    setSaving(false);
    if (result.success) { toast.success(editItem ? "Updated" : "Added"); reset(); router.refresh(); }
    else toast.error(result.error);
  };
  const handleDeleteType = async (id: string) => {
    if (!confirm("Delete this event type?")) return;
    const result = await deleteEventType(id);
    if (result.success) { toast.success("Deleted"); router.refresh(); }
    else toast.error(result.error);
  };

  // ── Calendar Events ──
  const handleSaveCal = async () => {
    if (!calForm.title) { toast.error("Title required"); return; }
    setSaving(true);
    const result = editItem
      ? await updateCalendarEvent(String(editItem.id), calForm)
      : await createCalendarEvent(calForm);
    setSaving(false);
    if (result.success) { toast.success(editItem ? "Updated" : "Added"); reset(); router.refresh(); }
    else toast.error(result.error);
  };
  const handleDeleteCal = async (id: string) => {
    if (!confirm("Delete this calendar event?")) return;
    const result = await deleteCalendarEvent(id);
    if (result.success) { toast.success("Deleted"); router.refresh(); }
    else toast.error(result.error);
  };

  const typeFormPanel = () => (
    <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-5 space-y-3">
      <h4 className="font-semibold text-gray-800">{editItem ? "Edit Event Type" : "New Event Type"}</h4>
      <input placeholder="Name (e.g. Birthday Party)" value={typeForm.name}
        onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      <textarea placeholder="Description" rows={2} value={typeForm.description}
        onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Icon name (Lucide icon)</label>
          <input placeholder="e.g. cake, camera, flame" value={typeForm.icon_name}
            onChange={(e) => setTypeForm({ ...typeForm, icon_name: e.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="text-xs text-gray-500">Display Order</label>
          <input type="number" value={typeForm.display_order}
            onChange={(e) => setTypeForm({ ...typeForm, display_order: parseInt(e.target.value) || 0 })}
            className="mt-1 w-20 rounded-lg border px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSaveType} disabled={saving}
          className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
          <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={reset} className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm hover:bg-white transition-colors">
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
    </div>
  );

  const calFormPanel = () => (
    <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-5 space-y-3">
      <h4 className="font-semibold text-gray-800">{editItem ? "Edit Calendar Event" : "New Calendar Event"}</h4>
      <input placeholder="Title (e.g. Rhumba Night)" value={calForm.title}
        onChange={(e) => setCalForm({ ...calForm, title: e.target.value })}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
      <textarea placeholder="Description" rows={2} value={calForm.description}
        onChange={(e) => setCalForm({ ...calForm, description: e.target.value })}
        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="text-xs text-gray-500">Day of week</label>
          <select value={calForm.day_of_week}
            onChange={(e) => setCalForm({ ...calForm, day_of_week: e.target.value })}
            className="mt-1 block rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Specific date (optional)</label>
          <input type="date" value={calForm.event_date ?? ""}
            onChange={(e) => setCalForm({ ...calForm, event_date: e.target.value || null })}
            className="mt-1 block rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input type="checkbox" id="recurring" checked={calForm.is_recurring}
            onChange={(e) => setCalForm({ ...calForm, is_recurring: e.target.checked })} />
          <label htmlFor="recurring" className="text-sm">Recurring weekly</label>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSaveCal} disabled={saving}
          className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
          <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={reset} className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm hover:bg-white transition-colors">
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Sub-tabs */}
      <div className="flex rounded-xl border bg-gray-50 p-1 w-fit">
        <button onClick={() => { setActiveSection("types"); reset(); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeSection === "types" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
          Event Types ({eventTypes.length})
        </button>
        <button onClick={() => { setActiveSection("calendar"); reset(); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeSection === "calendar" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
          Calendar / Schedule ({calendarEvents.length})
        </button>
      </div>

      {activeSection === "types" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setShowAdd(true); setEditItem(null); setTypeForm({ ...emptyType }); }}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors">
              <Plus className="h-4 w-4" /> Add Event Type
            </button>
          </div>
          {showAdd && !editItem && typeFormPanel()}
          {editItem && activeSection === "types" && typeFormPanel()}
          <div className="grid gap-3 sm:grid-cols-2">
            {eventTypes.map((et) => (
              <div key={String(et.id)} className="flex items-start justify-between rounded-xl border bg-white p-4 shadow-sm">
                <div>
                  <p className="font-semibold text-gray-900">{String(et.name)}</p>
                  {!!et.description && <p className="mt-0.5 text-sm text-gray-500">{String(et.description)}</p>}
                  {!!et.icon_name && <p className="mt-0.5 text-xs text-gray-400">Icon: {String(et.icon_name)}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditItem(et); setShowAdd(false); setTypeForm({ name: String(et.name), description: String(et.description ?? ""), icon_name: String(et.icon_name ?? ""), display_order: Number(et.display_order) }); }}
                    className="rounded p-1.5 hover:bg-gray-100 transition-colors"><Pencil className="h-3.5 w-3.5 text-gray-500" /></button>
                  <button onClick={() => handleDeleteType(String(et.id))}
                    className="rounded p-1.5 hover:bg-red-100 transition-colors"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "calendar" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setShowAdd(true); setEditItem(null); setCalForm({ ...emptyEvent }); }}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
              <Plus className="h-4 w-4" /> Add Event
            </button>
          </div>
          {showAdd && !editItem && calFormPanel()}
          {editItem && activeSection === "calendar" && calFormPanel()}
          <div className="space-y-3">
            {calendarEvents.map((ev) => (
              <div key={String(ev.id)} className="flex items-start justify-between rounded-xl border bg-white p-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{String(ev.title)}</p>
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">{String(ev.day_of_week ?? "—")}</span>
                    {!!ev.is_recurring && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Weekly</span>}
                  </div>
                  {!!ev.description && <p className="mt-0.5 text-sm text-gray-500">{String(ev.description)}</p>}
                  {!!ev.event_date && <p className="mt-0.5 text-xs text-gray-400">📅 {String(ev.event_date)}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditItem(ev); setShowAdd(false); setCalForm({ title: String(ev.title), description: String(ev.description ?? ""), day_of_week: String(ev.day_of_week ?? "Friday"), event_date: ev.event_date ? String(ev.event_date) : null, is_recurring: Boolean(ev.is_recurring) }); }}
                    className="rounded p-1.5 hover:bg-gray-100 transition-colors"><Pencil className="h-3.5 w-3.5 text-gray-500" /></button>
                  <button onClick={() => handleDeleteCal(String(ev.id))}
                    className="rounded p-1.5 hover:bg-red-100 transition-colors"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

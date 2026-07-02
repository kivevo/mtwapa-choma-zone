"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, RotateCcw, Image as ImageIcon, ShoppingBag, Tag, CalendarDays, Clock, AlertTriangle, MessageCircle } from "lucide-react";
import { restoreRecycleBinItem, permanentlyDeleteItem } from "@/lib/actions";
import { useConfirmDialog } from "@/components/admin/confirm-dialog";

const TABLE_ICONS: Record<string, React.ReactNode> = {
  gallery_images: <ImageIcon className="h-4 w-4 text-purple-500" />,
  menu_items: <ShoppingBag className="h-4 w-4 text-orange-500" />,
  menu_categories: <Tag className="h-4 w-4 text-orange-400" />,
  event_types: <CalendarDays className="h-4 w-4 text-blue-500" />,
  events_calendar: <CalendarDays className="h-4 w-4 text-green-500" />,
  gallery_categories: <Tag className="h-4 w-4 text-purple-400" />,
  testimonials: <MessageCircle className="h-4 w-4 text-pink-500" />,
  contact_messages: <MessageCircle className="h-4 w-4 text-teal-500" />,
  event_inquiries: <CalendarDays className="h-4 w-4 text-indigo-500" />,
  table_reservations: <CalendarDays className="h-4 w-4 text-emerald-500" />,
};

const TABLE_LABELS: Record<string, string> = {
  gallery_images: "Gallery Image",
  menu_items: "Menu Item",
  menu_categories: "Menu Category",
  event_types: "Event Type",
  events_calendar: "Calendar Event",
  gallery_categories: "Gallery Category",
  testimonials: "Testimonial",
  contact_messages: "Contact Message",
  event_inquiries: "Event Inquiry",
  table_reservations: "Table Reservation",
};

function daysLeft(deletedAt: string) {
  const expiry = new Date(deletedAt);
  expiry.setDate(expiry.getDate() + 30);
  const diff = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / 86400000));
  return diff;
}

export function RecycleBinTab({ items }: { items: Array<Record<string, unknown>> }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const { confirm, dialog } = useConfirmDialog();

  const handleRestore = (item: Record<string, unknown>) => {
    confirm({
      title: "Restore Item",
      message: `Restore "${String(item.label)}"? It will reappear on your website.`,
      confirmLabel: "Restore",
      danger: false,
      onConfirm: async () => {
        setBusy(String(item.id));
        const res = await restoreRecycleBinItem(String(item.table), String(item.id));
        setBusy(null);
        if (res.success) {
          toast.success("Item restored successfully.");
          startTransition(() => router.refresh());
        } else {
          toast.error(res.error);
        }
      },
    });
  };

  const handleHardDelete = (item: Record<string, unknown>) => {
    confirm({
      title: "Permanently Delete",
      message: `Permanently delete "${String(item.label)}"? This CANNOT be undone.`,
      confirmLabel: "Delete Forever",
      danger: true,
      expectedText: String(item.label),
      onConfirm: async () => {
        setBusy(String(item.id));
        const res = await permanentlyDeleteItem(String(item.table), String(item.id));
        setBusy(null);
        if (res.success) {
          toast.success("Item permanently deleted.");
          startTransition(() => router.refresh());
        } else {
          toast.error(res.error);
        }
      },
    });
  };

  return (
    <>
      {dialog}
      <div className="space-y-4">
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-800">Recycle Bin — 30-Day Retention</p>
              <p className="mt-0.5 text-xs text-orange-700">
                Deleted items are kept here for 30 days, then automatically removed forever. You can restore any item or permanently delete it now.
              </p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
            <Trash2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="font-medium text-gray-500">Recycle Bin is empty</p>
            <p className="mt-1 text-sm text-gray-400">Deleted items appear here for 30 days.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Item</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Deleted</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Expires in</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => {
                  const days = daysLeft(String(item.deleted_at));
                  return (
                    <tr key={`${item.table}-${item.id}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          {TABLE_ICONS[String(item.table)] ?? <Trash2 className="h-4 w-4 text-gray-400" />}
                          <span className="truncate">{String(item.label)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{TABLE_LABELS[String(item.table)] ?? String(item.table)}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(String(item.deleted_at)).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-semibold ${days <= 3 ? "text-red-600" : days <= 7 ? "text-orange-600" : "text-green-600"}`}>
                          <Clock className="h-3 w-3" />
                          {days} day{days !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRestore(item)}
                            disabled={busy === String(item.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" /> Restore
                          </button>
                          <button
                            onClick={() => handleHardDelete(item)}
                            disabled={busy === String(item.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Delete Forever
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageCircle, Mail } from "lucide-react";
import { updateInquiryStatus } from "@/lib/actions";

export function InquiriesTab({ inquiries }: { inquiries: Array<Record<string, unknown>> }) {
  const router = useRouter();

  const handleStatusUpdate = async (id: string, status: string) => {
    const result = await updateInquiryStatus(id, status);
    if (result.success) { toast.success("Status updated"); router.refresh(); }
    else toast.error(result.error);
  };

  const statusColor: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-4">
      {inquiries.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400">No event inquiries yet.</p>
        </div>
      ) : (
        inquiries.map((inq) => (
          <div key={String(inq.id)} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-semibold text-gray-900">{String(inq.full_name)}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[String(inq.status)] ?? "bg-gray-100 text-gray-700"}`}>
                    {String(inq.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  📞 {String(inq.phone)} {inq.email ? `· ✉️ ${String(inq.email)}` : ""}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  🎉 {(inq.event_types as { name?: string })?.name ?? "—"}
                  {inq.preferred_date ? ` · 📅 ${String(inq.preferred_date)}` : ""}
                  {inq.guest_count ? ` · 👥 ${String(inq.guest_count)} guests` : ""}
                </p>
                {!!inq.message && (
                  <p className="mt-2 text-sm text-gray-500 italic">&#34;{String(inq.message)}&#34;</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(String(inq.created_at)).toLocaleDateString("en-KE", { dateStyle: "medium", timeStyle: "short" })}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {!!inq.phone && (
                    <a
                      href={`https://wa.me/${String(inq.phone).replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${String(inq.full_name)}, regarding your event inquiry at Choma Zone: `)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" /> Reply via WhatsApp
                    </a>
                  )}
                  {!!inq.email && (
                    <a
                      href={`mailto:${String(inq.email)}?subject=Re: Your Event Inquiry at Choma Zone`}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="h-4 w-4" /> Reply via Email
                    </a>
                  )}
                </div>
              </div>
              <select
                value={String(inq.status)}
                onChange={(e) => handleStatusUpdate(String(inq.id), e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

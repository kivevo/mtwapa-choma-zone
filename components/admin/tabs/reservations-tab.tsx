"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Calendar, Clock, Users, Mail, FileText, Trash2, CheckCircle2, MessageCircle } from "lucide-react";
import { updateReservationStatus, deleteReservation } from "@/lib/actions";

export function ReservationsTab({ reservations }: { reservations: Array<Record<string, unknown>> }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const result = await updateReservationStatus(id, status);
    setUpdating(null);
    if (result.success) {
      toast.success(`Reservation marked as ${status}`);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to move this reservation to the Recycle Bin?")) return;
    setUpdating(id);
    const result = await deleteReservation(id);
    setUpdating(null);
    if (!result.success) {
      toast.error(result.error);
    } else {
      toast.success("Reservation moved to Recycle Bin");
      router.refresh();
    }
  };

  const pending = reservations.filter((r) => r.status === "pending");
  const confirmed = reservations.filter((r) => r.status === "confirmed");
  const completedOrRejected = reservations.filter((r) => ["completed", "rejected", "cancelled"].includes(String(r.status)));

  const renderCard = (res: Record<string, unknown>) => (
    <div key={String(res.id)} className="rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-semibold text-gray-900 text-lg">{String(res.guest_name)}</h4>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
              ${res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${res.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
              ${['rejected', 'cancelled'].includes(String(res.status)) ? 'bg-red-100 text-red-800' : ''}
              ${res.status === 'completed' ? 'bg-gray-100 text-gray-800' : ''}
            `}>
              {String(res.status)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600 sm:grid-cols-4">
            <div className="flex items-center gap-1.5 font-medium text-orange-600">
              <Calendar className="h-4 w-4" /> {String(res.reservation_date)}
            </div>
            <div className="flex items-center gap-1.5 font-medium text-orange-600">
              <Clock className="h-4 w-4" /> {String(res.reservation_time).slice(0, 5)}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> Party of {String(res.party_size)}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${String(res.phone).replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${String(res.guest_name)}, regarding your table reservation at Choma Zone for ${String(res.reservation_date)}: `)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Reply via WhatsApp
            </a>
            {!!res.email && (
              <a
                href={`mailto:${String(res.email)}?subject=Re: Your Table Reservation at Choma Zone`}
                className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Mail className="h-4 w-4" /> Reply via Email
              </a>
            )}
          </div>

          {!!res.special_requests && (
            <div className="mt-4 rounded-lg bg-orange-50 p-3 text-sm">
              <div className="flex items-start gap-2 text-orange-800">
                <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="font-medium">Special Requests: <span className="font-normal italic">{String(res.special_requests)}</span></p>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col sm:items-end">
          {res.status === "pending" && (
            <>
              <button
                onClick={() => handleUpdateStatus(String(res.id), "confirmed")}
                disabled={updating === res.id}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> Confirm
              </button>
              <button
                onClick={() => handleUpdateStatus(String(res.id), "rejected")}
                disabled={updating === res.id}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                <X className="h-4 w-4" /> Reject
              </button>
            </>
          )}

          {res.status === "confirmed" && (
            <button
              onClick={() => handleUpdateStatus(String(res.id), "completed")}
              disabled={updating === res.id}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-100 border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4 text-green-600" /> Mark Completed
            </button>
          )}

          {(res.status === "completed" || res.status === "rejected" || res.status === "cancelled") && (
            <button
              onClick={() => handleDelete(String(res.id))}
              disabled={updating === res.id}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 mt-2 sm:mt-0"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Pending Reservations */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs text-yellow-800">
              {pending.length}
            </span>
            New Requests
          </h2>
        </div>
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">No pending reservations.</p>
          </div>
        ) : (
          <div className="grid gap-4">{pending.map(renderCard)}</div>
        )}
      </section>

      {/* Confirmed Reservations */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs text-green-800">
              {confirmed.length}
            </span>
            Confirmed Bookings
          </h2>
        </div>
        {confirmed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">No confirmed bookings.</p>
          </div>
        ) : (
          <div className="grid gap-4">{confirmed.map(renderCard)}</div>
        )}
      </section>

      {/* Past / Rejected */}
      {completedOrRejected.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Past & Rejected</h2>
          </div>
          <div className="grid gap-4 opacity-75">{completedOrRejected.map(renderCard)}</div>
        </section>
      )}
    </div>
  );
}

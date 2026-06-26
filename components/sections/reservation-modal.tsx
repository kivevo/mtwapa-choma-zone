"use client";

import { useState } from "react";
import { Loader2, X, Calendar, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { submitReservation } from "@/lib/actions";

interface ReservationModalProps {
  onClose: () => void;
}

export function ReservationModal({ onClose }: ReservationModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    guest_name: "",
    phone: "",
    email: "",
    reservation_date: "",
    reservation_time: "19:00",
    party_size: "2",
    special_requests: "",
    website: "", // honeypot
  });

  // Generate time slots (e.g., 11:00 to 22:00, every 30 mins)
  const timeSlots = [];
  for (let i = 11; i <= 22; i++) {
    timeSlots.push(`${i}:00`);
    timeSlots.push(`${i}:30`);
  }

  // Get today's date in YYYY-MM-DD format for the min date attribute
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await submitReservation({
      guest_name: form.guest_name,
      phone: form.phone,
      email: form.email,
      reservation_date: form.reservation_date,
      reservation_time: form.reservation_time,
      party_size: parseInt(form.party_size) || 2,
      special_requests: form.special_requests,
      website: form.website,
    });

    setLoading(false);

    if (result.success) {
      toast.success("Reservation request sent! We will confirm with you shortly.");
      onClose();
    } else {
      toast.error(result.error ?? "Failed to submit reservation.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
          <div>
            <h2 className="font-display text-xl font-bold text-charcoal">Book a Table</h2>
            <p className="text-xs text-charcoal/60 mt-0.5">Reserve your spot at Choma Zone</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5" id="reservation-form">
            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-ember" /> Date
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={form.reservation_date}
                  onChange={(e) => setForm({ ...form, reservation_date: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember transition-colors"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-ember" /> Time
                </label>
                <select
                  required
                  value={form.reservation_time}
                  onChange={(e) => setForm({ ...form, reservation_time: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember transition-colors"
                >
                  <option value="" disabled>Select a time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Party Size */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-ember" /> Party Size
              </label>
              <select
                required
                value={form.party_size}
                onChange={(e) => setForm({ ...form, party_size: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember transition-colors"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "Person" : "People"}
                  </option>
                ))}
                <option value="21">Larger group? (Use special requests)</option>
              </select>
            </div>

            <hr className="border-gray-100" />

            {/* Contact Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={form.guest_name}
                  onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember transition-colors"
                  placeholder="07XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Email <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Special Requests <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={form.special_requests}
                  onChange={(e) => setForm({ ...form, special_requests: e.target.value })}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember transition-colors"
                  placeholder="Allergies, high chair needed, etc."
                />
              </div>
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="absolute -left-[9999px] hidden"
              aria-hidden="true"
            />
          </form>
        </div>

        <div className="border-t px-6 py-4 bg-gray-50 shrink-0">
          <button
            type="submit"
            form="reservation-form"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ember px-8 py-4 font-semibold text-white transition-all hover:bg-ember/90 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Booking Request"
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            Your table is not confirmed until you receive a message from us.
          </p>
        </div>
      </div>
    </div>
  );
}

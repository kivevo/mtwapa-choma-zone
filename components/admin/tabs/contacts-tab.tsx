"use client";

import { MessageCircle, Mail } from "lucide-react";

export function ContactsTab({ contacts }: { contacts: Array<Record<string, unknown>> }) {
  return (
    <div className="space-y-4">
      {contacts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400">No contact messages yet.</p>
        </div>
      ) : (
        contacts.map((msg) => (
          <div key={String(msg.id)} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{String(msg.full_name)}</p>
                <p className="mt-0.5 text-sm text-gray-500">
                  {msg.email ? `✉️ ${String(msg.email)}` : ""}
                  {msg.phone ? ` · 📞 ${String(msg.phone)}` : ""}
                </p>
                <p className="mt-2 text-sm text-gray-700">{String(msg.message)}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(String(msg.created_at)).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {!!msg.phone && (
                    <a
                      href={`https://wa.me/${String(msg.phone).replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${String(msg.full_name)}, we received your message: `)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" /> Reply via WhatsApp
                    </a>
                  )}
                  {!!msg.email && (
                    <a
                      href={`mailto:${String(msg.email)}?subject=Re: Your message to Choma Zone`}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="h-4 w-4" /> Reply via Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

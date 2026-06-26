"use client";

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
                  {new Date(String(msg.created_at)).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

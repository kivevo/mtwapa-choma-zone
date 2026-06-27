"use client";

import { useState } from "react";
import { MessageCircle, Mail, Check, X, Send, Loader2 } from "lucide-react";
import { markContactMessageRead, sendEmailReplyAction } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ContactsTab({ contacts }: { contacts: Array<Record<string, unknown>> }) {
  const router = useRouter();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState("Re: Your message to Choma Zone");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleMarkAsRead = async (id: string) => {
    const res = await markContactMessageRead(id);
    if (res.success) {
      toast.success("Message marked as read");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const handleSendReply = async (msg: Record<string, unknown>) => {
    if (!replyBody.trim()) {
      toast.error("Please enter a message to send.");
      return;
    }
    setSending(true);
    const res = await sendEmailReplyAction(
      String(msg.id),
      String(msg.email),
      replySubject,
      replyBody
    );
    setSending(false);

    if (res.success) {
      toast.success("Reply sent successfully! Message marked as read.");
      setReplyingTo(null);
      setReplyBody("");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to send email.");
    }
  };

  return (
    <div className="space-y-4">
      {contacts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-400">No contact messages yet.</p>
        </div>
      ) : (
        contacts.map((msg) => {
          const isRead = Boolean(msg.is_read);
          const isReplying = replyingTo === String(msg.id);

          return (
            <div
              key={String(msg.id)}
              className={`rounded-xl border p-5 shadow-sm transition-colors ${
                isRead ? "bg-white border-gray-200" : "bg-orange-50/50 border-orange-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{String(msg.full_name)}</p>
                    {!isRead && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {msg.email ? `✉️ ${String(msg.email)}` : ""}
                    {msg.phone ? ` · 📞 ${String(msg.phone)}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{String(msg.message)}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(String(msg.created_at)).toLocaleString("en-KE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  
                  {isReplying ? (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700">Reply via Email</h4>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500">To</label>
                          <input
                            type="text"
                            value={String(msg.email)}
                            disabled
                            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500">Subject</label>
                          <input
                            type="text"
                            value={replySubject}
                            onChange={(e) => setReplySubject(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500">Message</label>
                          <textarea
                            rows={4}
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            placeholder="Type your reply here..."
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSendReply(msg)}
                            disabled={sending || !replyBody.trim()}
                            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                          >
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Send Email
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {!!msg.phone && (
                        <a
                          href={`https://wa.me/${String(msg.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hi ${String(msg.full_name)}, we received your message: `
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (!isRead) handleMarkAsRead(String(msg.id));
                          }}
                          className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" /> Reply via WhatsApp
                        </a>
                      )}
                      {!!msg.email && (
                        <button
                          onClick={() => setReplyingTo(String(msg.id))}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <Mail className="h-4 w-4" /> Reply via Email
                        </button>
                      )}
                      {!isRead && (
                        <button
                          onClick={() => handleMarkAsRead(String(msg.id))}
                          className="ml-auto flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Check className="h-4 w-4" /> Mark as Read
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

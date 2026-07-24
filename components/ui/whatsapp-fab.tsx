"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/utils";

interface WhatsAppFabProps {
  phone: string;
}

export function WhatsAppFab({ phone }: WhatsAppFabProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Tooltip label */}
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg shadow-black/10">
        <span className="text-sm font-semibold text-charcoal">Chat with us</span>
        <button
          onClick={() => setDismissed(true)}
          className="text-charcoal/40 hover:text-charcoal transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* FAB button */}
      <a
        href={generateWhatsAppUrl(phone)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 transition-transform hover:scale-110"
      >
        {/* Outer pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <MessageCircle className="h-7 w-7 fill-white/20 stroke-white" />
      </a>
    </div>
  );
}

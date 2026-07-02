import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPhoneDisplay, formatPhoneForTel, generateWhatsAppUrl } from "@/lib/utils";

interface ContactButtonsProps {
  phone: string;
  variant?: "light" | "dark";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ContactButtons({
  phone,
  variant = "light",
  size = "default",
  className,
}: ContactButtonsProps) {
  const tel = formatPhoneForTel(phone);
  const display = formatPhoneDisplay(phone);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}>
      <Button
        asChild
        variant={variant === "dark" ? "outline" : "secondary"}
        size={size}
      >
        <a href={`tel:${tel}`}>
          <Phone className="h-4 w-4" />
          {display}
        </a>
      </Button>
      <Button asChild variant="whatsapp" size={size}>
        <a href={generateWhatsAppUrl(phone)} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
    </div>
  );
}

export function WhatsAppLink({
  children,
  className,
  phone,
}: {
  children: React.ReactNode;
  className?: string;
  phone: string;
}) {
  return (
    <Link
      href={generateWhatsAppUrl(phone)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </Link>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LogOut, MessageSquare, Calendar, Star, Utensils,
  ImageIcon, Settings, LayoutDashboard, PartyPopper,
} from "lucide-react";
import { signOutAdmin } from "@/lib/actions";
import { InquiriesTab } from "./tabs/inquiries-tab";
import { ContactsTab } from "./tabs/contacts-tab";
import { TestimonialsTab } from "./tabs/testimonials-tab";
import { MenuTab } from "./tabs/menu-tab";
import { GalleryTab } from "./tabs/gallery-tab";
import { EventsTab } from "./tabs/events-tab";
import { SettingsTab } from "./tabs/settings-tab";
import { ReservationsTab } from "./tabs/reservations-tab";
import { useState } from "react";

type Tab = "reservations" | "inquiries" | "messages" | "testimonials" | "menu" | "gallery" | "events" | "settings";

interface AdminDashboardProps {
  inquiries: Array<Record<string, unknown>>;
  contacts: Array<Record<string, unknown>>;
  testimonials: Array<Record<string, unknown>>;
  menuCategories: Array<Record<string, unknown>>;
  menuItems: Array<Record<string, unknown>>;
  galleryImages: Array<Record<string, unknown>>;
  eventTypes: Array<Record<string, unknown>>;
  calendarEvents: Array<Record<string, unknown>>;
  settings: Record<string, unknown> | null;
  tableReservations: Array<Record<string, unknown>>;
  supabaseUrl?: string;
}

export function AdminDashboard({
  inquiries, contacts, testimonials,
  menuCategories, menuItems, galleryImages,
  eventTypes, calendarEvents, settings, tableReservations, supabaseUrl,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("reservations");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOutAdmin();
    router.push("/admin");
    router.refresh();
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "reservations", label: "Reservations", icon: <LayoutDashboard className="h-4 w-4" />, badge: tableReservations.filter((r) => String(r.status) === "pending").length || undefined },
    { id: "inquiries", label: "Inquiries", icon: <Calendar className="h-4 w-4" />, badge: inquiries.filter((i) => String(i.status) === "new").length || undefined },
    { id: "messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" />, badge: contacts.filter((c) => !c.is_read).length || undefined },
    { id: "testimonials", label: "Testimonials", icon: <Star className="h-4 w-4" /> },
    { id: "menu", label: "Menu", icon: <Utensils className="h-4 w-4" /> },
    { id: "gallery", label: "Gallery", icon: <ImageIcon className="h-4 w-4" /> },
    { id: "events", label: "Events", icon: <PartyPopper className="h-4 w-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const titles: Record<Tab, string> = {
    reservations: "Table Reservations",
    inquiries: "Event Inquiries",
    messages: "Contact Messages",
    testimonials: "Testimonials",
    menu: "Menu Management",
    gallery: "Gallery",
    events: "Events",
    settings: "Site Settings",
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-56" : "w-16"} flex-shrink-0 bg-gray-900 text-white flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          {(settings?.frontend_content as Record<string, string>)?.logo_image ? (
            <div className="relative h-8 w-8 shrink-0 rounded-lg overflow-hidden bg-white/10">
              <Image
                src={(settings?.frontend_content as Record<string, string>).logo_image}
                alt="Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-sm">
              {(settings?.frontend_content as Record<string, string>)?.logo_text || "CZ"}
            </div>
          )}
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">
                {(settings?.frontend_content as Record<string, string>)?.logo_full_name || "Choma Zone"}
              </p>
              <p className="text-xs text-gray-400 truncate">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors relative ${activeTab === item.id ? "bg-orange-500 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
              {item.badge ? (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="border-t border-white/10 p-2">
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg border p-2 hover:bg-gray-50 transition-colors">
              <LayoutDashboard className="h-4 w-4 text-gray-500" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{titles[activeTab]}</h1>
              <p className="text-xs text-gray-400">Choma Zone Mtwapa Palms</p>
            </div>
          </div>
          {/* Quick stats bar */}
          <div className="hidden md:flex items-center gap-6 text-center">
            <div><p className="text-lg font-bold text-gray-900">{inquiries.filter((i) => String(i.status) === "new").length}</p><p className="text-xs text-gray-400">New Inquiries</p></div>
            <div className="h-8 w-px bg-gray-200" />
            <div><p className="text-lg font-bold text-gray-900">{menuItems.length}</p><p className="text-xs text-gray-400">Menu Items</p></div>
            <div className="h-8 w-px bg-gray-200" />
            <div><p className="text-lg font-bold text-gray-900">{testimonials.filter((t) => !t.approved).length}</p><p className="text-xs text-gray-400">Pending Reviews</p></div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === "reservations" && <ReservationsTab reservations={tableReservations} />}
          {activeTab === "inquiries" && <InquiriesTab inquiries={inquiries} />}
          {activeTab === "messages" && <ContactsTab contacts={contacts} />}
          {activeTab === "testimonials" && <TestimonialsTab testimonials={testimonials} />}
          {activeTab === "menu" && <MenuTab categories={menuCategories} menuItems={menuItems} />}
          {activeTab === "gallery" && <GalleryTab galleryImages={galleryImages} supabaseUrl={supabaseUrl} />}
          {activeTab === "events" && <EventsTab eventTypes={eventTypes} calendarEvents={calendarEvents} />}
          {activeTab === "settings" && <SettingsTab settings={settings} galleryImages={galleryImages} supabaseUrl={supabaseUrl} />}
        </main>
      </div>
    </div>
  );
}

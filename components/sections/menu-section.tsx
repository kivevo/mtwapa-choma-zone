"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatKES, generateWhatsAppOrderUrl, generateWhatsAppUrl } from "@/lib/utils";
import type { MenuCategoryWithItems, SiteSettings } from "@/types/database.types";
import { MessageCircle } from "lucide-react";

interface MenuSectionProps {
  categories: MenuCategoryWithItems[];
  settings: SiteSettings;
  preview?: boolean;
}

export function MenuSection({ categories, settings, preview = false }: MenuSectionProps) {
  const signature = categories.find((c) => c.is_signature);
  const defaultTab = signature?.slug ?? categories[0]?.slug ?? "nyama-choma";
  const displayCategories = preview ? categories.slice(0, 3) : categories;

  return (
    <AnimatedSection id="menu" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Food & Choma"
          title="From the Grill to Your Table"
          description="Signature nyama choma, Kenyan classics, pizza, coffee, ice cream, and a full garden bar — all cooked with coastal love."
        />

        {signature && (
          <div className="relative mb-12 overflow-hidden rounded-3xl bg-charcoal p-8 md:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ember/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-ember/20 px-4 py-1.5 text-sm font-semibold text-ember">
                  <Flame className="h-4 w-4" />
                  Mtwapa&apos;s Best Nyama Choma
                </span>
                <h3 className="mt-4 font-display text-3xl font-bold text-sand md:text-4xl">
                  Signature Choma
                </h3>
                <p className="mt-3 max-w-lg text-sand/75">
                  Slow-roasted over real charcoal in our open garden choma area.
                  Beef, goat, and whole-roast celebrations — this is what we&apos;re
                  famous for.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3">
                {signature.menu_items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl bg-white/5 px-5 py-4"
                  >
                    <div className="flex items-center justify-between gap-8">
                      <span className="font-medium text-sand">{item.name}</span>
                      <span className="font-semibold text-gold">
                        {formatKES(item.price_kes)}
                      </span>
                    </div>
                    <Button asChild size="sm" variant="whatsapp" className="w-full text-xs">
                      <a href={generateWhatsAppOrderUrl(item.name, settings.phone_primary)} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-3 w-3 mr-1" /> Order on WhatsApp
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            {displayCategories.map((cat) => (
              <TabsTrigger key={cat.slug} value={cat.slug}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {displayCategories.map((cat) => (
            <TabsContent key={cat.slug} value={cat.slug}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.menu_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-2xl border border-palm/10 bg-sand/50 p-6 transition-shadow hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-display text-lg font-semibold text-charcoal">
                          {item.name}
                        </h4>
                        {item.price_kes != null && (
                          <span className="shrink-0 font-semibold text-ember">
                            {formatKES(item.price_kes)}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-2 text-sm text-charcoal/65">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-palm/5">
                      <Button asChild size="sm" variant="whatsapp" className="w-full">
                        <a href={generateWhatsAppOrderUrl(item.name, settings.phone_primary)} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4 mr-2" /> Order via WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {preview && (
            <Button asChild variant="secondary">
              <Link href="/menu">View Full Menu</Link>
            </Button>
          )}
          <Button asChild variant="whatsapp">
            <a href={generateWhatsAppUrl(settings.phone_primary)} target="_blank" rel="noopener noreferrer">
              Order via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}

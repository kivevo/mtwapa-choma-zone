"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ImageIcon } from "lucide-react";
import { updateSiteSettings } from "@/lib/actions";
import { ImagePicker } from "@/components/admin/image-picker";

export function SettingsTab({
  settings,
  galleryImages = [],
  supabaseUrl,
}: {
  settings: Record<string, unknown> | null;
  galleryImages?: Array<Record<string, unknown>>;
  supabaseUrl?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "social" | "stats" | "content">("general");
  const [pickerTarget, setPickerTarget] = useState<string | null>(null);

  const s = settings ?? {};
  const fc = (s.frontend_content as Record<string, string>) || {};

  const [general, setGeneral] = useState({
    business_name: String(s.business_name ?? ""),
    tagline: String(s.tagline ?? ""),
    happy_hour_text: String(s.happy_hour_text ?? ""),
    address: String(s.address ?? ""),
  });
  const [contact, setContact] = useState({
    phone_primary: String(s.phone_primary ?? ""),
    phone_secondary: String(s.phone_secondary ?? ""),
    email: String(s.email ?? ""),
  });
  const [social, setSocial] = useState({
    instagram_url: String(s.instagram_url ?? ""),
    facebook_url: String(s.facebook_url ?? ""),
    tiktok_url: String(s.tiktok_url ?? ""),
    google_place_id: String(s.google_place_id ?? ""),
    latitude: String(s.latitude ?? ""),
    longitude: String(s.longitude ?? ""),
  });
  const [stats, setStats] = useState({
    stat_years_open: String(s.stat_years_open ?? ""),
    stat_parking_capacity: String(s.stat_parking_capacity ?? ""),
    stat_happy_customers: String(s.stat_happy_customers ?? ""),
  });

  const [content, setContent] = useState({
    logo_text: fc.logo_text ?? "CZ",
    logo_full_name: fc.logo_full_name ?? "Choma Zone",
    logo_subtitle: fc.logo_subtitle ?? "Mtwapa Palms",
    hero_title_prefix: fc.hero_title_prefix ?? "Mtwapa's Best",
    hero_title_highlight: fc.hero_title_highlight ?? "Nyama Choma",
    hero_title_suffix: fc.hero_title_suffix ?? "Open Garden Hospitality",
    hero_description: fc.hero_description ?? "Charcoal-grilled perfection in a lush makuti garden on the Mombasa–Malindi Highway. Sundowners, family fun, events & the coast's favourite stopover spot.",
    hero_bg_image: fc.hero_bg_image ?? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
    hero_bg_video: fc.hero_bg_video ?? "",
    about_title: fc.about_title ?? "More Than Just a Restaurant",
    about_p1: fc.about_p1 ?? "Since opening our doors, Choma Zone Mtwapa Palms has become the coast's premier destination for authentic charcoal-grilled meats and unforgettable open-air dining.",
    about_p2: fc.about_p2 ?? "Set within a lush, expansive garden, our venue combines the relaxed coastal breeze with the irresistible aroma of slowly roasting nyama choma. Whether you're stopping by for a quick lunch, celebrating a milestone, or unwinding with sundowners, we provide the perfect backdrop.",
    about_image_1: fc.about_image_1 ?? "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    about_image_2: fc.about_image_2 ?? "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
    family_fun_title: fc.family_fun_title ?? "Family Fun Day",
    family_fun_desc: fc.family_fun_desc ?? "Every Sunday is Family Fun Day at Choma Zone. Enjoy live entertainment, face painting, and our dedicated kids' play area while you relax with friends.",
    family_fun_image: fc.family_fun_image ?? "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80",
    stopover_title: fc.stopover_title ?? "The Perfect Stopover",
    stopover_desc: fc.stopover_desc ?? "Traveling along the Mombasa-Malindi highway? Pull into our secure, spacious parking for a refreshing break, great food, and clean facilities.",
    stopover_image: fc.stopover_image ?? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    footer_text: fc.footer_text ?? "Mtwapa's premier destination for authentic nyama choma, family entertainment, and open garden hospitality.",
  });

  const handleSave = async () => {
    setSaving(true);
    const result = await updateSiteSettings({
      ...general,
      ...contact,
      instagram_url: social.instagram_url,
      facebook_url: social.facebook_url,
      tiktok_url: social.tiktok_url,
      google_place_id: social.google_place_id,
      latitude: parseFloat(social.latitude) || undefined,
      longitude: parseFloat(social.longitude) || undefined,
      stat_years_open: parseInt(stats.stat_years_open) || undefined,
      stat_parking_capacity: parseInt(stats.stat_parking_capacity) || undefined,
      stat_happy_customers: stats.stat_happy_customers,
      frontend_content: content,
    } as Parameters<typeof updateSiteSettings>[0]);
    setSaving(false);
    if (result.success) { toast.success("Settings saved!"); router.refresh(); }
    else toast.error(result.error);
  };

  const inputCls = "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide";

  const tabs = [
    { id: "general" as const, label: "General" },
    { id: "content" as const, label: "Website Content" },
    { id: "contact" as const, label: "Contact" },
    { id: "social" as const, label: "Social & Map" },
    { id: "stats" as const, label: "Stats" },
  ];

  // Helper: renders an image URL field with a "Select from Library" button
  const imgField = (label: string, key: keyof typeof content, currentVal: string) => (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="mt-1 flex gap-2">
        <input
          value={currentVal}
          onChange={(e) => setContent({ ...content, [key]: e.target.value })}
          placeholder="Paste URL or select from library →"
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
        <button
          type="button"
          onClick={() => setPickerTarget(key)}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:border-orange-300 transition-colors whitespace-nowrap"
        >
          <ImageIcon className="h-4 w-4 text-orange-400" />
          Library
        </button>
      </div>
      {currentVal && currentVal.startsWith("http") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentVal} alt={label} className="mt-2 h-20 w-auto rounded-lg object-cover border" />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5">
      {/* Image picker modal */}
      <ImagePicker
        open={!!pickerTarget}
        onClose={() => setPickerTarget(null)}
        onSelect={(url) => {
          if (pickerTarget) setContent({ ...content, [pickerTarget]: url });
        }}
        supabaseUrl={supabaseUrl ?? ""}
        images={galleryImages}
      />

      <div className="flex rounded-xl border bg-gray-50 p-1 gap-1 w-fit flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === t.id ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-5">
        {activeTab === "general" && (
          <>
            <h3 className="font-semibold text-gray-800 border-b pb-3">General Information</h3>
            <div>
              <label className={labelCls}>Business Name</label>
              <input value={general.business_name} onChange={(e) => setGeneral({ ...general, business_name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tagline</label>
              <input value={general.tagline} onChange={(e) => setGeneral({ ...general, tagline: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <input value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Happy Hour Text</label>
              <textarea rows={3} value={general.happy_hour_text} onChange={(e) => setGeneral({ ...general, happy_hour_text: e.target.value })} className={inputCls + " resize-none"} />
            </div>
          </>
        )}

        {activeTab === "content" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 border-b pb-3 mb-4">Logo Settings</h3>
              <div className="space-y-4">
                {imgField("Logo Image (replaces initials)", "logo_image" as keyof typeof content, (content as Record<string, string>).logo_image ?? "")}
                <div><label className={labelCls}>Logo Initials (shown if no image)</label><input value={content.logo_text} onChange={(e) => setContent({ ...content, logo_text: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Logo Full Name</label><input value={content.logo_full_name} onChange={(e) => setContent({ ...content, logo_full_name: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Logo Subtitle</label><input value={content.logo_subtitle} onChange={(e) => setContent({ ...content, logo_subtitle: e.target.value })} className={inputCls} /></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 border-b pb-3 mb-4 mt-8">Hero Section</h3>
              <div className="space-y-4">
                <div><label className={labelCls}>Title Prefix</label><input value={content.hero_title_prefix} onChange={(e) => setContent({ ...content, hero_title_prefix: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Title Highlight (Orange)</label><input value={content.hero_title_highlight} onChange={(e) => setContent({ ...content, hero_title_highlight: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Title Suffix</label><input value={content.hero_title_suffix} onChange={(e) => setContent({ ...content, hero_title_suffix: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Description Paragraph</label><textarea rows={3} value={content.hero_description} onChange={(e) => setContent({ ...content, hero_description: e.target.value })} className={inputCls + " resize-none"} /></div>
                {imgField("Background Image", "hero_bg_image", content.hero_bg_image)}
                <div>
                  <label className={labelCls}>Hero Background Video URL (optional MP4 link - overrides image)</label>
                  <input
                    type="url"
                    value={content.hero_bg_video}
                    onChange={(e) => setContent({ ...content, hero_bg_video: e.target.value })}
                    className={inputCls}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 border-b pb-3 mb-4 mt-8">About Section</h3>
              <div className="space-y-4">
                <div><label className={labelCls}>Title</label><input value={content.about_title} onChange={(e) => setContent({ ...content, about_title: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Paragraph 1</label><textarea rows={3} value={content.about_p1} onChange={(e) => setContent({ ...content, about_p1: e.target.value })} className={inputCls + " resize-none"} /></div>
                <div><label className={labelCls}>Paragraph 2</label><textarea rows={3} value={content.about_p2} onChange={(e) => setContent({ ...content, about_p2: e.target.value })} className={inputCls + " resize-none"} /></div>
                {imgField("Image 1", "about_image_1", content.about_image_1)}
                {imgField("Image 2", "about_image_2", content.about_image_2)}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 border-b pb-3 mb-4 mt-8">Feature Sections</h3>
              <div className="space-y-4">
                <div><label className={labelCls}>Family Fun Title</label><input value={content.family_fun_title} onChange={(e) => setContent({ ...content, family_fun_title: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Family Fun Description</label><textarea rows={2} value={content.family_fun_desc} onChange={(e) => setContent({ ...content, family_fun_desc: e.target.value })} className={inputCls + " resize-none"} /></div>
                {imgField("Family Fun Image", "family_fun_image", content.family_fun_image)}

                <div className="pt-4"><label className={labelCls}>Stopover Title</label><input value={content.stopover_title} onChange={(e) => setContent({ ...content, stopover_title: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Stopover Description</label><textarea rows={2} value={content.stopover_desc} onChange={(e) => setContent({ ...content, stopover_desc: e.target.value })} className={inputCls + " resize-none"} /></div>
                {imgField("Stopover Image", "stopover_image", content.stopover_image)}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 border-b pb-3 mb-4 mt-8">Footer</h3>
              <div><label className={labelCls}>Footer Description</label><textarea rows={2} value={content.footer_text} onChange={(e) => setContent({ ...content, footer_text: e.target.value })} className={inputCls + " resize-none"} /></div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <>
            <h3 className="font-semibold text-gray-800 border-b pb-3">Contact Information</h3>
            <div><label className={labelCls}>Primary Phone</label><input type="tel" value={contact.phone_primary} onChange={(e) => setContact({ ...contact, phone_primary: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Secondary Phone</label><input type="tel" value={contact.phone_secondary} onChange={(e) => setContact({ ...contact, phone_secondary: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Email</label><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={inputCls} /></div>
          </>
        )}

        {activeTab === "social" && (
          <>
            <h3 className="font-semibold text-gray-800 border-b pb-3">Social Media & Map</h3>
            <div><label className={labelCls}>Instagram URL</label><input type="url" value={social.instagram_url} onChange={(e) => setSocial({ ...social, instagram_url: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Facebook URL</label><input type="url" value={social.facebook_url} onChange={(e) => setSocial({ ...social, facebook_url: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>TikTok URL</label><input type="url" value={social.tiktok_url} onChange={(e) => setSocial({ ...social, tiktok_url: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Google Place ID</label><input value={social.google_place_id} onChange={(e) => setSocial({ ...social, google_place_id: e.target.value })} className={inputCls} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelCls}>Latitude</label><input type="number" step="any" value={social.latitude} onChange={(e) => setSocial({ ...social, latitude: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Longitude</label><input type="number" step="any" value={social.longitude} onChange={(e) => setSocial({ ...social, longitude: e.target.value })} className={inputCls} /></div>
            </div>
          </>
        )}

        {activeTab === "stats" && (
          <>
            <h3 className="font-semibold text-gray-800 border-b pb-3">Stats Section</h3>
            <p className="text-xs text-gray-400">These appear in the &quot;About&quot; stats bar on the homepage.</p>
            <div><label className={labelCls}>Years Open</label><input type="number" value={stats.stat_years_open} onChange={(e) => setStats({ ...stats, stat_years_open: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Parking Capacity</label><input type="number" value={stats.stat_parking_capacity} onChange={(e) => setStats({ ...stats, stat_parking_capacity: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Happy Customers Label</label><input placeholder="e.g. Thousands" value={stats.stat_happy_customers} onChange={(e) => setStats({ ...stats, stat_happy_customers: e.target.value })} className={inputCls} /></div>
          </>
        )}

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm mt-4">
          <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

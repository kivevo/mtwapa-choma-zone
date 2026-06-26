import type { SiteSettings } from "@/types/database.types";

export function RestaurantJsonLd({ settings }: { settings: SiteSettings }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness", "FoodEstablishment"],
    name: settings.business_name,
    description: `${settings.tagline} — Best nyama choma on the North Coast. Open garden dining, events, and bar on the Mombasa-Malindi Highway, Mtwapa.`,
    image: "https://www.chomazonemtwapa.co.ke/og-image.jpg",
    url: "https://www.chomazonemtwapa.co.ke",
    telephone: [`+254${settings.phone_primary.replace(/^0/, "")}`, `+254${settings.phone_secondary.replace(/^0/, "")}`],
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mombasa-Malindi Highway, opposite Galana Petrol Station",
      addressLocality: "Mtwapa",
      addressRegion: "Kilifi County",
      addressCountry: "KE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.latitude,
      longitude: settings.longitude,
    },
    hasMap: `https://www.google.com/maps/place/?q=place_id:${settings.google_place_id}`,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "23:59",
      },
    ],
    servesCuisine: ["Kenyan", "African", "Barbecue", "Pizza"],
    priceRange: "$$",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Outdoor seating", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Children welcome", value: true },
    ],
    sameAs: [
      settings.instagram_url,
      settings.facebook_url,
      settings.tiktok_url,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

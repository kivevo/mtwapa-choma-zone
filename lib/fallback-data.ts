import type {
  CalendarEvent,
  EventType,
  GalleryImage,
  MenuCategoryWithItems,
  SiteSettings,
  Testimonial,
} from "@/types/database.types";

export const FALLBACK_SETTINGS: SiteSettings = {
  id: "fallback",
  business_name: "Choma Zone Mtwapa Palms",
  tagline: "Open Garden Hospitality",
  phone_primary: "0711333090",
  phone_secondary: "0722878481",
  email: "mtwapapalmsltd@gmail.com",
  address:
    "Mombasa-Malindi Highway, Mtwapa, opposite Galana Petrol Station",
  latitude: -3.943549,
  longitude: 39.745274,
  google_place_id: "ChIJH9J-1GcJQBgRsgp0tmZBpBY",
  instagram_url: "https://www.instagram.com/mtwapapalms",
  facebook_url: "https://www.facebook.com/ChomaZoneMtwapaPalm",
  tiktok_url: "https://www.tiktok.com/@chomazonemtwapa",
  opening_hours: {
    mon_fri: "10:00 - 23:00",
    sat_sun: "08:00 - late",
  },
  happy_hour_text:
    "Happy Hour daily 4PM - 7PM. Buy one get one on selected beers & cocktails.",
  stat_years_open: 8,
  stat_parking_capacity: 100,
  stat_happy_customers: "Thousands",
  frontend_content: {
    logo_text: "CZ",
    logo_full_name: "Choma Zone",
    logo_subtitle: "Mtwapa Palms",
    hero_title_prefix: "Mtwapa's Best",
    hero_title_highlight: "Nyama Choma",
    hero_title_suffix: "Open Garden Hospitality",
    hero_description: "Charcoal-grilled perfection in a lush makuti garden on the Mombasa–Malindi Highway. Sundowners, family fun, events & the coast's favourite stopover spot.",
    hero_bg_image: "/hero-bg-kenyan.png",
    about_title: "More Than Just a Restaurant",
    about_p1: "Since opening our doors, Choma Zone Mtwapa Palms has become the coast's premier destination for authentic charcoal-grilled meats and unforgettable open-air dining.",
    about_p2: "Set within a lush, expansive garden, our venue combines the relaxed coastal breeze with the irresistible aroma of slowly roasting nyama choma. Whether you're stopping by for a quick lunch, celebrating a milestone, or unwinding with sundowners, we provide the perfect backdrop.",
    about_image_1: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    about_image_2: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
    family_fun_title: "Family Fun Day",
    family_fun_desc: "Every Sunday is Family Fun Day at Choma Zone. Enjoy live entertainment, face painting, and our dedicated kids' play area while you relax with friends.",
    family_fun_image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80",
    stopover_title: "The Perfect Stopover",
    stopover_desc: "Traveling along the Mombasa-Malindi highway? Pull into our secure, spacious parking for a refreshing break, great food, and clean facilities.",
    stopover_image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    footer_text: "Mtwapa's premier destination for authentic nyama choma, family entertainment, and open garden hospitality."
  },
  updated_at: new Date().toISOString(),
};

export const FALLBACK_MENU: MenuCategoryWithItems[] = [
  {
    id: "1",
    name: "Nyama Choma",
    slug: "nyama-choma",
    display_order: 1,
    is_signature: true,
    menu_items: [
      {
        id: "m1",
        category_id: "1",
        name: "Whole Goat Choma",
        description: "Slow-roasted over charcoal — perfect for groups",
        price_kes: 8500,
        image_url: null,
        is_available: true,
        display_order: 1,
      },
      {
        id: "m2",
        category_id: "1",
        name: "1/2 Kg Nyama Choma",
        description: "Tender charcoal-grilled beef — our signature",
        price_kes: 1200,
        image_url: null,
        is_available: true,
        display_order: 2,
      },
      {
        id: "m3",
        category_id: "1",
        name: "1 Kg Nyama Choma",
        description: "The classic Mtwapa portion — share with friends",
        price_kes: 2200,
        image_url: null,
        is_available: true,
        display_order: 3,
      },
      {
        id: "m4",
        category_id: "1",
        name: "Mbuzi Choma (Goat)",
        description: "Whole goat roast for celebrations",
        price_kes: 7500,
        image_url: null,
        is_available: true,
        display_order: 4,
      },
    ],
  },
  {
    id: "2",
    name: "Kenyan Cuisine",
    slug: "kenyan-cuisine",
    display_order: 2,
    is_signature: false,
    menu_items: [
      {
        id: "m5",
        category_id: "2",
        name: "Ugali & Sukuma Wiki",
        description: "Hearty Kenyan staple with fresh greens",
        price_kes: 350,
        image_url: null,
        is_available: true,
        display_order: 1,
      },
      {
        id: "m6",
        category_id: "2",
        name: "Pilau & Kachumbari",
        description: "Coastal-spiced rice with fresh salad",
        price_kes: 450,
        image_url: null,
        is_available: true,
        display_order: 2,
      },
    ],
  },
  {
    id: "3",
    name: "Pizza",
    slug: "pizza",
    display_order: 3,
    is_signature: false,
    menu_items: [
      {
        id: "m7",
        category_id: "3",
        name: "Margherita",
        description: "Fresh tomato, mozzarella, basil",
        price_kes: 800,
        image_url: null,
        is_available: true,
        display_order: 1,
      },
      {
        id: "m8",
        category_id: "3",
        name: "Choma Special Pizza",
        description: "Grilled meat, peppers, red onion",
        price_kes: 1100,
        image_url: null,
        is_available: true,
        display_order: 2,
      },
    ],
  },
  {
    id: "4",
    name: "Coffee & Ice Cream",
    slug: "coffee-ice-cream",
    display_order: 4,
    is_signature: false,
    menu_items: [
      {
        id: "m9",
        category_id: "4",
        name: "Kenyan AA Coffee",
        description: "Freshly brewed single origin",
        price_kes: 250,
        image_url: null,
        is_available: true,
        display_order: 1,
      },
      {
        id: "m10",
        category_id: "4",
        name: "Soft Serve Ice Cream",
        description: "Perfect for the kids (and you)",
        price_kes: 200,
        image_url: null,
        is_available: true,
        display_order: 2,
      },
    ],
  },
  {
    id: "5",
    name: "Bar & Drinks",
    slug: "bar-drinks",
    display_order: 5,
    is_signature: false,
    menu_items: [
      {
        id: "m11",
        category_id: "5",
        name: "Tusker Lager",
        description: "Ice cold, straight from the garden bar",
        price_kes: 350,
        image_url: null,
        is_available: true,
        display_order: 1,
      },
      {
        id: "m12",
        category_id: "5",
        name: "Dawa Cocktail",
        description: "Kenyan classic — honey, lime, vodka",
        price_kes: 550,
        image_url: null,
        is_available: true,
        display_order: 2,
      },
    ],
  },
];

export const FALLBACK_EVENT_TYPES: EventType[] = [
  {
    id: "e1",
    name: "Birthday Party",
    description:
      "Celebrate in our lush garden with choma, music, and space for everyone.",
    icon_name: "cake",
    image_url: null,
    display_order: 1,
  },
  {
    id: "e2",
    name: "Baby Shower",
    description: "A beautiful outdoor setting for welcoming the little one.",
    icon_name: "baby",
    image_url: null,
    display_order: 2,
  },
  {
    id: "e3",
    name: "Graduation Party",
    description: "Mark the milestone with great food and a lively atmosphere.",
    icon_name: "graduation-cap",
    image_url: null,
    display_order: 3,
  },
  {
    id: "e4",
    name: "Wedding Photoshoot",
    description:
      "Golden-hour garden backdrops — makuti, palms, and the iconic sign.",
    icon_name: "camera",
    image_url: null,
    display_order: 4,
  },
  {
    id: "e5",
    name: "Mbuzi Choma Party",
    description: "The ultimate goat-roast celebration for your crew.",
    icon_name: "flame",
    image_url: null,
    display_order: 5,
  },
  {
    id: "e6",
    name: "Family Fun Day",
    description:
      "Themed entertainment for all ages in our supervised playground.",
    icon_name: "users",
    image_url: null,
    display_order: 6,
  },
  {
    id: "e7",
    name: "Corporate Event",
    description: "Luncheons, dinners, and end-of-year parties done right.",
    icon_name: "briefcase",
    image_url: null,
    display_order: 7,
  },
  {
    id: "e8",
    name: "Business Meeting",
    description: "Relaxed garden setting for productive gatherings.",
    icon_name: "presentation",
    image_url: null,
    display_order: 8,
  },
  {
    id: "e9",
    name: "Family Gathering",
    description:
      "Reunions, celebrations, and Sunday lunch with the whole clan.",
    icon_name: "heart",
    image_url: null,
    display_order: 9,
  },
  {
    id: "e10",
    name: "Holiday Fun Activities",
    description: "Seasonal events and school-holiday entertainment.",
    icon_name: "sparkles",
    image_url: null,
    display_order: 10,
  },
];

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    customer_name: "Wanjiku M.",
    rating: 5,
    comment:
      "Best nyama choma on the North Coast! The garden setting at sunset is unbeatable. Our kids love the playground too.",
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "t2",
    customer_name: "James O.",
    rating: 5,
    comment:
      "Perfect stopover on the Mombasa-Malindi highway. Great coffee, clean facilities, and the choma is always on point.",
    approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "t3",
    customer_name: "Sarah & David",
    rating: 5,
    comment:
      "Hosted our daughter's birthday here — the team handled everything. Rhumba night afterwards was the cherry on top!",
    approved: true,
    created_at: new Date().toISOString(),
  },
];

export const FALLBACK_CALENDAR: CalendarEvent[] = [
  {
    id: "c1",
    title: "Sunday Family Fun Day",
    description: "Live entertainment, kids activities, and special menu deals.",
    day_of_week: "Sunday",
    event_date: null,
    is_recurring: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "c2",
    title: "Rhumba Night",
    description: "Live band playing your favourite Rhumba hits.",
    day_of_week: "Friday",
    event_date: null,
    is_recurring: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "c3",
    title: "Mugithi Night",
    description: "Kikuyu benga and Mugithi — dance till late.",
    day_of_week: "Saturday",
    event_date: null,
    is_recurring: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "c4",
    title: "DJ Weekend Sets",
    description: "Resident DJ spinning Afrobeats, Bongo, and coastal vibes.",
    day_of_week: "Saturday",
    event_date: null,
    is_recurring: true,
    created_at: new Date().toISOString(),
  },
];

const PLACEHOLDER_IMAGES: Record<string, string> = {
  garden:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  food_choma:
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  kids_playground:
    "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800&q=80",
  choma_area:
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  coffee_shop:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
  parking:
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80",
  signage:
    "https://images.unsplash.com/photo-1514933651103-005eec06cb04?w=800&q=80",
  bar_area:
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
  events:
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
};

export const FALLBACK_GALLERY: GalleryImage[] = (
  Object.entries(PLACEHOLDER_IMAGES) as [GalleryImage["category"], string][]
).map(([category, url], i) => ({
  id: `g${i}`,
  category,
  storage_path: url,
  caption: `${category.replace(/_/g, " ")} at Choma Zone Mtwapa Palms`,
  display_order: i,
  is_visible: true,
  created_at: new Date().toISOString(),
}));

export function getGalleryImageUrl(
  storagePath: string,
  supabaseUrl?: string
): string {
  if (storagePath.startsWith("http")) return storagePath;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/gallery/${storagePath}`;
  }
  const category = storagePath.includes("garden")
    ? "garden"
    : storagePath.includes("choma")
      ? "food_choma"
      : storagePath.includes("kids")
        ? "kids_playground"
        : storagePath.includes("coffee")
          ? "coffee_shop"
          : storagePath.includes("parking")
            ? "parking"
            : storagePath.includes("signage")
              ? "signage"
              : storagePath.includes("bar")
                ? "bar_area"
                : "garden";
  return PLACEHOLDER_IMAGES[category] ?? PLACEHOLDER_IMAGES.garden;
}

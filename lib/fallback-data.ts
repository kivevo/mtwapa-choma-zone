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
    hero_description: "Freshly roasted goat & beef, cold drinks, and open-air garden seating right on the Mombasa–Malindi Highway. Stop by for lunch, bring the family on Sunday, or pull in for a quick highway break.",
    hero_bg_image: "/hero-bg-kenyan.png",
    about_title: "Welcome to Choma Zone Mtwapa Palms",
    about_p1: "For over 8 years, Choma Zone Mtwapa Palms has been serving Mtwapa locals, Mombasa families, and upcountry travelers with authentic charcoal-grilled nyama choma, cold drinks, and friendly coastal service.",
    about_p2: "Located right opposite Galana Petrol Station, we offer a relaxed open garden setting, secure parking, a fenced kids' playground, and live music on weekends. Whether you're stopping by for a quick lunch, bringing the family, or hosting a get-together, we're glad to have you.",
    about_image_1: "/images/real/insta_real_2.jpg",
    about_image_2: "/images/real/insta_real_8.jpg",
    family_fun_title: "Fenced Playground & Family Dining",
    family_fun_desc: "Sundays at Choma Zone are all about family. While you enjoy fresh choma and cold drinks in the garden, the kids have plenty of room to play safely in our fenced playground.",
    family_fun_image: "/images/real/insta_real_7.jpg",
    stopover_title: "Convenient Highway Stopover",
    stopover_desc: "Traveling along the Mombasa–Malindi Highway? Turn in opposite Galana Petrol Station. We have secure parking, clean washrooms, hot coffee, pizzas, and quick meals to get you back on the road refreshed.",
    stopover_image: "/images/real/insta_real_4.jpg",
    footer_text: "Your favourite spot in Mtwapa for fresh nyama choma, family Sunday lunches, and open garden dining on the Mombasa–Malindi Highway."
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
    "/images/real/insta_real_8.jpg",
  food_choma:
    "/images/real/insta_real_2.jpg",
  kids_playground:
    "/images/real/insta_real_7.jpg",
  choma_area:
    "/images/real/fb_real_0.jpg",
  coffee_shop:
    "/images/real/insta_real_9.jpg",
  parking:
    "/images/real/insta_real_4.jpg",
  signage:
    "/images/real/insta_real_5.jpg",
  bar_area:
    "/images/real/insta_real_2.jpg",
  events:
    "/images/real/insta_real_10.jpg",
};

export const FALLBACK_GALLERY: GalleryImage[] = [
  {
    id: "g0",
    category: "garden",
    storage_path: "/images/real/insta_real_8.jpg",
    caption: "The ambience & the hideout — perfect for meetups and groups",
    description: null,
    display_order: 0,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g1",
    category: "food_choma",
    storage_path: "/images/real/insta_real_2.jpg",
    caption: "Maskani with a cold drink — nyama choma done right 🔥",
    description: null,
    display_order: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g2",
    category: "kids_playground",
    storage_path: "/images/real/insta_real_7.jpg",
    caption: "Perfect weekend family vibes — Food. Fun. Family. Memories that last!",
    description: null,
    display_order: 2,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g3",
    category: "signage",
    storage_path: "/images/real/insta_real_4.jpg",
    caption: "Our iconic I ❤️ MTWAPA sign — snap a photo and tag us!",
    description: null,
    display_order: 3,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g4",
    category: "garden",
    storage_path: "/images/real/insta_real_6.jpg",
    caption: "Your perfect photoshoot location — beautiful garden spaces & pool table",
    description: null,
    display_order: 4,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g5",
    category: "events",
    storage_path: "/images/real/insta_real_9.jpg",
    caption: "Meet. Connect. Enjoy — perfect for business meetings & luncheons",
    description: null,
    display_order: 5,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g6",
    category: "choma_area",
    storage_path: "/images/real/fb_real_0.jpg",
    caption: "Choma Zone Mtwapa Palms — an open garden restaurant, bar & choma zone",
    description: null,
    display_order: 6,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g7",
    category: "events",
    storage_path: "/images/real/insta_real_10.jpg",
    caption: "Reconnect. Laugh. Eat. Make Memories — one destination for the whole family",
    description: null,
    display_order: 7,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "g8",
    category: "garden",
    storage_path: "/images/real/insta_real_5.jpg",
    caption: "Right on the Mombasa–Malindi Highway — opposite Galana Petrol Station",
    description: null,
    display_order: 8,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
];

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

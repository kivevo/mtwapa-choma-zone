-- Seed data for Choma Zone Mtwapa Palms

insert into site_settings (business_name, tagline, opening_hours, happy_hour_text)
values (
  'Choma Zone Mtwapa Palms',
  'Open Garden Hospitality',
  '{"mon_fri": "10:00 - 23:00", "sat_sun": "08:00 - late"}'::jsonb,
  'Happy Hour daily 4PM - 7PM. Buy one get one on selected beers & cocktails.'
)
on conflict do nothing;

-- Menu categories
insert into menu_categories (name, slug, display_order, is_signature) values
  ('Nyama Choma', 'nyama-choma', 1, true),
  ('Kenyan Cuisine', 'kenyan-cuisine', 2, false),
  ('Pizza', 'pizza', 3, false),
  ('Coffee & Ice Cream', 'coffee-ice-cream', 4, false),
  ('Bar & Drinks', 'bar-drinks', 5, false)
on conflict (slug) do nothing;

-- Menu items (using category slugs)
insert into menu_items (category_id, name, description, price_kes, display_order)
select c.id, v.name, v.description, v.price_kes, v.display_order
from (values
  ('nyama-choma', 'Whole Goat Choma', 'Slow-roasted over charcoal — perfect for groups', 8500, 1),
  ('nyama-choma', '1/2 Kg Nyama Choma', 'Tender charcoal-grilled beef — our signature', 1200, 2),
  ('nyama-choma', '1 Kg Nyama Choma', 'The classic Mtwapa portion — share with friends', 2200, 3),
  ('nyama-choma', 'Mbuzi Choma (Goat)', 'Whole goat roast for celebrations', 7500, 4),
  ('kenyan-cuisine', 'Ugali & Sukuma Wiki', 'Hearty Kenyan staple with fresh greens', 350, 1),
  ('kenyan-cuisine', 'Pilau & Kachumbari', 'Coastal-spiced rice with fresh salad', 450, 2),
  ('kenyan-cuisine', 'Githeri Special', 'Traditional mix of maize and beans', 300, 3),
  ('pizza', 'Margherita', 'Fresh tomato, mozzarella, basil', 800, 1),
  ('pizza', 'Choma Special Pizza', 'Grilled meat, peppers, red onion', 1100, 2),
  ('coffee-ice-cream', 'Kenyan AA Coffee', 'Freshly brewed single origin', 250, 1),
  ('coffee-ice-cream', 'Soft Serve Ice Cream', 'Perfect for the kids (and you)', 200, 2),
  ('bar-drinks', 'Tusker Lager', 'Ice cold, straight from the garden bar', 350, 1),
  ('bar-drinks', 'Dawa Cocktail', 'Kenyan classic — honey, lime, vodka', 550, 2),
  ('bar-drinks', 'Passion Mojito', 'Tropical refreshment for sundowners', 500, 3)
) as v(slug, name, description, price_kes, display_order)
join menu_categories c on c.slug = v.slug
on conflict do nothing;

-- Event types
insert into event_types (name, description, icon_name, display_order) values
  ('Birthday Party', 'Celebrate in our lush garden with choma, music, and space for everyone.', 'cake', 1),
  ('Baby Shower', 'A beautiful outdoor setting for welcoming the little one.', 'baby', 2),
  ('Graduation Party', 'Mark the milestone with great food and a lively atmosphere.', 'graduation-cap', 3),
  ('Wedding Photoshoot', 'Golden-hour garden backdrops — makuti, palms, and the iconic sign.', 'camera', 4),
  ('Mbuzi Choma Party', 'The ultimate goat-roast celebration for your crew.', 'flame', 5),
  ('Family Fun Day', 'Themed entertainment for all ages in our supervised playground.', 'users', 6),
  ('Corporate Event', 'Luncheons, dinners, and end-of-year parties done right.', 'briefcase', 7),
  ('Business Meeting', 'Relaxed garden setting for productive gatherings.', 'presentation', 8),
  ('Family Gathering', 'Reunions, celebrations, and Sunday lunch with the whole clan.', 'heart', 9),
  ('Holiday Fun Activities', 'Seasonal events and school-holiday entertainment.', 'sparkles', 10)
on conflict do nothing;

-- Testimonials
insert into testimonials (customer_name, rating, comment, approved) values
  ('Wanjiku M.', 5, 'Best nyama choma on the North Coast! The garden setting at sunset is unbeatable. Our kids love the playground too.', true),
  ('James O.', 5, 'Perfect stopover on the Mombasa-Malindi highway. Great coffee, clean facilities, and the choma is always on point.', true),
  ('Sarah & David', 5, 'Hosted our daughter''s birthday here — the team handled everything. Rhumba night afterwards was the cherry on top!', true)
on conflict do nothing;

-- Events calendar
insert into events_calendar (title, description, day_of_week, is_recurring) values
  ('Sunday Family Fun Day', 'Live entertainment, kids activities, and special menu deals.', 'Sunday', true),
  ('Rhumba Night', 'Live band playing your favourite Rhumba hits.', 'Friday', true),
  ('Mugithi Night', 'Kikuyu benga and Mugithi — dance till late.', 'Saturday', true),
  ('DJ Weekend Sets', 'Resident DJ spinning Afrobeats, Bongo, and coastal vibes.', 'Saturday', true)
on conflict do nothing;

-- Gallery placeholders (storage paths — upload real images to Supabase Storage bucket "gallery")
insert into gallery_images (category, storage_path, caption, display_order) values
  ('garden', 'placeholders/garden-1.jpg', 'Lush makuti garden at golden hour', 1),
  ('garden', 'placeholders/garden-2.jpg', 'Open-air dining under the palms', 2),
  ('food_choma', 'placeholders/choma-1.jpg', 'Signature nyama choma off the grill', 1),
  ('food_choma', 'placeholders/choma-2.jpg', 'Fresh off the charcoal', 2),
  ('kids_playground', 'placeholders/kids-1.jpg', 'Supervised children''s play area', 1),
  ('choma_area', 'placeholders/grill-1.jpg', 'The choma station — where the magic happens', 1),
  ('coffee_shop', 'placeholders/coffee-1.jpg', 'Fresh Kenyan coffee & ice cream counter', 1),
  ('parking', 'placeholders/parking-1.jpg', 'Ample secure parking for travelers', 1),
  ('signage', 'placeholders/signage-1.jpg', 'The iconic I ❤️ MTWAPA sign — tag us!', 1),
  ('bar_area', 'placeholders/bar-1.jpg', 'Garden bar at sundown', 1),
  ('events', 'placeholders/events-1.jpg', 'Birthday celebration in the garden', 1)
on conflict do nothing;

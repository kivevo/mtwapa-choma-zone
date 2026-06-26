-- Add frontend_content JSONB column to site_settings

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS frontend_content jsonb DEFAULT '{
  "logo_text": "CZ",
  "logo_full_name": "Choma Zone",
  "logo_subtitle": "Mtwapa Palms",
  
  "hero_title_prefix": "Mtwapa''s Best",
  "hero_title_highlight": "Nyama Choma",
  "hero_title_suffix": "Open Garden Hospitality",
  "hero_description": "Charcoal-grilled perfection in a lush makuti garden on the Mombasa–Malindi Highway. Sundowners, family fun, events & the coast''s favourite stopover spot.",
  "hero_bg_image": "/hero-bg-kenyan.png",
  
  "about_title": "More Than Just a Restaurant",
  "about_p1": "Since opening our doors, Choma Zone Mtwapa Palms has become the coast''s premier destination for authentic charcoal-grilled meats and unforgettable open-air dining.",
  "about_p2": "Set within a lush, expansive garden, our venue combines the relaxed coastal breeze with the irresistible aroma of slowly roasting nyama choma. Whether you''re stopping by for a quick lunch, celebrating a milestone, or unwinding with sundowners, we provide the perfect backdrop.",
  "about_image_1": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  "about_image_2": "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
  
  "family_fun_title": "Family Fun Day",
  "family_fun_desc": "Every Sunday is Family Fun Day at Choma Zone. Enjoy live entertainment, face painting, and our dedicated kids'' play area while you relax with friends.",
  "family_fun_image": "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80",
  
  "stopover_title": "The Perfect Stopover",
  "stopover_desc": "Traveling along the Mombasa-Malindi highway? Pull into our secure, spacious parking for a refreshing break, great food, and clean facilities.",
  "stopover_image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  
  "footer_text": "Mtwapa''s premier destination for authentic nyama choma, family entertainment, and open garden hospitality."
}'::jsonb;

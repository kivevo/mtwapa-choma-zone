# Choma Zone Mtwapa Palms — Website

Modern marketing website with Supabase backend for **Choma Zone Mtwapa Palms**, an open garden restaurant, bar, and events venue on the Mombasa–Malindi Highway, Mtwapa.

## Tech Stack

- **Next.js 14** (App Router, TypeScript, Server Components)
- **Tailwind CSS** + custom brand tokens (charcoal, ember, palm, sand, gold)
- **Supabase** (Postgres, Auth, Storage, RLS)
- **Framer Motion**, **React Hook Form**, **Zod**, **shadcn-style UI**

## Quick Start

```bash
cd choma-zone-mtwapa
npm install
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site works in **demo mode** without Supabase — fallback data is used automatically.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in order via the SQL Editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`
3. Create a **public** Storage bucket named `gallery`
4. Copy your project URL and keys to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

5. Create an admin user in Supabase Auth (Authentication → Users → Add user)
6. Log in at `/admin`

## Admin Dashboard (`/admin`)

Authenticated owners can:

- View & update event inquiry status
- Read contact form messages
- Approve/hide testimonials
- Toggle menu item availability
- Edit site settings (hours, phones, happy hour text)
- View gallery image metadata

Upload real photos to the `gallery` Storage bucket and add rows to `gallery_images` via Supabase dashboard or extend the admin panel.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Single-page marketing site (all sections) |
| `/menu` | Full menu |
| `/events` | Event types + inquiry form |
| `/gallery` | Full filterable gallery |
| `/admin` | Owner login |
| `/admin/dashboard` | Content management |

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## Real Business Details

- **Location:** Opposite Galana Petrol Station, Mtwapa (Mombasa–Malindi Highway)
- **Phone:** 0711 333 090 / 0722 878 481
- **Email:** mtwapapalmsltd@gmail.com
- **Instagram:** [@mtwapapalms](https://www.instagram.com/mtwapapalms)
- **Facebook:** [ChomaZoneMtwapaPalm](https://www.facebook.com/ChomaZoneMtwapaPalm)
- **TikTok:** [@chomazonemtwapa](https://www.tiktok.com/@chomazonemtwapa)

## License

Private — Choma Zone Mtwapa Palms Ltd.

# Miracle Chenda Portfolio + KKTC Sub-Site

This workspace now has two linked experiences:

- `index.html` is the main Miracle portfolio.
- `kktc/` is the KKTC tourism-style sub-site.

## Portfolio Pages

- `index.html` - main portfolio home
- `assignments/index.html` - 10 Supabase-backed assignment slots
- `admin/index.html` - private project management screen

## KKTC Pages

- `kktc/index.html` - KKTC landing page
- `kktc/culture.html` - food, festivals, traditions, and lifestyle
- `kktc/shops.html` - shops, markets, crafts, sweets, and coffee
- `kktc/miracle.html` - Miracle's four-year experience and testimony section
- `kktc/gallery.html` - responsive image gallery with hover zoom effects
- `kktc/contact.html` - contact form, project note, and social links

## Shared Front-End Files

- `css/styles.css` - portfolio styling
- `js/portfolio.js` - portfolio navigation and Supabase project loading
- `css/style.css` - KKTC design system and responsive styling
- `js/script.js` - KKTC mobile navigation, scroll reveal, and fallback image handling
- `js/assignments.js` - Supabase assignment board loader
- `js/admin.js` - admin dashboard behavior
- `js/supabase-config.js` - live Supabase config
- `js/supabase-config.example.js` - example Supabase config
- `sql/seed-assignments.sql` - seed data and assignment schema support
- `sql/supabase-setup.sql` - Supabase schema and policies
- `assets/` - place your photos here

## Image Setup

The KKTC pages use `assets/placeholder.svg` by default, so the layout stays polished even before your photos are added.

Replace the placeholder sources in the KKTC HTML files with your own filenames when you're ready.

## Supabase Setup

The portfolio still uses Supabase for published projects in `admin/index.html`.

The new assignments board reads from a separate `assignments` table with `slot_number` values from 1 to 10.

For homework files, upload PDFs or documents into the `assignment-files` storage bucket, then paste the public file URL into the `file_url` column for the matching assignment row.

Run `sql/supabase-setup.sql` to create both tables and the required policies.

## Preview

Open `index.html` in a browser to preview the portfolio, or open `kktc/index.html` to view the Northern Cyprus sub-site.

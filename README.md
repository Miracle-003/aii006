# Miracle Chenda Portfolio + KKTC Sub-Site

This workspace now has two linked experiences:

- `index.html` is the main Miracle portfolio.
- `kktc.html` is the KKTC tourism-style landing page.

## Portfolio Pages

- `index.html` - main portfolio home
- `assignments.html` - 10 Supabase-backed assignment slots
- `admin.html` - private project management screen

## KKTC Pages

- `kktc.html` - KKTC landing page
- `culture.html` - food, festivals, traditions, and lifestyle
- `shops.html` - shops, markets, crafts, sweets, and coffee
- `miracle.html` - Miracle's four-year experience and testimony section
- `gallery.html` - responsive image gallery with hover zoom effects
- `contact.html` - contact form, project note, and social links

## Shared Front-End Files

- `styles.css` - portfolio styling
- `portfolio.js` - portfolio navigation and Supabase project loading
- `css/style.css` - KKTC design system and responsive styling
- `js/script.js` - KKTC mobile navigation, scroll reveal, and fallback image handling
- `assignments.js` - Supabase assignment board loader
- `assets/` - place your photos here

## Image Setup

The KKTC pages use `assets/placeholder.svg` by default, so the layout stays polished even before your photos are added.

Replace the placeholder sources in the KKTC HTML files with your own filenames when you're ready.

## Supabase Setup

The portfolio still uses Supabase for published projects in `admin.html`.

The new assignments board reads from a separate `assignments` table with `slot_number` values from 1 to 10.

For homework files, upload PDFs or documents into the `assignment-files` storage bucket, then paste the public file URL into the `file_url` column for the matching assignment row.

Run `supabase-setup.sql` to create both tables and the required policies.

## Preview

Open `index.html` in a browser to preview the portfolio, or open `kktc.html` to view the Northern Cyprus sub-site.

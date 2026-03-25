# Speak Arizona Website

## Project Overview
Next.js website for the Speak Arizona podcast — Arizona's public speaking, leadership, and communication podcast hosted by Rupesh Parbhoo. Powered by District 3 Toastmasters International.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 (`@tailwindcss/postcss`)
- **Package Manager**: pnpm
- **Content**: Markdown with gray-matter frontmatter
- **Markdown Rendering**: remark + remark-html
- **Email**: Resend (contact form)
- **Hosting**: Vercel (auto-deploys from GitHub push)
- **Fonts**: Inter (headings), Source Sans 3 (body) — loaded via `next/font/google`

## Project Structure
```
speak-arizona-website/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── about/page.tsx        # About — story, host, team
│   │   ├── news/page.tsx         # Blog listing (featured + grid)
│   │   ├── news/[slug]/page.tsx  # Individual blog post
│   │   ├── contact/page.tsx      # Contact form
│   │   ├── legal/page.tsx        # Terms, privacy, copyright (noindex)
│   │   ├── api/contact/route.ts  # POST endpoint (Resend)
│   │   ├── layout.tsx            # Root layout (Header/Footer, fonts, metadata)
│   │   ├── globals.css           # Tailwind theme, custom styles
│   │   └── sitemap.ts            # Dynamic XML sitemap
│   ├── components/
│   │   ├── Header.tsx            # Nav with yellow marquee banner
│   │   ├── Footer.tsx            # Links, listen buttons, copyright
│   │   ├── LatestVideo.tsx       # Latest YouTube video embed
│   │   ├── EpisodeCarousel.tsx   # Scrollable episode cards
│   │   ├── StickyTeamCards.tsx   # Sticky team member profiles
│   │   ├── ListenSubscribe.tsx   # Platform CTA buttons
│   │   ├── FaqAccordion.tsx      # Expandable FAQ
│   │   ├── AnimateOnScroll.tsx   # Scroll-triggered fade-in
│   │   └── MobileMenu.tsx        # Mobile hamburger nav
│   └── lib/
│       └── blog.ts               # Blog utilities (getAllPosts, getPostBySlug)
├── content/
│   └── blog/                     # Markdown blog posts
├── public/
│   └── images/                   # All images (WebP)
├── .env.local                    # YOUTUBE_API_KEY, RESEND_API_KEY
├── next.config.ts
├── package.json
└── CLAUDE.md                     # This file
```

## Development
```bash
cd "/Users/mariefeutrier/Sites/speak-arizona-website"
pnpm run dev              # Starts on default port (3000 or next available)
pnpm run build            # Production build
pnpm run lint             # ESLint
```
**Local Dev:** http://localhost:3000 (or next available port)

## Deployment
```bash
git add [files]
git commit -m "message"
git push origin main      # Vercel auto-deploys from GitHub
```
**Production:** https://speakarizona.com
**GitHub:** https://github.com/DodoBird05/speak-arizona-website (DodoBird05 account)

## Brand Colors
| Tailwind Name | Hex | Usage |
|---------------|-----|-------|
| `blue` | `#004165` | Primary brand, links, buttons |
| `blue-light` | `#005a8c` | Hover states |
| `yellow` | `#F2DF74` | Accent, badges, banner, CTAs |
| `yellow-light` | `#f7edb3` | Light yellow variant |
| `text` | `#1a1a1a` | Body text |
| `text-light` | `#555555` | Secondary text |
| `gray-light` | `#f5f5f5` | Section backgrounds |

## Brand Gradient
Two gradient images replace solid blue in hero sections and cards:
- **`/images/gradient-square.webp`** — used in hero sections (news, about, blog posts)
- **`/images/gradient-card.webp`** — used in team cards, audience tiles
- Applied via `backgroundImage: "url('/images/gradient-square.webp')"` with `backgroundSize: cover`

## Blog Posts
- **Content**: `/content/blog/*.md` (markdown with gray-matter frontmatter)
- **Route**: `/news/[slug]`
- **Listing**: `/news` — latest post as featured hero, remaining as cards
- **Rendering**: `src/lib/blog.ts` — remark converts markdown to HTML
- **External links**: Automatically get `target="_blank" rel="noopener noreferrer"`
- **Default OG image**: Posts without a featured image use `/images/speak-arizona-default-og.webp`

### After creating a blog post
- Always start the dev server and open the post in the browser for preview before considering it done.

### Blog Frontmatter
```yaml
---
title: "Post Title"
date: "March 15, 2026"
excerpt: "Short summary for listings and meta description"
tag: "Leadership"
guest: "Guest Name (optional — omit for host-authored posts)"
image: "/images/featured-image.webp"
imageAlt: "Descriptive alt text"
youtubeUrl: "https://youtu.be/VIDEO_ID (optional — embeds at top of post)"
quote: "Pull quote from the episode (optional — displayed between video and excerpt)"
cardImage: "/images/card-image.webp (optional — separate image for news listing cards, falls back to image)"
cardImageAlt: "Alt text for card image (optional)"
---
```

### Blog Image Sizing
- **Featured image on blog post page**: 5:4 aspect ratio, `object-cover object-top`
- **Featured image on news listing (hero)**: 5:4 on desktop (in two-column grid), 16:9 on mobile
- **Card thumbnails (desktop only)**: 5:4, 192px wide, hidden on mobile
- **Inline images in blog content**: max-height 500px on desktop (`blog-content img` in globals.css), auto on mobile

## Image Optimization
- **Format**: All images must be WebP
- **Convert command**: `cwebp -q 85 -resize 800 0 "source.jpg" -o "public/images/output.webp"`
- **Hero/OG images**: resize to 1200px wide
- **Blog/content images**: resize to 800px wide
- **Location**: All in `/public/images/` (flat directory, no subfolders)
- **Naming convention**: descriptive slugs with context (e.g., `rupesh-parbhoo-teaching-yoga.webp`)
- **Photo credits**: Marie Feutrier photos include `-by-marie-feutrier` in filename
- **HEIC conversion**: `sips -s format jpeg source.HEIC --out /tmp/temp.jpg` then `cwebp`
- **Rotation fix for HEIC**: add `-r 90` to sips if photo comes out sideways

## Contact Form
- **Page**: `/contact` (client component)
- **API**: POST `/api/contact` — sends email via Resend to `podcast@aztoastmasters.org`
- **Subjects**: General Inquiry, Guest Request, Sponsorship, Feedback
- **Env var**: `RESEND_API_KEY` in `.env.local`

## YouTube Integration
- **Component**: `LatestVideo.tsx` — fetches latest uploads from YouTube channel
- **API**: YouTube Data API v3, cached for 1 hour (ISR revalidation)
- **Env var**: `YOUTUBE_API_KEY` in `.env.local`
- **Filters**: Excludes Shorts (by duration)

## SEO
- **Title template**: `"%s | Speak Arizona Podcast"`
- **Default title**: "Speak Arizona | Public Speaking & Communication Skills Podcast"
- **Canonical**: `https://speakarizona.com`
- **Sitemap**: Dynamic via `src/app/sitemap.ts`
- **Schema markup**:
  - Organization + PodcastSeries (root layout)
  - Person schema (about page — Rupesh Parbhoo)
  - Article schema (each blog post)
- **noindex pages**: `/legal`, `/contact`

## Social Media Links
| Platform | URL |
|----------|-----|
| YouTube | https://www.youtube.com/@speakarizona |
| Instagram | https://www.instagram.com/speakarizona/ |
| LinkedIn | https://www.linkedin.com/showcase/speak-arizona/ |
| Facebook | https://www.facebook.com/people/Speak-Arizona/61587110443189/ |
| TikTok | https://www.tiktok.com/@speakarizona |
| Spotify | https://open.spotify.com/show/speak-arizona |
| Apple Podcasts | https://podcasts.apple.com/us/podcast/speak-arizona |
| RSS | https://feed.podbean.com/speakarizona/feed.xml |

## Desktop / Mobile Rules
- **"on desktop"** = only change `md:` breakpoints and up. Do NOT touch mobile.
- **"on mobile"** = only change below `md:`. Do NOT touch desktop.
- **Never bleed changes across breakpoints** unless explicitly asked to change both.

## Key Conventions
- Blog posts use `tag` field (not `category`)
- Blog posts use `guest` field (omit for host-authored content — do NOT show "Guest: Rupesh Parbhoo")
- All images are WebP, optimized for web before adding
- Brand gradient images (`gradient-square.webp`, `gradient-card.webp`) used instead of solid `bg-blue` on hero sections and cards
- Tagline: "Courageous conversations to lead authentically, inspire action, and find your voice."

---
*This file serves as persistent memory for Claude Code across sessions.*

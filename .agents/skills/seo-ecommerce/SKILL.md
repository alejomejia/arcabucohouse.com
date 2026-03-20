---
name: seo-ecommerce
description: SEO rules and patterns for this Next.js + Shopify ecommerce site. Apply when writing metadata, JSON-LD, sitemaps, robots, or any SEO-related code.
metadata:
  version: "1.0.0"
  scope: "internal"
---

# SEO — Ecommerce (Next.js + Shopify)

## Core Architecture

All SEO utilities live in `src/lib/seo/metadata.ts`. Import from there, never inline SEO logic in page files.

```ts
import {
  generateProductMetadata,
  generateProductJsonLd,
  generateProductBreadcrumbJsonLd,
  generateCategoryMetadata,
  generateCategoryBreadcrumbJsonLd,
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from '@/lib/seo/metadata'
```

## Metadata Rules

### Title Template
- Root layout uses `template: '%s | Arcabuco House'`
- Page-level `title` strings should be short and keyword-first (e.g. `"Handwoven Wool Rug"` not `"Product: Handwoven Wool Rug"`)
- Product and category titles come from **Shopify SEO fields** (set in Shopify admin), not hardcoded

### Canonical URLs
- Always set `alternates.canonical` on product and category pages
- Pattern: `${baseUrl}/product/${handle}` and `${baseUrl}/category/${handle}`
- Import `baseUrl` from `@/lib/integrations/utils`

### Robots
- Products tagged `nextjs-frontend-hidden` → `index: false, follow: false`
- All other product and category pages → `index: true, follow: true`
- Set `googleBot['max-image-preview']: 'large'` and `max-snippet: -1` for rich snippets

### OpenGraph & Twitter
- Every page needs `openGraph.title`, `openGraph.description`, `openGraph.url`
- Product pages: use `featuredImage` as OG image (comes from Shopify)
- Category pages: no image (until a collection image is added to Shopify)
- Home page: needs a static OG image at `/public/og-image.jpg` (1200×630px)
- Always include `twitter.card: 'summary_large_image'`

## JSON-LD Structured Data

### Global (root layout)
Two scripts rendered on every page:
- `Organization` — company identity, contact, social links
- `WebSite` — site name + SearchAction for Sitelinks Search Box

### Product pages
Two scripts:
- `Product` — name, description, image, offers (one per variant), brand, seller
- `BreadcrumbList` — Home > [Category] > Product (category derived from `category-*` collection)

### Category pages
One script:
- `BreadcrumbList` — Home > Category

### Adding a new page type
1. Add a `generate*JsonLd()` function to `src/lib/seo/metadata.ts`
2. Add a `generate*Metadata()` function for the `Metadata` object
3. Import and call both in the page file
4. Inline as `<script type="application/ld+json">` in the JSX

## Sitemap (`src/app/sitemap.ts`)

- Automatically served at `/sitemap.xml` by Next.js
- Sources: static routes + `getCollections()` (filtered to `category-*`) + `getProducts()`
- Priority: home=1.0, products=0.9, categories=0.7, search=0.8, legal=0.2
- `changeFrequency`: products/categories=`weekly`, static=`daily`/`yearly`
- After adding a new static route, add it manually to the `staticRoutes` array

## robots.txt (`src/app/robots.ts`)

- Disallow: `/api/`, `/_next/`, `/cart`, `/checkout`, `/account`, `/orders`, `/dev`
- AI bots (GPTBot, ClaudeBot, PerplexityBot, anthropic-ai) explicitly allowed on product/category/search pages
- References sitemap at `${baseUrl}/sitemap.xml`

## llms.txt (`public/llms.txt`)

Plain-text file at `/llms.txt` for LLM crawlers following the llmstxt.org spec.
- Describes the store, products, and how to buy
- Explains URL patterns so LLMs can construct product/category links
- Update the TODO placeholders when: contact info, social links, and category list are confirmed

## Category URL Pattern

Category Shopify collections use the prefix `category-` in their handle:
- Shopify handle: `category-rugs` → URL: `/category/rugs`
- Always strip the `category-` prefix in URLs: `handle.replace(/^category-/, '')`

## Shopify SEO Fields

Product and collection meta titles/descriptions are set in the **Shopify admin**:
- Products: Admin > Products > [Product] > Search engine listing > Edit website SEO
- Collections: Admin > Collections > [Collection] > Search engine listing > Edit website SEO
- If Shopify SEO fields are empty, the code falls back to `product.title` / `product.description`

## Checklist for New Pages

- [ ] `generateMetadata()` export with title, description, canonical, robots, OG, Twitter
- [ ] JSON-LD script(s) inlined in JSX
- [ ] Route added to `src/app/sitemap.ts` if static
- [ ] `robots.ts` disallow list updated if needed

## Anti-Patterns ❌

- ❌ Don't inline metadata objects larger than ~5 lines directly in page files — use `src/lib/seo/metadata.ts`
- ❌ Don't hardcode `siteName` or `baseUrl` — import from `@/lib/utils/config` and `@/lib/integrations/utils`
- ❌ Don't use `og:product` as OG type — Next.js Metadata API doesn't support it; use `website`
- ❌ Don't forget `alternates.canonical` on paginated or filtered URLs to prevent duplicate content
- ❌ Don't add `/dev` route to sitemap or allow Googlebot to index it
- ❌ Don't set `index: false` on pages without a business reason — every indexed page is an acquisition opportunity

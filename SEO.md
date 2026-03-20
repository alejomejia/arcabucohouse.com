# SEO Production Checklist

Step-by-step guide to ensure Arcabuco House is properly indexed by Google,
positioned in search results, and discoverable by LLM-powered shopping assistants.

---

## Phase 1 — Pre-launch (Before Going Live)

### 1.1 Environment Variables
- [ ] Set `NEXT_PUBLIC_BASE_URL` to the production domain (e.g. `https://arcabucohouse.com`)
- [ ] Set `SITE_NAME` to `Arcabuco House`

### 1.2 Shopify SEO Fields
Fill these in the Shopify admin for every product and category before launch:
- [ ] **Products**: Admin → Products → [Product] → "Search engine listing" → Edit website SEO
  - Meta title: `[Product Name] — Arcabuco House` (50–60 chars)
  - Meta description: unique, keyword-rich, 120–160 chars
- [ ] **Collections**: Admin → Collections → [Collection] → "Search engine listing"
  - Meta title and description for each `category-*` collection
- [ ] **Store**: Admin → Online Store → Preferences → Homepage title & description
  (Only relevant if the Shopify storefront is also used — in this project the Next.js frontend owns metadata)

### 1.3 OG / Social Images
- [ ] Create a 1200×630px site-level OG image (`/public/og-image.jpg`) featuring the brand logo and tagline
- [ ] Update `src/app/page.tsx` `openGraph.images` to reference it
- [ ] Verify product `featuredImage` assets are high-quality (min 1200px wide)

### 1.4 Structured Data Placeholders
Complete the `TODO` items in `src/lib/seo/metadata.ts`:
- [ ] `generateOrganizationJsonLd()` — add real logo URL, telephone, and `sameAs` social URLs
- [ ] Update `public/llms.txt` — replace all `[PLACEHOLDER]` values with real URLs and contact info

### 1.5 robots.txt & Sitemap
- [ ] Verify `/robots.txt` is accessible in production and disallows the correct paths
- [ ] Verify `/sitemap.xml` is accessible and lists all product + category URLs

---

## Phase 2 — Launch Day

### 2.1 Google Search Console
- [ ] Go to [search.google.com/search-console](https://search.google.com/search-console)
- [ ] Add property: select "URL prefix" and enter `https://arcabucohouse.com`
- [ ] Verify ownership via HTML tag method (add the `<meta name="google-site-verification">` tag to `src/app/layout.tsx` metadata)
- [ ] Submit sitemap: Sitemaps → Add new sitemap → `https://arcabucohouse.com/sitemap.xml`

### 2.2 Google Merchant Center (for Shopping Ads)
- [ ] Create a Merchant Center account at [merchants.google.com](https://merchants.google.com)
- [ ] Connect Shopify store via the Google & YouTube channel app in Shopify
- [ ] Submit product feed (Shopify auto-generates this via the Google channel)
- [ ] Enable "Shopping" in Google Ads once the feed is approved

### 2.3 Bing Webmaster Tools
- [ ] Go to [bing.com/webmasters](https://www.bing.com/webmasters)
- [ ] Add site and submit sitemap
- [ ] IndexNow is supported — verify the Bing plugin or use `next-sitemap` with IndexNow support

---

## Phase 3 — Post-launch (First 30 Days)

### 3.1 Rich Result Testing
- [ ] Test product pages: [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
  - Should show: Product rich result with price and availability
  - Should show: Breadcrumb
- [ ] Test home page: verify Organization and WebSite (Sitelinks Search Box) structured data
- [ ] Fix any errors flagged by the Rich Results Test before requesting indexing

### 3.2 Core Web Vitals
- [ ] Run PageSpeed Insights: [pagespeed.web.dev](https://pagespeed.web.dev)
  - Target: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Ensure product images use `next/image` with `priority` on above-the-fold images
- [ ] Verify AVIF/WebP is served (configured in `next.config.ts`)

### 3.3 Crawl Coverage
- [ ] In Search Console → Coverage: confirm all product and category pages are indexed
- [ ] Fix any "Crawled - not indexed" or "Discovered - not indexed" issues
- [ ] Request indexing manually for high-priority pages via Search Console URL inspection

### 3.4 Internal Linking
- [ ] Confirm every category page links to its products
- [ ] Confirm product pages link to related products (already implemented)
- [ ] Add a footer or nav sitemap linking to all categories for crawlability

---

## Phase 4 — Ongoing

### 4.1 Content & Keywords
- [ ] Ensure each product has a unique description (not duplicated from Shopify default)
- [ ] Use long-tail keywords in product meta descriptions (e.g. "handwoven wool rug Colombia" not just "wool rug")
- [ ] Add a blog or editorial section (e.g. `/journal`) for informational content to attract top-of-funnel traffic

### 4.2 Link Building
- [ ] Reach out to home décor and interior design publications for editorial coverage
- [ ] Submit to artisan goods directories and Latin American design platforms
- [ ] Partner with interior designers who can feature products on their sites

### 4.3 Sitemap Freshness
- [ ] Sitemap is dynamically generated from Shopify — new products and categories appear automatically
- [ ] After publishing new products, trigger a crawl via Search Console → Sitemaps → Refresh

### 4.4 LLM Discoverability
- [ ] Verify `/llms.txt` is publicly accessible
- [ ] Update `llms.txt` whenever new categories or major products are added
- [ ] Monitor referral traffic from AI assistants (track via UTM parameters or Umami analytics)
- [ ] Consider adding `<meta name="robots" content="index, follow, max-snippet:-1">` as a confirmation signal

### 4.5 Shopify Webhook Revalidation
- [ ] Confirm the `/api/revalidate` webhook is registered in Shopify Admin:
  - Admin → Settings → Notifications → Webhooks
  - Events: `products/update`, `products/create`, `products/delete`, `collections/update`
  - URL: `https://arcabucohouse.com/api/revalidate`
  - Secret: matches `SHOPIFY_REVALIDATION_SECRET` env var
- [ ] This ensures the sitemap and product pages are updated within minutes of Shopify changes

---

## LLM Shopping Discoverability (ChatGPT, Claude, Perplexity, etc.)

The goal is to let users buy directly from LLM client conversations.

### How it works
1. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) index `/llms.txt` and product pages
2. When a user asks an LLM "I need a handwoven rug from Colombia", the LLM surfaces your products
3. The LLM provides a direct link to the product page where the user completes checkout

### Actions
- [ ] `public/llms.txt` is live and updated — this is the primary signal for LLMs
- [ ] Product JSON-LD includes `offers` with `price`, `priceCurrency`, `availability`, and `url`
  — this allows LLMs to show structured product info in responses
- [ ] robots.txt explicitly allows GPTBot, ClaudeBot, anthropic-ai, PerplexityBot
- [ ] Keep product descriptions conversational and descriptive — LLMs rank natural language
- [ ] Consider adding a `/api/products` public endpoint (read-only) in the future
  for AI agents that can execute purchases via API (emerging standard)

### Future: AI-native Commerce
- Monitor the [Anthropic Computer Use API](https://docs.anthropic.com) and OpenAI Actions
  for opportunities to integrate direct-purchase flows from LLM interfaces
- The Shopify Storefront API (already in use) is the foundation for this

---

## Quick Reference: Key URLs

| Resource | URL |
|---|---|
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |
| LLMs | `/llms.txt` |
| Search | `/search` |
| Product | `/product/[handle]` |
| Category | `/category/[handle]` |

## Quick Reference: Tools

| Tool | Purpose |
|---|---|
| [Google Search Console](https://search.google.com/search-console) | Indexing, crawl stats, rich results |
| [Rich Results Test](https://search.google.com/test/rich-results) | Validate JSON-LD structured data |
| [PageSpeed Insights](https://pagespeed.web.dev) | Core Web Vitals |
| [Schema Markup Validator](https://validator.schema.org) | Validate Schema.org JSON-LD |
| [Bing Webmaster Tools](https://www.bing.com/webmasters) | Bing indexing |
| [Google Merchant Center](https://merchants.google.com) | Shopping ads product feed |
| [Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/) | Full site crawl audit |

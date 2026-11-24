# İzmir Balkon

Mobile-first Turkish landing page for İzmir cam balkon enquiries. A real-business pilot destination for GetSidely. Phone: **0542 355 12 13**.

Production: https://izmirbalkon.com · Vercel fallback: https://izmir-balkon.vercel.app

`www.izmirbalkon.com` is configured to redirect permanently to the apex domain. DNS and deployment notes are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Run

Requires Node 22+. The static pages have no client framework dependencies. Vercel middleware uses the official DataFast AI crawler SDK.

```sh
npm ci         # install the pinned server-side crawler SDK
npm run dev     # http://127.0.0.1:4173
npm test        # consent, conversion, page and review checks
npm run build  # static output in dist/
```

Import this repository into Vercel. `vercel.json` specifies the build command and output directory. The pages also work on any static host; AI crawler measurement and Markdown content negotiation require the Vercel middleware or an equivalent server integration.

## How the site is built

Content lives in `scripts/facts.mjs` and `public/reviews-data.js`. Templates live in `src/`. `scripts/render.mjs` turns them into every HTML page, Markdown mirror, `llms.txt`, JSON-LD block and the sitemap, so people and AI agents always read the same facts. Change a fact in one place and every format follows.

## Content and interaction

- **One task per screen.** The hero holds a photo-led quote wizard that keeps one size through every step with the page's service already selected and one blue button. Two more questions (size, district) open a ready WhatsApp draft. Nothing is sent or stored by the site.
- **CTA rules.** Blue starts the quote, green opens WhatsApp, outlined calls. The mobile dock is visible from the first screen with named WhatsApp and telephone actions. It reserves bottom space and steps aside for the software keyboard; very short viewports use the normal page links. Buttons further down open the same wizard in a sheet, so visitors keep their place.
- **Service pages.** `/cam-balkon`, `/kis-bahcesi`, `/pergola` and `/dograma` each have their own title, headline, photo, summary and FAQ. Point each ad group at its own page. `/bilgi` is the plain answer page for search engines and agents.
- **Proof.** Selling points are customers' own words, checked against `public/reviews-data.js` by `npm test`. All 21 original reviews remain available: short verbatim excerpts lead selected cards, with the original text and service record in a native disclosure. The hero rotates short excerpts every four seconds, with pause and reduced-motion support.
- **Claims.** 15+ years and 200+ customers are the owner's statements (see `docs/ASSETS.md`). No aggregate rating is published in structured data. No guarantee durations, discounts, response times or installation times are invented.
- **Photos.** The "Kendi işlerimizden" gallery holds only the owner's own work; a test enforces this. Other marketing photos are Unsplash stock, disclosed on the privacy page.

## For AI agents and search

- Everything important is in the initial HTML; no JavaScript is needed to read it.
- `/llms.txt` is a short described index, `/llms-full.txt` is everything in one file. Both are linked from the footer and page metadata.
- Every page has a Markdown mirror, advertised with `<link rel="alternate">` and an HTTP `Link` header. `middleware.js` also serves it to clients sending `Accept: text/markdown`. Browsers never ask for it.
- JSON-LD covers the business, 30 districts, services, FAQ and breadcrumbs, and `/bilgi` adds the reviews. The same facts are repeated in visible text, because some converters drop script blocks.
- `public/ui.js` registers experimental WebMCP tools when the browser supports them. They stay inactive on the live site until an origin trial token is added.
- After a deploy with changed pages, run `npm run indexnow` to notify Bing and other IndexNow engines.

## GetSidely measurement

Google Ads starts in cookieless, denied mode on a new visit. A saved refusal prevents loading it. Phone and wizard WhatsApp clicks are primary conversion actions; other WhatsApp clicks are secondary. DataFast uses cookieless measurement by default with separate contact and wizard progress goals. GA4 is not configured. See [docs/PILOT.md](docs/PILOT.md) for the activation steps and what counts as a conversion. Do not tell Sidely that a button click is a qualified lead or a sale.

Set public IDs only in `public/tracking-config.js`. An optional checkbox below the quote card makes Google attribution consent reachable without an entry banner. Full ad attribution is opt-in and cookieless DataFast can be switched off under the footer’s “Ölçüm tercihleri”. Never commit credentials, developer tokens, customer lists, or `.env` files.

The canonical domain is `izmirbalkon.com`, registered in the owner's GoDaddy account and connected to the Vercel project. Verify HTTPS and both domain variants before using the site as an ad destination.

## Assets

Manrope is self-hosted under the SIL Open Font License; see `public/assets/OFL-Manrope.txt`. Photo and review provenance are documented in [docs/ASSETS.md](docs/ASSETS.md).

## 23 November landing update

The home wizard remains intact. Real completed sliding work now leads the cam balcony hero; reviews appear before the work gallery on the home and service pages. The owner-approved indicative sliding-system range is 5,000–6,500 TRY/m², with thick profiles; tax, glass and installation scope remain subject to the written quote.

`/cam-balkon-hesaplama` is a separate I/L/U advertising variant. It sums only open facade widths and multiplies by glass height. Hidden sides never contribute, and changing shape does not change the form height. `/cam-balkon` keeps the short known-area calculator. Both offer a direct photo enquiry when measurements are unknown. Pergola and winter garden retain their explicitly scoped external comparison ranges; they are not guaranteed business quotes.

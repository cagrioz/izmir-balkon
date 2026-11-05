# İzmir Balkon

Mobile-first Turkish landing page for İzmir cam balkon enquiries. A real-business pilot destination for GetSidely. Phone: **0542 355 12 13**.

Production: https://izmirbalkon.com · Vercel fallback: https://izmir-balkon.vercel.app

`www.izmirbalkon.com` is configured to redirect permanently to the apex domain. DNS and deployment notes are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Run

Requires Node 22+. No package installation or runtime dependencies.

```sh
npm run dev     # http://127.0.0.1:4173
npm test        # consent, conversion, page and review checks
npm run build  # static output in dist/
```

Import this repository into Vercel. `vercel.json` specifies the build command and output directory. The page also works on any static host.

## How the site is built

Content lives in `scripts/facts.mjs` and `public/reviews-data.js`. Templates live in `src/`. `scripts/render.mjs` turns them into every HTML page, Markdown mirror, `llms.txt`, JSON-LD block and the sitemap, so people and AI agents always read the same facts. Change a fact in one place and every format follows.

## Content and interaction

- **One task per screen.** The hero holds a photo-led quote wizard that keeps one size through every step with the page's service already selected and one blue button. Two more questions (size, district) open a ready WhatsApp draft. Nothing is sent or stored by the site.
- **CTA rules.** Blue starts the quote, green opens WhatsApp, outlined calls. The mobile dock appears only after the wizard scrolls away and hides wherever a section on screen has its own action. Buttons further down open the same wizard in a sheet, so visitors keep their place.
- **Service pages.** `/cam-balkon`, `/kis-bahcesi`, `/pergola` and `/dograma` each have their own title, headline, photo, summary and FAQ. Point each ad group at its own page. `/bilgi` is the plain answer page for search engines and agents.
- **Proof.** Selling points are customers' own words, checked against `public/reviews-data.js` by `npm test`. All 21 reviews are published verbatim: 6 first, 15 behind a native disclosure.
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

The Google Ads base tag is configured and loads only after consent. **Conversion action labels are still pending; GA4 is not configured.** See [docs/PILOT.md](docs/PILOT.md) for the activation steps and what counts as a conversion. Do not tell Sidely that a button click is a qualified lead or a sale.

Set public IDs only in `public/tracking-config.js`. Google scripts load only after opt-in. Never commit credentials, developer tokens, customer lists, or `.env` files.

The canonical domain is `izmirbalkon.com`, registered in the owner's GoDaddy account and connected to the Vercel project. Verify HTTPS and both domain variants before using the site as an ad destination.

## Assets

Manrope is self-hosted under the SIL Open Font License; see `public/assets/OFL-Manrope.txt`. Photo and review provenance are documented in [docs/ASSETS.md](docs/ASSETS.md).

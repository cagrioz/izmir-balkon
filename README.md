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

## Content and interaction

- **One task per screen.** The hero holds one thing to do: a three-tap quote wizard (service, approximate size, district) that opens a ready WhatsApp draft. The phone number stays visible as plain text. Nothing is sent or stored by the site.
- **CTA rules.** Blue is the page's one action. Green appears only where WhatsApp actually opens. The mobile dock (WhatsApp + phone) appears only after the wizard scrolls away and hides at the closing section. On phones the dock replaces in-flow buttons; on desktop the sticky header button and the price card carry the action. Further-down buttons open the same wizard in a sheet, so visitors keep their place.
- **Ad landing pages.** `/cam-balkon`, `/kis-bahcesi`, `/pergola` and `/dograma` render from `public/index.html` through `scripts/variants.mjs`, each with its own headline, hero photo, title and a wizard that starts on step 2. Point each ad group at its own page. Edit the page in `index.html`; `npm test` fails if a variant's markers go missing.
- **Proof.** Selling points are customers' own words, checked against `public/reviews-data.js` by `npm test`. All 21 reviews are published verbatim: 6 first, 15 behind a native disclosure.
- **Photos.** Stock photos carry a visible "Temsili" label. The "Yaptığımız işlerden" gallery holds only the owner's own work; a test enforces this.
- Local image and font assets, no third-party dependencies on initial page load.
- No invented reviews, customer counts, guarantee durations, discounts, response times or installation times. No aggregate rating is invented.

## GetSidely measurement

Measurement hooks are implemented, but **no live Google Ads/GA4 account is configured**. See [docs/PILOT.md](docs/PILOT.md) for the activation steps and what counts as a conversion. Do not tell Sidely that a button click is a qualified lead or a sale.

Set public IDs only in `public/tracking-config.js`. Google scripts load only after opt-in. Never commit credentials, developer tokens, customer lists, or `.env` files.

The canonical domain is `izmirbalkon.com`, registered in the owner's GoDaddy account and connected to the Vercel project. Verify HTTPS and both domain variants before using the site as an ad destination.

## Assets

DM Sans is self-hosted under the SIL Open Font License; see `public/assets/OFL-DM-Sans.txt`. Photo and review provenance are documented in [docs/ASSETS.md](docs/ASSETS.md).

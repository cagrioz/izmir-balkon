# İzmir Balkon

Mobile-first Turkish landing page for İzmir cam balkon enquiries. A real-business pilot destination for GetSidely. Phone: **0542 355 12 13**.

Production: https://izmirbalkon.com · Vercel fallback: https://izmir-balkon.vercel.app

`www.izmirbalkon.com` is configured to redirect permanently to the apex domain. DNS and deployment notes are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Run

Requires Node 22+. No package installation or runtime dependencies.

```sh
npm run dev     # http://127.0.0.1:4173
npm test        # consent and conversion behavior
npm run build  # static output in dist/
```

Import this repository into Vercel. `vercel.json` specifies the build command and output directory. The page also works on any static host.

## Content and interaction

- Six telephone links, including the persistent mobile call action.
- Direct WhatsApp links and a district/system message composer. This opens a draft; it does not send a message or save a lead.
- Free survey offer, system explanations, process, district selection and accessible native FAQ disclosures.
- Local image/font assets, WebP hero, no third-party dependencies on initial page load.
- No invented reviews, customer counts, guarantee duration, discounts or installation times.
- The AI-generated balcony image is visibly labelled illustrative. Replace it with owned customer work when available.

## GetSidely measurement

Measurement hooks are implemented, but **no live Google Ads/GA4 account is configured**. See [docs/PILOT.md](docs/PILOT.md) for the activation steps and what counts as a conversion. Do not tell Sidely that a button click is a qualified lead or a sale.

Set public IDs only in `public/tracking-config.js`. Google scripts load only after opt-in. Never commit credentials, developer tokens, customer lists, or `.env` files.

The canonical domain is `izmirbalkon.com`, registered in the owner's GoDaddy account and connected to the Vercel project. Verify HTTPS and both domain variants before using the site as an ad destination.

## Assets

Manrope is self-hosted under the SIL Open Font License; see `public/assets/OFL-Manrope.txt`. Hero artwork and prompt provenance are documented in [docs/ASSETS.md](docs/ASSETS.md).

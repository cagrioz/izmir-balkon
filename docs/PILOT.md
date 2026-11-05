# GetSidely × İzmir Balkon pilot

## Scope and current state

The site is the acquisition destination. GetSidely manages the connected Google Ads account separately. No campaign has been created, enabled or funded by this repository. No Sidely API key or Google Ads credential is embedded. Live conversion measurement is off until the actual public tag ID and action labels are supplied.

## Activation

1. Connect the intended Google Ads account in getsidely.com and use the verified site domain as the final URL.
2. Create separately named Google Ads website conversion actions for `phone_click` and `whatsapp_click`; keep them secondary intent signals during initial validation. Supply each action's real label and the `AW-…` ID in `public/tracking-config.js`. Add a real GA4 `G-…` ID only if wanted. The labels in tests are fictitious and never shipped as configuration.
3. Check consent acceptance and denial in Google Tag Assistant on the live domain. Confirm one action per real click, correct destination/label, and no Google requests before consent. Ads account-side validation cannot be completed without the actual account and identifiers.
4. Enable Google Ads auto-tagging. Keep query parameters through any domain redirects. Optional final-URL suffix: `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}`. Review the suffix and location targeting inside the real campaign before launch.
5. The chosen deployment must be eligible for commercial use. No paid hosting upgrade is made automatically.
6. Confirm business/legal identity, real product availability, contact handling, and approved daily budget before the campaign launch.

## Events and honest reporting

| Event | Actual meaning | Not proof of |
| --- | --- | --- |
| `phone_click` | Visitor opened a telephone link | Answered call, qualified lead, sale |
| `whatsapp_click` | Visitor opened WhatsApp or a message draft | Message sent, response, qualified lead |
| `quote_step` | Visitor answered a wizard question | Any contact at all |

CTA position is `header`, `wizard`, `band`, `facts`, `faq`, `closing`, `footer`, `bilgi`, or `mobile_sticky`. Wizard progress reaches analytics as `quote_step` (`service`, `size`, `district`), which shows where visitors drop out; treat it as a diagnostic, not a conversion. The chosen service, size and district are not included in analytics events. The page does not collect names, visitor phone numbers or addresses.

For real pilot evaluation, keep a separate lead outcome log: enquiry date, channel, district, qualified/not qualified, survey booked/completed, quote, sale and value. Do not put personal lead information in this public repository. Import verified outcomes into Google Ads only once a suitable consent/attribution and CRM process is established. Sidely should optimize using confirmed business outcomes; button clicks are early funnel diagnostics.

## Ad destinations

Send each ad group to the page that matches it. The headline, hero photo and first wizard step follow the page.

| Ad group | Final URL |
| --- | --- |
| Cam balkon, balkon kapatma | https://izmirbalkon.com/cam-balkon |
| Kış bahçesi | https://izmirbalkon.com/kis-bahcesi |
| Pergola | https://izmirbalkon.com/pergola |
| PVC, alüminyum doğrama, pencere | https://izmirbalkon.com/dograma |
| Brand or mixed | https://izmirbalkon.com/ |

## Visibility in search and AI answers

The site side is built, see the README. These parts need the owner, because AI assistants recommend businesses they can confirm from other sources:

1. Create or claim a Google Business Profile with the same name, phone and service area as the site.
2. Add the site to Google Search Console and Bing Webmaster Tools and submit `https://izmirbalkon.com/sitemap.xml`. ChatGPT search and Copilot draw on Bing's index.
3. Add real profile links (Google Business Profile, Instagram, review profile) to `sameAs` in `businessNode()` in `scripts/render.mjs`.
4. Keep name, phone and service area identical everywhere, and ask customers for Google reviews.

Whether a real AI crawler reaches the site can only be confirmed in server logs. A curl test with a crawler's user agent does not prove it.

## Research used for page structure

Reviewed on 4 November 2026. These are competitive observations, not claims about İzmir Balkon's history or service guarantees.

- https://www.brkcambalkon.com/sikca-sorulan-sorular/ — free survey, district service and price factors.
- https://dcmyapi.com.tr/hizmetler/cam-balkon/katlanir-cam-balkon/ — WhatsApp photo request and system explanation.
- https://izmircambalkon.org/ — direct phone access and free survey offer.
- https://developers.google.com/tag-platform/security/guides/consent — consent-controlled Google tag loading.

Reviewed again on 5 November 2026 at phone width. Observations only, not claims about İzmir Balkon:

- İzmir: https://www.brkcambalkon.com/, https://www.karatascambalkon.com.tr/, https://www.izmirbioclimatic.com/, https://izmircambalkon.org/, https://www.bioclimaticpergola.com.tr/cam-balkon/.
- National: https://www.realcambalkon.com/izmir-kis-bahcesi/, https://altaycambalkon.com/, https://www.eraycam.com.tr/hesaplama.html.
- Common pattern: 4 to 6 phone and WhatsApp buttons in the first screen, and forms of 5 to 8 fields. Most also advertise 2 to 5 year warranties and some publish TL prices; İzmir Balkon has neither confirmed, so the page claims neither.
- Used as openings: one task on the first screen, a three-tap draft instead of a long form, customers' own words as selling points, and answering the apartment-permission worry raised by 2026 news coverage of court-ordered removals.

Agent-readiness choices follow Vercel and Ora's study of 1,033 agent runs: https://vercel.com/kb/guide/make-your-site-readable-by-ai-agents

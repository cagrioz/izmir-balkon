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

CTA position is `header`, `hero`, `process`, `contact`, `closing`, `mobile_sticky`, or `quote_form`. The form district and system are not included in analytics events. The page does not collect names, visitor phone numbers or addresses.

For real pilot evaluation, keep a separate lead outcome log: enquiry date, channel, district, qualified/not qualified, survey booked/completed, quote, sale and value. Do not put personal lead information in this public repository. Import verified outcomes into Google Ads only once a suitable consent/attribution and CRM process is established. Sidely should optimize using confirmed business outcomes; button clicks are early funnel diagnostics.

## Research used for page structure

Reviewed on 4 November 2026. These are competitive observations, not claims about İzmir Balkon's history or service guarantees.

- https://www.brkcambalkon.com/sikca-sorulan-sorular/ — free survey, district service and price factors.
- https://dcmyapi.com.tr/hizmetler/cam-balkon/katlanir-cam-balkon/ — WhatsApp photo request and system explanation.
- https://izmircambalkon.org/ — direct phone access and free survey offer.
- https://developers.google.com/tag-platform/security/guides/consent — consent-controlled Google tag loading.

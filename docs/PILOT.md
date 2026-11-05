# GetSidely × İzmir Balkon pilot

## Scope and current state

The site is the acquisition destination. GetSidely manages the connected Google Ads account separately. No campaign has been created, enabled or funded by this repository. No Sidely API key or Google Ads credential is embedded. The owner-supplied Google Ads base tag is configured in public/tracking-config.js and loads after opt-in. Conversion action labels remain blank; no click conversion is sent until they are configured. GA4 is off.

## Activation

1. Connect the intended Google Ads account in getsidely.com and use the verified site domain as the final URL.
2. Create three separately named Google Ads website conversion actions: phone click (primary, `callClickLabel`), wizard WhatsApp click (primary, `wizardWhatsappClickLabel`), and all other WhatsApp clicks (secondary, `whatsappClickLabel`). Use Count=One for each. Supply each action’s real label and the `AW-…` ID in `public/tracking-config.js`. Never map a missing wizard label to the secondary label. Add a real GA4 `G-…` ID only if wanted. The labels in tests are fictitious and never shipped as configuration.
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


## Preparation status — 5 November 2026

The code preserves only `gclid`, `gbraid`, `wbraid` and lowercase `utm_*` attribution parameters in `page_location`; unrelated parameters and the fragment are stripped. These allowed values can still contain user-entered data: never put names, phone numbers or email addresses into UTM values. The site does not implement WhatsApp-to-click-ID matching, cross-page identifier storage or a server-side lead database.

Wizard WhatsApp (`data-position="wizard"`) and phone clicks are **primary intent conversions**; other WhatsApp clicks are **secondary**. Primary is a bidding configuration, not proof of a lead. `quote_step` remains diagnostic. A WhatsApp draft opening is not a sent message. Do not import the same GA4 event as another primary conversion alongside the Google Ads tag.

`ad_user_data` and `ad_personalization` remain `denied` after measurement consent. Do not change either without owner approval. Google's [consent reference](https://support.google.com/google-ads/answer/13802165?hl=en) states that ad-user-data consent affects tag-based measurement and click-ID exports. A local `gtag` command or successful request does not prove Google Ads recorded an attributed conversion. Tag Assistant/account-side acceptance remains a separate required check.

The genuine base tag ID supplied by the owner is configured; action labels and GA4 remain blank. No fake test identifiers are shipped in the live config. The owner has not supplied a legal name, address, public profiles, Search Console or Bing verification tokens and authorized proceeding with the basic trade name “İzmir Balkon”. Identity expansion is deferred; do not call that trade name a verified legal identity or invent an address/sameAs/token.

Campaign drafts and length checks are in [ads/README.md](ads/README.md). The outcome template is [lead-log-template.csv](lead-log-template.csv): keep only date, channel, district, qualified, survey_booked, quote, sale, value. Use YYYY-MM-DD, yes/no/unknown, and TRY for value; keep unfilled rows blank, not fabricated examples. Completed logs belong in a private operational system, never this public repo. The owner must choose budget, bid cap, contact hours and who handles enquiries.

## Proposal only: offline attribution

Matching WhatsApp enquiries back to gclid/gbraid/wbraid requires a backend, identifier retention, consent handling, access controls, deletion/retention rules and a reliable way to join a conversation to a click. This conflicts with the present privacy statement that the site stores no enquiry record. Before implementation, approve a new data flow and update the privacy notice; assess a suitable legal basis and retention period. No such matching, server storage, personal-data upload or enhanced conversion has been implemented.

## Launch verification still required

With real IDs: check the live domain in Tag Assistant before consent, after rejection, after acceptance and after revocation. Test phone, wizard WhatsApp and other WhatsApp separately: one tag event per click, the correct destination/label, and conversion acceptance under `ad_user_data=denied`. Never report the mocked unit-test result as an account-side pass. Measure LCP and CLS with tags enabled, compare all wizard-step heights at 320, 390 and 1440 px, and test the banner with the wizard sheet open. Finally run actual phone/WhatsApp flows on an iPhone and Android; desktop emulation is not a substitute.


## Turkey call reporting check

On 5 November 2026, Turkey is not listed in Google's [supported forwarding-number countries](https://support.google.com/google-ads/answer/2382961?hl=en). Do not promise connected-call or call-duration conversion reporting via a Google forwarding number in Turkey. Keep call reporting off for the call asset unless the real account establishes supported functionality. Website `phone_click` measures only the opening of a dialler; ad call clicks are separate from that website event.

## Account setup and promotion status

The owner completed further onboarding and supplied the Google Ads base tag. The screen now says ads will go live after review; campaign status must be checked in the account. The agent has not created, enabled or funded a campaign. The shown account-specific offer was “spend TRY8,000, get TRY8,000”, pending confirmation at payment, for new advertisers only. The separate 65,000 TL marketing offer was not verified for this account. No promotional terms were accepted or budget committed. Confirm actual eligibility, qualifying spend, deadline and activation with the owner before claiming an offer.

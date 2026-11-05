# Validation — 5 November 2026

- `npm test`: 29/29 passed, including attribution allowlist, consent gating, separate wizard label, one conversion command per click and campaign length/export checks.
- `node scripts/build.mjs`: passed; 15 generated files. No generated page was hand-edited.
- Chrome local browser QA used a **local stub**, not Google's tag. Mock IDs were served only by an ignored local QA server and are not in public/tracking-config.js.
- Before consent: zero stub scripts. Reject + reload: zero. Accept: one. Accept again through preferences: still one.
- Consent banner is in document flow above the header, not an overlay over the wizard. Cookie preferences scroll back to it.

| Viewport width | Service height | Size height | District height | Horizontal overflow |
| --- | --- | --- | --- | --- |
| 320 px | 483.67 px | 483.67 px | 483.67 px | No |
| 390 px | 431.28 px | 431.28 px | 431.28 px | No |
| 1440 px | 672 px | 672 px | 672 px | No |

These are desktop browser viewport checks, not physical iPhone/Android tests. They do not measure Google's network behavior or attribution acceptance.

## Pending genuine account IDs

Public IDs remain empty. Account onboarding is incomplete; no campaign was created, enabled or funded. Consequently real Tag Assistant conversion registration with ad_user_data=denied, consent network checks with real tags, and tags-on LCP/CLS measurements remain **unverified**. Do not activate ads based on the local stub checks. Keep enhanced conversions off unless the owner explicitly approves a privacy-policy change.

Legal identity/address, profiles and verification tokens were not supplied; none were invented. The campaign pack excludes unproven 15+/200+ claims, but the existing website still contains them. Obtain evidence or revise the canonical facts and related tests before launch.

## Subsequent activation

The owner supplied the genuine base tag and completed onboarding. The three action labels are now configured in public/tracking-config.js. Account settings: phone and wizard WhatsApp primary, other WhatsApp secondary; One; zero value; enhanced conversions off. The earlier empty-ID blocker is resolved. Actual attributed conversion registration and tags-on LCP/CLS still require verification; do not interpret the unit tests as that verification.

## Live check after activation

The deployed tracking-config.js, app.js and ui.js were fetched from izmirbalkon.com and matched local source. In Chrome DOM inspection, no Google tag script was present before consent or after reject/reload; acceptance added one real Google tag script. Revocation returned to zero scripts. This is a script-loading check, not a comprehensive network capture.

Tag Assistant connected to the live domain and found one Google tag. One phone-link click produced one Conversion hit with the matching phone label, alongside the page-view hit. Hit details showed the conversion destination, `gcs=G111`, `gcd=13t3t3p3p7l1`, `npa=1`, and the clean page location without the debug query. `ad_user_data` and `ad_personalization` remain denied in source. This confirms a sent hit, not an ad-attributed conversion in reporting.

The normal live wizard progressed through all three steps. In the Tag Assistant-opened debug page it did not advance during this session; the full wizard/other-WhatsApp hit checks remain incomplete. No WhatsApp message was sent. Tags-on LCP/CLS and physical-device call/WhatsApp tests remain outstanding. Conversion rows initially show Inactive; do not claim account-side validation has passed.

## DataFast and live consent update — 5 November 2026

- `npm test`: 34 passing tests; production build passes. Public DataFast ID and the separate three Google Ads labels are deployed on `izmirbalkon.com`.
- Live DOM inspection: no Google or DataFast script before consent, after rejection and reload, or after revocation and reload. After acceptance: one Google loader and one cookieless DataFast loader. This is a script-loading check, not a complete network capture.
- Live DataFast dashboard received one each of `phone_click`, `wizard_whatsapp_click`, and `whatsapp_click`, plus the three wizard-step goals. These are QA clicks, not real leads or revenue. No WhatsApp message was sent. Browser policy blocked launching the dialler, although the click event reached DataFast.
- Live widths 320, 390 and 1440 px: no horizontal overflow. Consent banner stays in document flow above the hero and does not overlay the wizard action. Wizard service/size/district heights are respectively constant at 483.67 / 431.28 / 672 px for those widths.
- Existing Google-only grants prompt again for the new provider. Previous refusals remain blocked. Unit tests cover one event per click, all three labels, incomplete wizard exclusion, and blocking DataFast automatic outbound capture for click/Enter/Space.
- Google Ads attributed conversions, remaining WhatsApp Tag Assistant label inspection, full network capture and tags-on LCP/CLS remain separate checks. Do not infer these passed from DataFast receiving events or from unit tests. Physical iPhone/Android flow tests remain outstanding.
- DataFast's optional #1 KPI selection was not saved: Chrome settings/Tag Assistant pages stopped rendering during verification. All three contact goals were already visible in the dashboard. Set #1 KPI to `wizard_whatsapp_click` when the settings page is responsive; leave revenue integrations off.

## Latest live verification — 5 November 2026, 22:13–22:25 Türkiye time

This section supersedes the outstanding WhatsApp label and DataFast KPI checks above.

- Chrome Tag Assistant connected to the production domain. Starting with one page-view hit, one wizard WhatsApp click added exactly one Conversion hit, label `-YgNCJy957IdEN-HqpFF`. One closing-section WhatsApp click added exactly one more Conversion hit, label `kPp-CJ-957IdEN-HqpFF`. No message was sent. The phone label was verified in the earlier session.
- Both WhatsApp hits showed destination `AW-18558387167`, `gcs=G111`, `gcd=13t3t3p3p7l1`, `npa=1` and clean page location `https://izmirbalkon.com/`. `ad_user_data` and `ad_personalization` remain denied. Sent hits are confirmed; ad-attributed reporting is not.
- DataFast received the additional wizard/other-WhatsApp clicks, increasing each from one to two. `wizard_whatsapp_click` was saved as #1 KPI and persisted after reload. The displayed 200% rate is repeated QA completions divided by one test visitor, not a business conversion rate. Revenue integration remains off.
- Network check after refusal/reload, with Tag Assistant debugging stopped: All resource types, filter `/google|doubleclick|datafa/`, zero matches out of 29 requests. Debugging itself had previously generated extension-initiated `gtag/js?id=DUMMY` probes; these are not site measurement. Accepting then loaded the real Google and cookieless DataFast scripts. A fresh-storage pre-choice network capture remains outstanding; pre-choice script absence and consent gating passed earlier DOM/unit checks.
- Desktop local performance with accepted consent and both loaders present: LCP **0.50 s**, CLS **0**, cache disabled, no CPU/network throttling, width 1728 px. This is a local diagnostic, not a field or slow-mobile benchmark.
- At actual 390 px width, wizard heights were **431.28 px at every step**, with no horizontal overflow. Mobile Performance displayed a device-simulation warning and the subsequent trace did not produce a usable LCP; do not report that run as a verified mobile speed score. Previous 320/390/1440 responsive checks still apply.
- Google Ads account settings confirm **Auto-tagging: Yes**, auto-apply off, no campaigns. The three conversion actions remain configured Primary / Primary / Secondary, Count One. All still show **Inactive → Unverified conversion**; the UI says verification can take up to three hours after a tag-bearing page visit. Do not mistake that pending account state for successful attribution.
- Account policy summary recommends three tasks: EU political-ads status, organization details, and funding-source confirmation. None was submitted with invented information. Billing showed zero balance, no prior payments and no upcoming automatic payment. No campaign, funding, or contract acceptance was performed. A call-recording terms prompt was left unaccepted; no call-recording setting change was confirmed.
- `npm test`: **34/34 passed** again. Private QA screenshots remain in ignored `qa/ads/`, not in this public repository.

Owner handoff: connect Sidely personally; complete applicable account identity/funding tasks and choose budget; obtain proof or remove the 15+/200+ website claims; complete physical iPhone/Android call and WhatsApp checks. Before declaring launch fully validated, resolve Google Ads tag status and the remaining fresh-consent/mobile performance checks. Do not create a campaign merely to test attribution.

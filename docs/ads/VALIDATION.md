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

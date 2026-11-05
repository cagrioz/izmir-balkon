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

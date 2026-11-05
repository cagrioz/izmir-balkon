# Deployment

Configured on 4 November 2026.

- GitHub: https://github.com/cagrioz/izmir-balkon
- Vercel project: `izmir-balkon` under `devcagrigmailcoms-projects`.
- Production branch: `main`; Vercel imports GitHub and deploys pushes.
- Framework: Other; build: `npm run build`; output: `dist`.
- Production domain: `izmirbalkon.com`.
- `www.izmirbalkon.com` redirects to `izmirbalkon.com` with HTTP 308.
- Fallback domain: `izmir-balkon.vercel.app`.

## GoDaddy DNS

| Type | Name | Value | TTL | Change |
| --- | --- | --- | --- | --- |
| A | @ | 216.198.79.1 | 600 seconds | Replaced the GoDaddy `Parked` value with Vercel's project-supplied value |
| CNAME | www | izmirbalkon.com. | 1 hour | Existing record retained; points through the apex to Vercel |

Nameservers remain `ns71.domaincontrol.com` and `ns72.domaincontrol.com`. The `_domainconnect`, SOA and `_dmarc` records were preserved. No nameserver change, email setup or purchase was performed.

Vercel handles TLS issuance and renewal. On a future platform migration, copy the destination project's actual DNS requirements rather than assuming the A record above is universal.

## Measurement

Google Ads and the three contact-conversion labels are configured. DataFast is configured in cookieless mode. Both load only after measurement consent; GA4 remains off. Public identifiers live only in `public/tracking-config.js`. See `PILOT.md` and `ads/VALIDATION.md` for account settings and the limits of verification. No campaign was created, enabled or funded.

On 5 November 2026, a delayed GitHub build of commit `afaed6b` replaced the newer CLI deployment. The deployment containing `44bddef` was promoted again, and the public domain was checked for the DataFast configuration. After deploying, always compare the live tracking config and consent copy with the intended source; a successful CLI build alone does not prove the domain still serves it.

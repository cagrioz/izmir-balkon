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

Google Ads and GA4 public IDs remain empty. Hosting/domain setup does not activate conversion measurement or spend. See `PILOT.md` for the remaining account-specific setup.

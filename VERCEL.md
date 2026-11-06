# get-out-now.org on Vercel (free plan)

Netlify deploys are blocked (credits exhausted), so the site is also deployed to Vercel.
- Vercel project: `get-out-now` (linked in .vercel/)
- Production URL: https://get-out-now-sigma.vercel.app (no custom domain attached yet)
- Netlify site still used for forms + functions: whimsical-monstera-1f180b.netlify.app (id 1fd28d62-42f3-49e1-9e2d-663b1f733218)

## Redeploy
    cd /workspace/get-out-now.org && npx vercel deploy --prod --yes

Vercel runs `node build-vercel.mjs`, which copies the static site to `dist/` (skipping netlify/, *.md,
package files) and only rewrites form endpoints:
- `fetch('/',{method:'POST'` -> `fetch('/api/form?ajax=1',...`
- `<form data-netlify="true" action="X">` -> `action="/api/form?next=X"` (no-JS fallback, 303 to X)
Page content is untouched.

## Forms
`api/form.js` forwards petition / gon-signup / gon-contact POSTs to the Netlify site, so Netlify Forms,
`submission-created` (petition blob counter + Sign-ups ingest) and the petition thank-you routine keep working.
Honeypot (`bot-field`) submissions are dropped. Forms: petition 6aded1c80447da48ea64e81e,
gon-signup 6a7d6de0bd3ebd00078c5cad, gon-contact 6a7d6de0bd3ebd00078c5ca4.
`/.netlify/functions/petition-count` is rewritten (vercel.json) to the Netlify function.
Test submission cleanup: delete the submission (DELETE /api/v1/submissions/<id>) AND its petition blob
(DELETE /api/v1/blobs/<site_id>/site:petition-signatures/sig/<id>).

## Netlify equivalents in vercel.json
- `_redirects` `/*.html /:splat 301!` -> `"cleanUrls": true` (308 instead of 301)
- `_headers` -> `headers` (ttv text/plain, feeds atom+xml, image/favicon cache)

## DNS cutover (NOT done)
DNS is at GoDaddy (registrar GoDaddy.com, NS ns13/ns14.domaincontrol.com).
1. Vercel: `npx vercel domains add get-out-now.org get-out-now` and same for www.
2. GoDaddy DNS: apex A `75.2.60.5` -> `76.76.21.21`; `www` CNAME `whimsical-monstera-1f180b.netlify.app` -> `cname.vercel-dns.com`.
   Keep the google-site-verification TXT. (Use whatever values Vercel's domain screen shows if they differ.)
3. Keep FORWARD target in api/form.js on the *.netlify.app host (not get-out-now.org) to avoid a loop.

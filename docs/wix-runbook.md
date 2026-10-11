# Wix runbook — Lara Cuenta

How the site gets onto Wix without the Wix Editor.

## Approach

```
content/posts/*.mdx ─► Astro build ─► dist/ (HTML/CSS/SVG) ─► Wix MCP upload ─► live site
content/**/images ──► public/media (WebP) ─► GitHub ─► jsDelivr ─► <img src>
```

- The site is a **Wix headless site** in the owner's account (created 2026-10-10):
  - `metaSiteId`: `f0de3346-63cf-432a-a52f-d0fd75b793dc`
  - Live: https://headless-zwosrbmivru-mariangellou27-140e.wix-site-host.com
  - Dashboard: https://manage.wix.com/dashboard/f0de3346-63cf-432a-a52f-d0fd75b793dc
- Only text files go to Wix. Images are committed to the public repo and served by
  jsDelivr pinned to a commit SHA, so caches never go stale.
- Every upload replaces the whole site; the URL stays.
- Source: Wix docs, *Upload a Website or HTML Files*; behaviour verified in
  `spikes/wix-hello/README.md`.

## Hosting rules (verified)

| Works | Doesn't |
|---|---|
| `/`, `/page.html`, `/dir/page.html` | `/dir/` (directory index) |
| Root-relative CSS/JS/SVG | `/page` without `.html` |
| External images and fonts | Custom `404.html` |

Limits: 3 MB per file, 20 MB per site, static files only.

## Publish

1. Write or edit posts in `content/posts/<slug>/` (`npm run new -- "Title"`), preview
   with `npm run dev`.
2. `npm run release` — optimizes images, commits `public/media` if it changed, builds
   with the jsDelivr base of the current commit, writes `dist-mcp-bundle.txt`.
   If it says the commit is not on GitHub yet: push, then rerun.
3. Upload through a Wix MCP client:
   - **Claude**: `StartDeployWebsite`, then `UploadHeadlessWebsiteFiles` with the
     `siteId` above and the bundle as `files`.
   - **ChatGPT** with the Wix connector: attach `dist-mcp-bundle.txt` (or a zip of
     `dist/` without `media/`) and ask it to upload it to the site with the `siteId`
     above using `UploadHeadlessWebsiteFiles`.
4. Smoke test: home, `/blog.html`, one post, one image URL.

## Later: deploy from the terminal

The same upload can be one command with the Wix CLI (`npx @wix/cli@latest login` once,
then `npx @wix/cli@latest token` gives a 15-minute token) and a multipart `POST` to
`/headless-business-setup/v1/headless-business/<metaSiteId>/drop`. Not set up yet.

## What a static site can't do

| Element | Now | Option |
|---|---|---|
| Contact form | mailto fallback; endpoint in `src/site.config.ts` | Formspree or similar, or Wix Forms via a headless backend |
| Newsletter | Hidden until an endpoint is set | Same |
| Comments | Not shown | Wix Comments via headless backend, or a third-party widget |
| Share | Static share links | — |

## Open points

- Custom domain for a headless site (not verified).
- Language of committed articles (see `CLAUDE.md` — repository content is English).

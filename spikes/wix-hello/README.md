# Spike: static HTML on Wix + images on jsDelivr

Date: 2026-10-10. Site: headless site "Lara Cuenta" (`metaSiteId`
`f0de3346-63cf-432a-a52f-d0fd75b793dc`), deployed through the Wix MCP
(`UploadHeadlessWebsiteFiles`, text bundle).

`site/` holds the first round's files; `media/test-cover.jpg` is the image served by
jsDelivr.

## Results

| Check | Result |
|---|---|
| Create headless site in the account | ✅ `provision` with `origin: "drop"` |
| Upload HTML + CSS, served at `*.wix-site-host.com` | ✅ |
| Root-relative assets (`/assets/style.css`) | ✅ 200 `text/css` |
| JPG from GitHub via jsDelivr pinned to a commit SHA | ✅ 200 `image/jpeg` |
| SVG from jsDelivr | ✅ 200 `image/svg+xml` |
| Google Fonts | ✅ |
| `/about.html`, `/blog/world.html` | ✅ 200 |
| `/blog/hello/index.html` (explicit) | ✅ 200 |
| `/blog/hello/` (directory index) | ❌ 301 to `/blog/hello`, then 404 |
| `/about` when `about.html` exists (clean URLs) | ❌ 404 |
| Custom `_wix/pages.json` declaring `/about` | ❌ ignored for routing |
| Custom `404.html` | ❌ Wix serves its own 404 page |
| Astro's `_astro/` asset folder | ✅ 200 `text/css` (real build subset) |
| `ExecuteWixAPI` fetching an external URL (to pull a build) | ❌ 403, only Wix domains allowed |

## Decisions

- **URLs must end in `.html`**: build Astro with `build.format: "file"` and emit
  internal links as `/blog/<slug>.html`, `/about.html`. `/` maps to `index.html`.
- No custom 404 page.
- Images and large SVGs live in the GitHub repo and are referenced through
  `https://cdn.jsdelivr.net/gh/Rosendito/laracuenta@<sha>/...`, pinned to the pushed
  commit so caches never serve stale files.
- Wix generates `_wix/pages.json` itself from the uploaded `.html` files.
- An MCP upload means the agent writes every file into the call (~110 KB for the
  current build). Fine occasionally; for frequent deploys use the Wix CLI token + `curl`
  drop from the terminal, or a client whose attachments travel as files (ChatGPT).

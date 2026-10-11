# Wix runbook — Lara Cuenta

How the site gets onto Wix without using the Wix Editor.

## Approach

The whole site (Home, Blog, posts, About, Contact) is built from code in this repo and
uploaded as static files to a **Wix headless site** in the user's Wix account. Wix serves
it at a `*.wix-site-host.com` URL and lists it in the account dashboard.

Source: Wix docs, *Upload a Website or HTML Files*
(`dev.wix.com/docs/api-reference/account-level/sites/skills/upload-a-website-or-html-files`).

```
content/posts/*.mdx ──► Astro build ──► dist/ (HTML/CSS/img) ──► Wix "drop" API ──► live site
```

- Generator: **Astro** (native MDX, static output). It is also the stack Wix's headless
  kit uses, so Wix backend features can be added later on the same site and URL.
- Each deploy replaces **every** file; the URL stays the same.

### Limits (from the Wix docs)

- Static files only; `index.html` at the root.
- **3 MB per file, 20 MB per site.** Photos must be resized/compressed at build time, or
  hosted in the Wix Media Manager and referenced by their `static.wixstatic.com` URL.

### What a static site cannot do by itself

| Wireframe element | v1 (static) | Later option |
|---|---|---|
| Contact form | `mailto:` link or a third-party form endpoint | Wix Forms via the headless kit |
| Newsletter subscribe | Third-party form endpoint | Wix Forms / Email Marketing via headless kit |
| Post comments | Hidden | Wix Comments via headless kit, or a third-party widget |
| Share buttons | Plain share links (no backend needed) | — |

## Phase 0 — One-time setup

1. Wix account that will own the site.
2. Install dependencies: `npm install` (Node ≥ 22.12).
3. Log in to Wix CLI (opens the browser for approval):
   ```
   npx @wix/cli@latest login
   ```
4. Create the headless site once and store its ID in `.env` (git-ignored):
   ```
   npm run wix:create          # prints metaSiteId
   # .env
   WIX_META_SITE_ID=<metaSiteId>
   ```
   Under the hood: `POST /headless-business-setup/v1/headless-business/provision`
   with `{"origin":"drop", ...}`.

## Phase 1 — Write and deploy

```
npm run new -- "Article title"   # scaffold content/posts/<slug>.mdx
npm run dev                      # local preview at http://localhost:4321
npm run build                    # static site in dist/
npm run deploy                   # build + upload dist/ to Wix
```

`deploy` gets a fresh token (`npx @wix/cli@latest token`, valid 15 min) and sends every
file in `dist/` as one multipart request:

```
POST https://www.wixapis.com/headless-business-setup/v1/headless-business/$WIX_META_SITE_ID/drop
Authorization: Bearer $TOKEN
files=@<path>;filename=<path relative to dist>   (one part per file, or one .zip)
```

The response has the `siteUrl`. The dashboard is
`https://manage.wix.com/dashboard/<metaSiteId>`.

## Phase 2 — Before going live

- [ ] Every page checked on desktop and mobile against `docs/wireframes/`.
- [ ] `dist/` under 20 MB; no file over 3 MB.
- [ ] Per-post SEO: title, description, Open Graph image.
- [ ] Contact and subscribe forms point to a working endpoint.
- [ ] Custom domain, if needed (verify how domains connect to headless sites).

## Failures

| Error | Meaning |
|---|---|
| `400 MISSING_INDEX_HTML` / `FILE_TOO_LARGE` / `TOTAL_TOO_LARGE` | Fix the build output |
| `403 PERMISSION_DENIED` | Token expired (15 min) — rerun `deploy` |
| `500` | Malformed multipart body |

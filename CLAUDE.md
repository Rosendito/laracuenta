# Lara Cuenta

Static site for **Lara Cuenta**, a digital nano-outlet about the memory, heritage and
people of Lara (Venezuela). University assignment (digital journalism); the site must
live in the owner's **Wix** account, so it is built here with Astro and uploaded to a
Wix headless site as static files.

## Commands

```
npm run dev       # optimize media + dev server at http://localhost:4321
npm run build     # optimize media + static build into dist/
npm run preview   # serve dist/
npm run new -- "Title"   # scaffold content/posts/<slug>/index.mdx
npm run release   # media -> commit -> jsDelivr base -> build -> dist-mcp-bundle.txt
```

## Layout

```
content/posts/<slug>/index.mdx   posts (front matter schema in src/content.config.ts)
content/posts/<slug>/images/     original photos, referenced as ./images/x.jpg
content/site/images/             site-wide photos (siteImage() in src/lib/media.ts)
public/media/                    optimized WebP output (generated, committed: served by jsDelivr)
src/site.config.ts               categories, email, social links, form endpoints
src/lib/                         messages, media URLs, posts query, remark plugin
src/styles/global.css            design tokens + base styles
docs/wireframes/                 wireframe summaries and images (the page structure)
docs/design-brief.md             brief for design concepts
docs/wix-runbook.md              hosting details
spikes/wix-hello/README.md       what Wix static hosting does and doesn't support
```

## Hard constraints

- **Links end in `.html`** (`/blog.html`, `/blog/<slug>.html`, `/about.html`; home is
  `/`). Wix static hosting serves neither directory indexes nor clean URLs, and
  ignores a custom 404 page. `build.format: "file"` in `astro.config.mjs`.
- **Images never go to Wix.** They are optimized into `public/media`, committed, pushed,
  and referenced through `https://cdn.jsdelivr.net/gh/Rosendito/laracuenta@<sha>/public`
  (`PUBLIC_MEDIA_BASE`, empty in dev). Use `mediaUrl()` / `siteImage()`, and relative
  `./images/...` paths in MDX; never hardcode media URLs.
- What goes to Wix must be **text only** (HTML/CSS/JS/SVG), under 3 MB per file and
  20 MB total. `npm run bundle` enforces it.
- No server: forms post to an external endpoint set in `src/site.config.ts`
  (empty means mailto fallback / hidden newsletter). No comments.
- Everything committed is in **English** (code, comments, docs, commits, default copy).
  UI copy comes from `messages.default.json` (English, committed) shallow-merged with
  `messages.json` (Spanish, git-ignored, local only). Add every new UI string to both.
- `wireframes.pdf` and `docs/wireframes/pages/` contain personal data and are
  git-ignored. Never commit them; the repo is public.

## Deploy (through the Wix MCP)

Wix headless site "Lara Cuenta", `metaSiteId` `f0de3346-63cf-432a-a52f-d0fd75b793dc`,
live at https://headless-zwosrbmivru-mariangellou27-140e.wix-site-host.com

1. `npm run release`. If it stops with "not on GitHub yet", push and rerun. Pushing
   needs the Rosendito account, passed per command (no stored credentials):
   `GH_TOKEN=$(gh auth token -u Rosendito) git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push`
2. Call the Wix MCP `StartDeployWebsite`, then `UploadHeadlessWebsiteFiles` with
   `siteId` above and the contents of `dist-mcp-bundle.txt` as `files`. Each upload
   replaces the whole site.
3. Check a few URLs with `curl -sI` (home, `/blog.html`, one post, one image).

An MCP upload means writing the whole bundle (~110 KB) into the tool call, so deploy
when a milestone is ready, not after every tweak; iterate locally with `npm run dev`.
The Wix script runtime can't fetch external URLs, so a build can't be pulled from GitHub.

# Lara Cuenta

Static site for **Lara Cuenta**, a digital nano-outlet about the memory, heritage and
people of Lara (Venezuela). University assignment (digital journalism). Built with Astro 7,
MDX and plain CSS (BEM + design tokens, no Tailwind); it will be hosted on **Cloudflare**
(Pages or Workers static assets) with the domain bought through Cloudflare Registrar.

## Status

The design concept "Conversación" (`.local/design/2-conversacion/`, git-ignored) is
migrated: home, archive and article. The site has since moved past the concept (UI and
accessibility polish, a full-screen mobile menu), so it is no longer a pixel copy of it.

## Commands

```
npm run dev            # dev server at http://localhost:4321
npm run build          # astro check + static build into dist/
npm run preview        # serve dist/
npm run format         # prettier
npm run lint:css       # rejects raw design values outside src/styles/tokens/
npm run photo -- <slug> <files>   # import photos into a story (HEIC ok, strips EXIF/GPS)
```

## Layout

```
src/pages/                 routes: / · /historias (archive) · /historias/[slug] · /og/[slug].jpg (link previews)
src/layouts/Base.astro     page shell (head, header, footer, SVG defs)
src/components/            site components; src/components/mdx/ = the MDX kit for stories
src/content/stories/<slug>/index.mdx + photos   stories (schema in src/content.config.ts)
src/data/collections.ts    the four collections
src/config/site.ts         nav, social links, form endpoints, author
src/config/strings.ts      UI copy (Spanish)
src/styles/                tokens/ base/ layout/ components/ sections/ article/ utilities/
src/assets/photos/         site-wide photos
scripts/                   CSS lint, photo import, logo generator (build-logo.py → public/)
public/                    static files (logos)
docs/                      writing guide
```

## Brand

- Palette of the logo (source of truth, `scripts/build-logo.py`): orange `#CF7739`, sun
  `#EEB33F`, terracotta `#BD6A42`, brown `#54331C`, ink `#422818`. Cream `#F8E9D2`.
- DM Serif Display for headings, Montserrat for everything else.
- Content is organized in four **collections** (not categories), each with its own color
  and style: Lara then and now · Heritage and memory of places · Stories of our people ·
  Customs and cultural memory.

## Rules

- **Language (overrides the global "everything committed is in English" preference).**
  The site is a Spanish-language outlet: articles (MDX), UI copy and URLs are in
  **Spanish** and are committed. Everything else stays in **English**: code, identifiers,
  file names, comments, docs, commit messages, branches and PRs.
- `identidad-grafica.png` and `public/photos/` contain personal data or unpublished
  photos and are git-ignored. Never commit them;
  the repo is public.
- No server: forms post to an external endpoint (`site.forms`). Comments are undecided
  (static mockup).
- CSS: never add raw values; use tokens or a local custom property (`npm run lint:css`).
  Keep the concept's class names. Check CSS changes in the browser at 1440, 390 and 360 px.

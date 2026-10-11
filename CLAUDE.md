# Lara Cuenta

Static site for **Lara Cuenta**, a digital nano-outlet about the memory, heritage and
people of Lara (Venezuela). University assignment (digital journalism). Built with Astro
and Tailwind CSS v4; it will be hosted on **Cloudflare** (Pages or Workers static assets)
with the domain bought through Cloudflare Registrar.

## Status

Clean scaffold. Design concepts are being explored as plain HTML in `.local/design/`
(git-ignored); the chosen one will then be migrated into Astro.

## Commands

```
npm run dev            # dev server at http://localhost:4321
npm run build          # astro check + static build into dist/
npm run preview        # serve dist/
npm run format         # prettier (astro + tailwind class sorting)
```

## Layout

```
src/pages/             routes
src/layouts/           page shells
src/styles/global.css  Tailwind entry + brand tokens (@theme)
src/lib/messages.ts    UI copy loader
logo/                  logo sources (build_logo.py generates the SVGs)
public/                static files (logos)
docs/wireframes/       wireframe summaries and images (the page structure)
```

## Brand

- Palette of the logo (source of truth, `logo/build_logo.py`): orange `#CF7739`, sun
  `#EEB33F`, terracotta `#BD6A42`, brown `#54331C`, ink `#422818`. Cream `#F8E9D2`.
- DM Serif Display for headings, Montserrat for everything else.
- Content is organized in four **collections** (not categories), each with its own color
  and style: Lara then and now · Heritage and memory of places · Stories of our people ·
  Customs and cultural memory.

## Rules

- Everything committed is in **English** (code, comments, docs, commits, default copy).
  UI copy comes from `messages.default.json` (English, committed) shallow-merged with
  `messages.json` (Spanish, git-ignored, local only). Add every new UI string to both.
- `wireframes.pdf`, `identidad-grafica.png`, `docs/wireframes/pages/` and `public/photos/`
  contain personal data or unpublished photos and are git-ignored. Never commit them;
  the repo is public.
- No server: forms post to an external endpoint. Comments are undecided (mockups only).

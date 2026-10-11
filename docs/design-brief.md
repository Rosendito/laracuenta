# Design brief — Lara Cuenta concepts

## Goal

Produce **three distinct visual concepts** for the site, implemented in the real
codebase, so the owner can compare them on desktop and phone and pick one (or mix).
Read `CLAUDE.md` first for the technical constraints.

## The outlet

Lara Cuenta ("Lara tells") collects stories of Lara, Venezuela: how places changed, the
heritage and memory of places, its people, and its customs. Audience: locals and the
diaspora who feel nostalgia for the region, plus readers interested in culture.
Tone: warm, intimate, human, documentary. **Photography is the protagonist**; the
design frames photos, it doesn't compete with them.

## Fixed

- **Structure** of each page follows the wireframes — `docs/wireframes/` (`home.md`,
  `blog.md`, `post.md` and their PNGs). Concepts may restyle and rebalance sections,
  not drop or reorder them.
- **Brand** (`docs/wireframes/README.md`, `logo/`):
  - Cream backgrounds; orange `#CF7739`, sun `#EEB33F`, terracotta `#BD6A42` for
    accents; brown `#54331C` / `#422818` for text and high-contrast areas. The exact
    cream is open.
  - DM Serif Display for headings, Montserrat for everything else.
  - The logo is a speech bubble with a sun; the isotype can be used as a motif.
- Header: logo, menu (Home, Blog, About, Contact), social icons. Footer: logo + blurb,
  links, policies, newsletter, social. No permanent sidebar; content in blocks/cards.
- WCAG AA contrast for text. Works from 360 px wide.

## Open (where concepts should differ)

Type scale and rhythm, use of color (how much orange), spacing and density, card
style, photo treatment (frames, captions, duotone, grain, rounded vs. square), header
style, section dividers, texture or illustration from the logo, motion, hover states.

Suggested starting directions (replace them if you find better ones):

1. **Archive / editorial** — newspaper-archive feel: strong serif headlines, rules
   and columns, captions like photo credits, restrained color.
2. **Warm sun** — the logo's sun and bubble as motifs, generous orange/sun accents,
   rounded shapes, friendly and contemporary.
3. **Photo album** — full-bleed photography, prints with white borders, slight
   rotation, handwritten-feeling captions, lots of cream space.

## Implementation

- Each concept is a theme: `src/styles/themes/<name>.css` overriding the tokens in
  `src/styles/global.css` and adding component rules under `[data-theme="<name>"]`.
  Markup changes that a theme needs should be small and shared across themes.
- A concept switcher (fixed corner control) sets `data-theme` on `<html>` and keeps the
  choice in `localStorage`. It renders only when `PUBLIC_CONCEPTS=1` at build time, so
  the final site ships with one theme and no switcher.
- Use the sample posts in `content/posts/` (placeholder photos). If a concept needs
  site-wide imagery, generate neutral placeholders into `content/site/images/` —
  never stock photos of real people.
- No new runtime dependencies unless there is a strong reason.

## Deliverables

1. The three themes + switcher, building cleanly (`npm run build`).
2. `docs/design/concepts.md`: for each concept, the idea in two or three sentences,
   what makes it different, and its weak points.
3. Screenshots in `docs/design/screenshots/<concept>-<page>-<desktop|mobile>.png` for
   home, blog and one post.
4. Deploy with the switcher on (`PUBLIC_CONCEPTS=1 npm run release`, then the MCP
   upload described in `CLAUDE.md`), and report the live URL.

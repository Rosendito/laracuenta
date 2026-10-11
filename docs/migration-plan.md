# Migration plan: concept "Conversación" → Astro

Source of truth for the visual result: `.local/design/2-conversacion/` (`index.html`,
`archive.html`, `post.html`, `styles.css`, `main.js`). The goal is a **pixel-perfect**
Astro build of those three pages at 1440 px and 390 px, verified by an automated
screenshot + geometry diff, with the article body authored in MDX.

Orchestration: Opus owns the foundation (tokens, CSS port, harness, content model) and
reviews every task; Haiku agents implement components from self-contained task cards.

## 1. Decisions

| Topic | Decision |
| --- | --- |
| Language | Articles, UI copy and URLs in Spanish (committed). Code, comments, docs, commits in English. See `CLAUDE.md`. |
| Styling | **No Tailwind.** Plain CSS with BEM class names kept **identical** to the concept, split by semantics in `src/styles/`, no component-scoped `<style>`. |
| Tokens | Every raw value lives in `src/styles/tokens/`. Values used once live as a local custom property at the top of their block. A stylelint rule rejects raw values anywhere else. |
| Cascade | `src/styles/main.css` imports files in the **same order as the concept sections 1–14**. No `@layer` (it would change how the cascade resolves vs. the concept). |
| Breakpoints | `@custom-media` tokens, compiled by Lightning CSS (`vite.css.transformer = "lightningcss"`). |
| Photos | Committed next to each story (`src/content/stories/<slug>/`) or in `src/assets/photos/` for site-wide ones, optimized by `astro:assets`. Cloudflare limits (20k files, 25 MiB/file) are far away; no R2 needed. Source files are re-encoded without metadata (EXIF/GPS) before commit. |
| JS | No framework islands. Each `main.js` block becomes a `<script>` inside its component (Astro bundles and dedupes it). Every page works without JS. |
| Comments | Static mockup, as in the concept. |
| Forms | Post to an external endpoint configured in `src/config/site.ts`. |
| Routes | `/` · `/archivo` · `/historias/[slug]` · collection anchors `#antes`, `#patrimonio`, `#gente`, `#costumbres`. |

## 2. Styles architecture

```
src/styles/
  main.css                  imports, in concept order
  tokens/
    color.css  type.css  space.css  shape.css  elevation.css  motion.css  layout.css  media.css
  base/
    reset.css  elements.css  accessibility.css     (focus, selection, skip link, visually-hidden, reduced motion)
  layout/
    wrap.css  site-header.css  site-footer.css
  components/
    icon.css  button.css  eyebrow.css  tag.css  collection.css  bubble.css  avatar.css
    card.css  card-grid.css  section-head.css  form.css  chip.css
  sections/
    hero.css  recent.css  about.css  contact.css
    archive-banner.css  collection-nav.css  collection-group.css  load-more.css
  article/
    article.css  prose.css  figure.css  carousel.css  timeline.css  quote.css
    share.css  comments.css  overflow-menu.css
  utilities/
    mockup-note.css
```

Rules for anyone editing CSS (enforced by `npm run lint:css`):

1. Outside `tokens/`, `color`, `background`, `border*`, `font-size`, `font-weight`,
   `line-height`, `letter-spacing`, `gap`, `margin*`, `padding*`, `inset*`, `border-radius`,
   `box-shadow`, `z-index`, `transition*` and `animation*` accept only `var(--…)`,
   `0`, `auto`, `inherit`, `currentColor`, `transparent`, `100%`, `none`.
2. A value that exists only once in the design is declared as a local token at the top
   of its block: `.hero { --hero-min-h: clamp(560px, 92svh, 860px); min-height: var(--hero-min-h); }`.
3. Never invent a value. If the concept doesn't have it, ask (the reviewer decides
   whether it becomes a token).
4. Class names are copied from the concept verbatim. Don't rename, don't merge.

## 3. Tokens

All values are taken from `styles.css` as they are (pixel-perfect first). Names say
what a value is for, not what it looks like, except for the raw brand palette.

### color.css

```css
:root {
  /* brand palette (logo/build_logo.py) */
  --color-orange: #cf7739;
  --color-sun: #eeb33f;
  --color-terracotta: #bd6a42;
  --color-brown: #54331c;
  --color-ink: #422818;
  --color-cream: #f8e9d2;
  --color-white: #fff;

  /* surfaces */
  --surface-page: #fdf6ea;          /* paper, lighter than the brand cream */
  --surface-card: var(--color-cream);
  --surface-line: #f1dcbb;          /* cream-deep: borders, dividers, image placeholders */
  --surface-night: #2d1a0f;         /* footer, overlays */

  /* text (contrast measured on --surface-page) */
  --text-strong: var(--color-ink);  /* 12.4:1 */
  --text-soft: #6b4a33;             /* 6.6:1 */
  --text-on-dark: var(--color-cream);

  /* interactive */
  --accent: #a85820;                /* white text 5.1:1 */
  --accent-hover: #8f4421;
  --accent-text: #8f4421;           /* small text on cream 5.8:1 */
  --sun-hover: #e7a62a;
  --focus: #1f5fa6;

  /* collections: hue = decorative, deep = text/tag on cream (≥ 4.5:1) */
  --col-antes-hue: var(--color-sun);
  --col-antes-deep: #7a4f06;
  --col-patrimonio-hue: var(--color-terracotta);
  --col-patrimonio-deep: #9a4a26;
  --col-gente-hue: var(--color-orange);
  --col-gente-deep: #9a4f1c;
  --col-costumbres-hue: var(--color-brown);
  --col-costumbres-deep: #54331c;

  /* translucent: night (45 26 15) */
  --night-a0: rgb(45 26 15 / 0);
  --night-a05: rgb(45 26 15 / 0.05);
  --night-a25: rgb(45 26 15 / 0.25);
  --night-a35: rgb(45 26 15 / 0.35);
  --night-a40: rgb(45 26 15 / 0.4);
  --night-a45: rgb(45 26 15 / 0.45);
  --night-a72: rgb(45 26 15 / 0.72);
  --night-a75: rgb(45 26 15 / 0.75);
  --night-a80: rgb(45 26 15 / 0.8);
  --night-a82: rgb(45 26 15 / 0.82);
  --night-a85: rgb(45 26 15 / 0.85);
  /* translucent: cream (248 233 210) */
  --cream-a15: rgb(248 233 210 / 0.15);
  --cream-a20: rgb(248 233 210 / 0.2);
  --cream-a25: rgb(248 233 210 / 0.25);
  --cream-a70: rgb(248 233 210 / 0.7);
  --cream-a92: rgb(248 233 210 / 0.92);
  /* translucent: ink (66 40 24), white, black */
  --ink-a15: rgb(66 40 24 / 0.15);
  --white-a06: rgb(255 255 255 / 0.06);
  --white-a90: rgb(255 255 255 / 0.9);
  --black-a30: rgb(0 0 0 / 0.3);
  --black-a35: rgb(0 0 0 / 0.35);
  --black-a40: rgb(0 0 0 / 0.4);

  /* mixes used in more than one place */
  --text-on-dark-80: color-mix(in srgb, var(--text-on-dark) 80%, transparent);
  --text-on-dark-65: color-mix(in srgb, var(--text-on-dark) 65%, transparent);
  --text-on-dark-55: color-mix(in srgb, var(--text-on-dark) 55%, transparent);
  --sun-55: color-mix(in srgb, var(--color-sun) 55%, transparent);
  --sun-60: color-mix(in srgb, var(--color-sun) 60%, transparent);
  --header-glass: color-mix(in srgb, var(--surface-page) 88%, transparent);
}
```

### type.css

```css
:root {
  --font-serif: "DM Serif Display", Georgia, serif;
  --font-sans: "Montserrat", system-ui, sans-serif;

  /* fluid scale */
  --text-sm: clamp(0.8rem, 0.76rem + 0.2vw, 0.875rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem);
  --text-lg: clamp(1.125rem, 1.05rem + 0.4vw, 1.3125rem);
  --text-h3: clamp(1.35rem, 1.2rem + 0.7vw, 1.75rem);
  --text-h2: clamp(1.9rem, 1.5rem + 1.8vw, 2.9rem);
  --text-h1: clamp(2.4rem, 1.7rem + 3.4vw, 4.4rem);

  /* fixed label sizes (all used 2+ times) */
  --text-label-2xs: 0.68rem;
  --text-label-xs: 0.74rem;
  --text-label: 0.78rem;
  --text-label-lg: 0.8rem;
  --text-ui: 1rem;
  --text-ui-lg: 1.1rem;
  --text-brand: 1.6rem;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  --leading-none: 1;
  --leading-heading: 1.08;
  --leading-tight: 1.2;
  --leading-snug: 1.4;
  --leading-body: 1.6;
  --leading-relaxed: 1.75;

  --tracking-tight: -0.02em;
  --tracking-heading: -0.005em;
  --tracking-ui: 0.01em;
  --tracking-tag: 0.06em;
  --tracking-caps: 0.12em;
  --tracking-caps-wide: 0.14em;
}
```

### space.css

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.35rem;
  --space-3: 0.4rem;
  --space-4: 0.5rem;
  --space-5: 0.6rem;
  --space-6: 0.75rem;
  --space-7: 1rem;
  --space-8: 1.25rem;
  --space-9: 1.5rem;
  --space-10: 2rem;
  --space-11: 2.5rem;
  --space-12: 3rem;
  --space-13: 3.5rem;
  --space-14: 4rem;

  /* em-based, scale with the element's font size (buttons, tags, icons in text) */
  --space-em-1: 0.4em;
  --space-em-2: 0.55em;
  --space-em-3: 0.6em;
  --space-em-4: 0.8em;
  --space-em-5: 0.85em;
  --space-em-6: 1.5em;

  /* rhythm */
  --gutter: clamp(1rem, 4vw, 3.5rem);
  --section: clamp(3.5rem, 8vw, 7rem);
}
```

### shape.css

```css
:root {
  --radius-tail: 6px;          /* the tight corner that reads as a speech-bubble tail */
  --radius-bubble: 28px;
  --radius-bubble-md: 18px;
  --radius-bubble-sm: 16px;
  --radius-chip: 14px;
  --radius-xs: 4px;
  --radius-hair: 2px;
  --radius-pill: 999px;
  --radius-round: 50%;

  /* bubble shapes: where the tail corner sits */
  --shape-bubble: var(--radius-bubble) var(--radius-bubble) var(--radius-bubble) var(--radius-tail); /* tail bottom-left */
  --shape-bubble-right: var(--radius-bubble) var(--radius-bubble) var(--radius-tail) var(--radius-bubble);
  --shape-bubble-top: var(--radius-tail) var(--radius-bubble) var(--radius-bubble) var(--radius-bubble);

  --border-hair: 1px;
  --border-thin: 1.5px;
  --border-medium: 2px;
  --border-thick: 3px;
  --border-accent: 6px;
}
```

### elevation.css

```css
:root {
  --shadow-soft: 0 10px 30px -14px rgb(66 40 24 / 0.35);
  --shadow-lift: 0 18px 44px -18px rgb(66 40 24 / 0.45);
  --ring-sun: 0 0 0 3px var(--sun-55);

  --z-under: -2;
  --z-behind: -1;
  --z-base: 0;
  --z-raised: 1;
  --z-above: 2;
  --z-popover: 20;
  --z-sticky-nav: 40;
  --z-header: 50;
  --z-skip-link: 100;
}
```

### motion.css

```css
:root {
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --duration-fast: 0.2s;
  --duration-card: 0.25s;
  --duration-fade: 0.3s;
  --duration-slow: 0.6s;
  --duration-hero: 0.7s;
  --duration-rise: 800ms;
  --delay-step-1: 110ms;
  --delay-step-2: 220ms;
}
```

### layout.css and media.css

```css
:root {
  --wrap: 1240px;
  --measure: 42rem;           /* reading column */
  --bleed: 60rem;             /* figures and carousel in the article */
  --header-height: 76px;
  --size-logo: 52px;
  --size-control: 44px;       /* nav toggle, hit areas */
  --size-control-sm: 38px;    /* social icons */
  --size-avatar: 28px;
  --size-icon: 1.25em;
}

@custom-media --upto-xs (max-width: 480px);
@custom-media --upto-sm (max-width: 600px);
@custom-media --upto-md (max-width: 700px);
@custom-media --upto-lg (max-width: 860px);
@custom-media --from-lg (min-width: 861px);
@custom-media --upto-xl (max-width: 960px);
@custom-media --upto-2xl (max-width: 1100px);
@custom-media --reduced-motion (prefers-reduced-motion: reduce);
```

The remaining one-off values (hero display size, drop cap size, about scatter widths,
banner heights, hero veil gradients…) become local tokens of their block during the
CSS port in phase 1.

## 4. Components

Rule: something is a component only if it is reused, takes data, or owns a script.
Everything else is plain markup inside the section that uses it (for example
`<span class="eyebrow">`, `<div class="card-grid">`, the chips, the forms).

### Layout and frame

| Component | Props | Notes |
| --- | --- | --- |
| `layouts/Base.astro` | `title`, `description`, `image?` | `<head>` (fonts, meta, OG), skip link, `SvgDefs`, `SiteHeader`, `<main id="contenido">`, `SiteFooter`. |
| `SvgDefs.astro` | – | The two bubble `clipPath`s and the icon `<symbol>` sprite, once per page. |
| `SiteHeader.astro` | `current: "home" \| "archive" \| null` | Logo, nav with `aria-current` + tail, social links, mobile toggle (script). |
| `SiteFooter.astro` | – | Brand block, nav and policy lists, newsletter form (posts to `site.forms.newsletter`), social links, mockup note. |
| `SocialLinks.astro` | – | From `site.ts`. Used 3 times. |

### Primitives

| Component | Props |
| --- | --- |
| `Icon.astro` | `name`, `class?` → `<svg class="icon"><use href="#i-…"/></svg>` |
| `Button.astro` | `href?`, `variant?: "sun" \| "ghost" \| "ghost-light"`, `size?: "sm"`, `icon?`, `type?` (renders `<a>` or `<button>`) |
| `Tag.astro` | `collection`, `short?`, `href?` |
| `Avatar.astro` | `name` (initials and color derived), `tone?` override |
| `PhotoBubble.astro` | `image`, `alt`, `widths`, `wide?` (uses the clip-path) |
| `StoryCard.astro` | `story`, `variant: "home" \| "archive"`, `hidden?` (archive variant adds byline + comment count and the short "Leer" CTA) |

### Sections

| Page | Components |
| --- | --- |
| Home | `Hero` (background `<picture>` with mobile source, credit, bubble panel with 4 thumbs; script = gallery) · `RecentStories` (section head + 3 latest cards) · `About` (six scattered photos) · `Contact` (copy, note, contact form) |
| Archive | `ArchiveBanner` (four tinted collection columns) · `CollectionNav` (sticky chips; script = filter, deep links and "Cargar más") · `CollectionGroup` (header + grid, 3 visible, rest `hidden`, load-more button) |
| Article | `ArticleHeader` (meta row, ⋮ menu with its script, title, tag, lead, byline) · `ArticleCover` (full-bleed cover + caption) · `Share` (copy link script) · `Comments` (mockup data + local append script) |

### MDX kit

`Figure` · `Carousel` · `Timeline` + `Moment` · `Quote` · `Testimony` (see §6).

### Pages

`pages/index.astro` · `pages/archivo.astro` · `pages/historias/[slug].astro` (prose
wrapper with `col-*` lives here) · `pages/404.astro` (later).

## 5. Content model

`src/content.config.ts`, collection `stories`, loader `glob("src/content/stories/*/index.mdx")`:

```ts
{
  title: string,
  description: string,        // card excerpt and meta description
  lead: string,               // serif lead under the title
  date: date,
  collection: "antes" | "patrimonio" | "gente" | "costumbres",
  cover: image(), coverAlt: string, coverCaption?: string, coverCredit?: string,
  card?: { image: image(), alt: string },   // falls back to cover
  featured?: {                              // appears in the home hero
    order: number, image: image(), imageMobile?: image(), thumb?: image(),
    alt: string, credit: string,
  },
  readingTime?: number,       // minutes; computed from the body when missing
  commentCount?: number,      // mockup only, until comments exist
  draft?: boolean,
}
```

`src/data/collections.ts`: id, number, name, short name, description, banner photo.
`src/config/site.ts`: nav, social links, form endpoints, author.
`src/config/strings.ts`: Spanish UI copy, English keys (replaces `messages*.json`).
Dates formatted with `Intl.DateTimeFormat("es-VE", { dateStyle: "long" })`.

Fixtures for the visual diff: the 16 stories from `archive.html` (frontmatter + short
body) and the full Obelisco article from `post.html`, all text copied verbatim.

## 6. MDX authoring kit (what the editor can use)

Plain Markdown covers most of an article:

| Write | Result |
| --- | --- |
| Paragraphs | Body text; the first paragraph gets the drop cap in the collection color. |
| `## Subtítulo` | Subheading with the divider. |
| `**negrita**`, `*cursiva*`, links, lists | Styled prose. |
| `![alt](./foto.webp "Pie de foto")` | A photo in a speech bubble with a tail, wider than the text, caption below. |

Components for the rich parts (the collection color applies automatically):

```mdx
<Figure credit="Foto: Lara Cuenta">
  ![El Obelisco entre árboles al anochecer](./img-8855.webp "Los árboles de la redoma…")
</Figure>

<Carousel title="Mirarlo desde abajo" description="Una serie fotografiada en la redoma…">
  ![La escultura roja](./img-8848.webp "La escultura roja a los pies del monumento.")
  ![El Obelisco centrado](./img-8859.webp "«1552 · 1952»: cuatro siglos en dos cifras.")
</Carousel>

<Timeline title="Cuatro fechas para una columna" description="Lo que pasó alrededor…">
  <Moment date="1552">Juan de Villegas funda Nueva Segovia de Barquisimeto…</Moment>
  <Moment date="1952">Cuatricentenario. Se inaugura el Obelisco…</Moment>
</Timeline>

<Quote by="Carmen" detail="80 años, vecina del oeste">
  Mi papá me trajo a ver cómo lo inauguraban…
</Quote>

<Testimony by="José Gregorio" detail="34 años, vive en Bogotá desde 2017">
  «Cuando vuelvo de viaje y veo el Obelisco…»
</Testimony>
```

Not in the concept yet (need a design pass before building, so they are out of the
pixel-perfect scope): `<BeforeAfter>` for "Lara: antes y ahora", `<FullBleed>` for
"Costumbres", video/audio embeds.

Avatars are derived from the name (initial + a brand color), so the editor never picks
colors. An authoring guide (`docs/writing-stories.md`) ships with phase 5.

## 7. Visual verification harness

`scripts/visual/compare.mjs` (devDependencies: `playwright-core`, `pixelmatch`,
`pngjs`; uses the installed Google Chrome via `channel: "chrome"`, no browser download).

- Pairs: `index.html ↔ /`, `archive.html ↔ /archivo`, `post.html ↔ /historias/el-obelisco`.
- Viewports: 1440×900 and 390×844 (plus 360×780 as a sanity pass).
- Stabilization: `reducedMotion: "reduce"`, wait for `document.fonts.ready`, force lazy
  images to load, hide the caret, fixed clock for "hace 2 días".
- **Geometry diff** (primary, text output): collects every element with a `class` in DOM
  order on both pages, pairs them by `(class, index)` and reports the first boxes that
  differ by more than 1 px, with selector and delta. This tells an agent exactly where
  to look.
- **Pixel diff** (proof): full-page and per-section crops (header, hero, recent, about,
  contact, footer, …); writes `concept.png`, `astro.png`, `diff.png` and a mismatch
  percentage to `.local/visual/<page>-<viewport>/`.
- Interaction states: nav open (390), hero thumb 2 active, ⋮ menu open, archive filtered
  to "patrimonio", "Cargar más" expanded, a comment appended.
- Pass criteria: 0 geometry deltas > 1 px; pixel mismatch < 0.5 % per section (photo
  re-encoding by `astro:assets` leaves sub-perceptual noise). Any known, accepted
  difference is listed in `scripts/visual/allowlist.json` with a reason.

`npm run visual` runs it against the dev server; `npm run visual -- --page post --vp 390`
narrows it.

## 8. Phases

Each phase ends with `npm run build`, `npm run lint:css` and `npm run visual` green for
everything built so far, then Opus reviews the diff before the next wave.

| Phase | Owner | Work | Parallel |
| --- | --- | --- | --- |
| 0. Spikes | Opus | (a) `@custom-media` across `@import` with Lightning CSS in Astro; (b) Markdown images inside MDX components receive optimized images through a `components.img` override; (c) Playwright with `channel: "chrome"`. Each one has a fallback if it fails (PostCSS custom media; explicit `import` in MDX; `--headless` CLI). | – |
| 1. Foundation | Opus | Remove Tailwind (deps, prettier plugin, `global.css`); Lightning CSS; tokens; **port `styles.css` into `src/styles/` tokenized**; stylelint guard; `site.ts`, `strings.ts`, collections data; content schema; photo import script (strip metadata) and fixtures; `Base` layout + `SvgDefs`; harness + concept baselines. | – |
| 2. Primitives | Haiku ×1 | `Icon`, `Button`, `Tag`, `Avatar`, `PhotoBubble`. | – |
| 3. Frame + cards | Haiku ×2 | A: `SiteHeader`, `SiteFooter`, `SocialLinks`. B: `StoryCard`. | A ∥ B |
| 4. Pages | Haiku ×3 | A: home (`Hero`, `RecentStories`, `About`, `Contact`). B: archive (`ArchiveBanner`, `CollectionNav`, `CollectionGroup`). C: article shell (`ArticleHeader`, `ArticleCover`, `Share`, `Comments`, story page). | A ∥ B ∥ C |
| 5. MDX kit | Haiku ×1 | `Figure`, `Carousel`, `Timeline` + `Moment`, `Quote`, `Testimony`, `img` mapping; rewrite the Obelisco fixture with them; `docs/writing-stories.md`. | – |
| 6. Behaviour | Haiku ×1 | Port each `main.js` block into its component `<script>`; interaction-state diffs. | – |
| 7. Final pass | Opus | Full harness at 1440/390/360, keyboard and reduced-motion checks, `CLAUDE.md` update, cleanup. | – |

## 9. Task card template (what each Haiku agent receives)

```
Goal: <component(s)> for the Astro migration of concept "Conversación".
Read first: docs/migration-plan.md §2–§5 and CLAUDE.md.
Concept markup: .local/design/2-conversacion/<page>.html lines <a>–<b>.
CSS: already ported in src/styles/<files>. Do not edit CSS unless the harness proves a
  difference; if you must, use existing tokens only and say why in your report.
Behaviour (if any): .local/design/2-conversacion/main.js block "<name>".
Files to create: <list>. Props: <list>. Data comes from <collection/config>.
Rules: copy class names and DOM structure verbatim (the geometry diff pairs elements by
  class and order); UI copy from strings.ts; no new dependencies; no Tailwind; no
  component <style> blocks.
Done when: npm run build, npm run lint:css and
  npm run visual -- --page <page> --vp 1440 and --vp 390 report 0 geometry deltas
  in <sections>. Report: files touched, harness output, anything you could not match.
```

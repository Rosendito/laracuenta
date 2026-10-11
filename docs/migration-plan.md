# Migration plan: concept "Conversación" → Astro

Source of truth for the visual result: `.local/design/2-conversacion/` (`index.html`,
`archive.html`, `post.html`, `styles.css`, `main.js`). The goal is a **pixel-perfect**
Astro build of those three pages at 1440 px and 390 px, verified by an automated
screenshot + geometry diff, with the article body authored in MDX.

Status: **done** (phases 0–7). Final result: 0 geometry deltas and 0.00 % design-pixel
mismatch on all three pages at 1440/390/360 px and in all six interaction states, on both
the dev server and the production build; photo re-encoding noise 0.09–0.59 %.

Orchestration: Opus owns the foundation (tokens, CSS port, harness, content model) and
reviews every task; Haiku agents implement components from self-contained task cards.

## 1. Decisions

| Topic       | Decision                                                                                                                                                                                                                                                                               |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language    | Articles, UI copy and URLs in Spanish (committed). Code, comments, docs, commits in English. See `CLAUDE.md`.                                                                                                                                                                          |
| Styling     | **No Tailwind.** Plain CSS with BEM class names kept **identical** to the concept, split by semantics in `src/styles/`, no component-scoped `<style>`.                                                                                                                                 |
| Tokens      | Every raw value lives in `src/styles/tokens/`. Values used once live as a local custom property at the top of their block. A stylelint rule rejects raw values anywhere else.                                                                                                          |
| Cascade     | `src/styles/main.css` imports files in the **same order as the concept sections 1–14**. No `@layer` (it would change how the cascade resolves vs. the concept).                                                                                                                        |
| Breakpoints | `@custom-media` tokens, compiled by Lightning CSS (`vite.css.transformer = "lightningcss"`; it only resolves them when `targets` are set, which Vite does).                                                                                                                            |
| Photos      | Committed next to each story (`src/content/stories/<slug>/`) or in `src/assets/photos/` for site-wide ones, optimized by `astro:assets`. Cloudflare limits (20k files, 25 MiB/file) are far away; no R2 needed. Source files are re-encoded without metadata (EXIF/GPS) before commit. |
| Markdown    | Astro 7 uses the Sätteri processor: no remark/rehype plugins. `src/lib/unwrap-images.mjs` (an mdast plugin) removes the `<p>` around standalone images so they can render as `<figure>`.                                                                                               |
| JS          | No framework islands. Each `main.js` block becomes a `<script>` inside its component (Astro bundles and dedupes it). Every page works without JS.                                                                                                                                      |
| Comments    | Static mockup, as in the concept.                                                                                                                                                                                                                                                      |
| Forms       | Post to an external endpoint configured in `src/config/site.ts`.                                                                                                                                                                                                                       |
| Routes      | `/` · `/historias` (archive) · `/historias/[slug]` · collection anchors `#antes`, `#patrimonio`, `#gente`, `#costumbres`.                                                                                                                                                                          |

## 2. Styles architecture

```
src/styles/
  main.css          imports in the concept's cascade order (do not reorder)
  tokens/           color · type · space · shape · elevation · motion · layout · media
  base/             reset · accessibility
  layout/           wrap · site-header · site-footer
  components/       icon · button · eyebrow · tag · collection · bubble · social · card ·
                    avatar · card-grid · section-head · arrow-btn · form · chip
  sections/         hero · recent · about · contact · archive-banner · collection-nav ·
                    collection-group
  article/          article · overflow-menu · prose · quote · carousel · timeline · figure ·
                    share · comments
  utilities/        mockup-note
```

The files were generated from the concept stylesheet by line ranges (order kept) with
every value replaced by a token holding the same value. `npm run visual:port` renders
the concept HTML with the compiled `src/styles` and compares it with the concept: it
reports 0 geometry deltas and 0.00 % pixel mismatch on every page at 1440/390/360 and in
every interaction state. Run it after any CSS change.

Rules for anyone editing CSS (enforced by `npm run lint:css`):

1. Outside `tokens/`, colors, font sizes/weights, line heights, letter spacing, spacing
   (gap, margin, padding, inset, offsets), radii, borders, shadows, z-index, durations and
   sizes (width/height) accept only `var(--…)`, `0`, keywords, and relative units
   (`%`, `vw`, `vh`, `svh`, `fr`, `deg`).
2. A value that exists only once in the design is a local custom property declared at
   the top of its rule (`--hero-min-height: clamp(…)`). Variants (`:nth-child`, `@media`)
   redefine that property instead of the declaration.
3. Never invent a value. If the concept doesn't have it, ask; the reviewer decides
   whether it becomes a token.
4. Class names are the concept's, verbatim. Don't rename, don't merge.

Known concept quirk kept on purpose: `.collection .card { --col-deep: var(--col-deep) }`
is a self-reference, so archive cards fall back to `--color-accent-text` for the CTA
and hover color.

## 3. Tokens

See `src/styles/tokens/`. Naming:

- `--color-*` for every color: brand palette (`--color-orange`…), surfaces
  (`--color-page`, `--color-card`, `--color-line`, `--color-night`), text
  (`--color-text`, `--color-text-soft`, `--color-text-inverse`), interactive
  (`--color-accent`…), translucent steps (`--color-night-a45`) and mixes.
  Collections keep `--col-<id>-hue` / `--col-<id>-deep`; `.col-<id>` sets the
  contextual `--col-hue` / `--col-deep`.
- `--text-*` font sizes, `--weight-*`, `--leading-*`, `--tracking-*`, `--font-serif|sans`.
- `--space-1…15` (rem), `--space-em-1…8` (em), `--gutter`, `--section`.
- `--radius-*`, `--shape-bubble[-right|-top]`, `--border-*`.
- `--shadow-*`, `--ring-sun`, `--text-shadow-*`, `--z-*`.
- `--ease`, `--duration-*`, `--delay-step-*`.
- `--wrap`, `--measure`, `--wide`, `--size-*`; breakpoints as `@custom-media`
  (`--upto-xs` 480 · `--upto-sm` 600 · `--upto-md` 700 · `--upto-lg` 860 · `--from-lg`
  861 · `--upto-xl` 960 · `--upto-2xl` 1100 · `--reduced-motion`).

## 4. Components

Rule: something is a component only if it is reused, takes data, or owns a script.
Everything else is plain markup inside the section that uses it (for example
`<span class="eyebrow">`, `<div class="card-grid">`, the chips, the forms).

### Layout and frame

| Component            | Props                                  | Notes                                                                                                             |
| -------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `layouts/Base.astro` | `title`, `description`, `image?`       | `<head>` (fonts, meta, OG), skip link, `SvgDefs`, `SiteHeader`, `<main id="contenido">`, `SiteFooter`.            |
| `SvgDefs.astro`      | –                                      | The two bubble `clipPath`s and the icon `<symbol>` sprite, once per page.                                         |
| `SiteHeader.astro`   | `current: "home" \| "archive" \| null` | Logo, nav with `aria-current` + tail, social links, mobile toggle (script).                                       |
| `SiteFooter.astro`   | –                                      | Brand block, nav and policy lists, newsletter form (posts to `site.forms.newsletter`), social links, mockup note. |
| `SocialLinks.astro`  | –                                      | From `site.ts`. Used 3 times.                                                                                     |

### Primitives

| Component           | Props                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Icon.astro`        | `name`, `class?` → `<svg class="icon"><use href="#i-…"/></svg>`                                                           |
| `Button.astro`      | `href?`, `variant?: "sun" \| "ghost" \| "ghost-light"`, `size?: "sm"`, `icon?`, `type?` (renders `<a>` or `<button>`)     |
| `Tag.astro`         | `collection`, `short?`, `href?`                                                                                           |
| `Avatar.astro`      | `name` (initials and color derived), `tone?` override                                                                     |
| `PhotoBubble.astro` | `image`, `alt`, `widths`, `wide?` (uses the clip-path)                                                                    |
| `StoryCard.astro`   | `story`, `variant: "home" \| "archive"`, `hidden?` (archive variant adds byline + comment count and the short "Leer" CTA) |

### Sections

| Page    | Components                                                                                                                                                                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home    | `Hero` (background `<picture>` with mobile source, credit, bubble panel with 4 thumbs; script = gallery) · `RecentStories` (section head + 3 latest cards) · `About` (six scattered photos) · `Contact` (copy, note, contact form) |
| Archive | `ArchiveBanner` (four tinted collection columns) · `CollectionNav` (sticky chips; script = filter, deep links and "Cargar más") · `CollectionGroup` (header + grid, 3 visible, rest `hidden`, load-more button)                    |
| Article | `ArticleHeader` (meta row, ⋮ menu with its script, title, tag, lead, byline) · `ArticleCover` (full-bleed cover + caption) · `Share` (copy link script) · `Comments` (mockup data + local append script)                           |

### MDX kit

`Figure` · `Carousel` · `Timeline` + `Moment` · `Quote` · `Testimony` (see §6).

### Pages

`pages/index.astro` · `pages/historias/index.astro` · `pages/historias/[slug].astro` (prose
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

| Write                                    | Result                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| Paragraphs                               | Body text; the first paragraph gets the drop cap in the collection color.   |
| `## Subtítulo`                           | Subheading with the divider.                                                |
| `**negrita**`, `*cursiva*`, links, lists | Styled prose.                                                               |
| `![alt](./foto.webp "Pie de foto")`      | A photo in a speech bubble with a tail, wider than the text, caption below. |

Components for the rich parts (the collection color applies automatically):

```mdx
<Figure credit="Foto: Lara Cuenta">
  ![El Obelisco entre árboles al anochecer](./img-8855.webp "Los árboles de la redoma…")
</Figure>

<Carousel title="Mirarlo desde abajo" description="Una serie fotografiada en la redoma…">
  ![La escultura roja](./img-8848.webp "La escultura roja a los pies del monumento.") ![El Obelisco
  centrado](./img-8859.webp "«1552 · 1952»: cuatro siglos en dos cifras.")
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

- Pairs: `index.html ↔ /`, `archive.html ↔ /historias`, `post.html ↔ /historias/el-obelisco`.
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
- Two pixel passes: **design** (photos hidden with `visibility: hidden`, layout kept):
  < 0.5 % per section; **photos** (visible): < 2 % of the page, since `astro:assets`
  resizes and re-encodes on purpose (responsive `srcset`, not the 1800 px originals).
- Pass criteria: 0 geometry deltas > 1 px, both pixel passes under their limits. Any known,
  accepted difference is listed in `scripts/visual/allowlist.json` with a reason (empty
  today; the concept's two copy inconsistencies were harmonized in the local reference:
  three archive excerpts now match the home, and the home's third recent story is the
  actual third newest. Originals kept as `*.original.html`).

`npm run visual` runs it against the dev server; `npm run visual -- --page post --vp 390`
narrows it.

## 8. Phases

Each phase ends with `npm run build`, `npm run lint:css` and `npm run visual` green for
everything built so far, then Opus reviews the diff before the next wave.

| Phase            | Owner    | Work                                                                                                                                                                                                                                                                                                                       | Parallel  |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 0. Spikes        | Opus     | (a) `@custom-media` across `@import` with Lightning CSS in Astro; (b) Markdown images inside MDX components receive optimized images through a `components.img` override; (c) Playwright with `channel: "chrome"`. Each one has a fallback if it fails (PostCSS custom media; explicit `import` in MDX; `--headless` CLI). | –         |
| 1. Foundation    | Opus     | Remove Tailwind (deps, prettier plugin, `global.css`); Lightning CSS; tokens; **port `styles.css` into `src/styles/` tokenized**; stylelint guard; `site.ts`, `strings.ts`, collections data; content schema; photo import script (strip metadata) and fixtures; `Base` layout + `SvgDefs`; harness + concept baselines.   | –         |
| 2. Primitives    | Haiku ×1 | `Icon`, `Button`, `Tag`, `Avatar`, `PhotoBubble`.                                                                                                                                                                                                                                                                          | –         |
| 3. Frame + cards | Haiku ×2 | A: `SiteHeader`, `SiteFooter`, `SocialLinks`. B: `StoryCard`.                                                                                                                                                                                                                                                              | A ∥ B     |
| 4. Pages         | Haiku ×3 | A: home (`Hero`, `RecentStories`, `About`, `Contact`). B: archive (`ArchiveBanner`, `CollectionNav`, `CollectionGroup`). C: article shell (`ArticleHeader`, `ArticleCover`, `Share`, `Comments`, story page).                                                                                                              | A ∥ B ∥ C |
| 5. MDX kit       | Haiku ×1 | `Figure`, `Carousel`, `Timeline` + `Moment`, `Quote`, `Testimony`, `img` mapping; rewrite the Obelisco fixture with them; `docs/writing-stories.md`.                                                                                                                                                                       | –         |
| 6. Behaviour     | Haiku ×1 | Port each `main.js` block into its component `<script>`; interaction-state diffs.                                                                                                                                                                                                                                          | –         |
| 7. Final pass    | Opus     | Full harness at 1440/390/360, keyboard and reduced-motion checks, `CLAUDE.md` update, cleanup.                                                                                                                                                                                                                             | –         |

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

# Writing stories

Each story is a folder under `src/content/stories/<slug>/` with an `index.mdx` file and
its photos. The slug becomes the URL: `/historias/<slug>`.

## 1. Create the folder and import photos

```sh
npm run photo -- el-obelisco ~/Downloads/IMG_8854.HEIC ~/Downloads/IMG_8848.jpg
```

The script converts HEIC files (macOS `sips`), limits the long edge to 2400 px, encodes
WebP and removes all metadata (EXIF, GPS, XMP). Files land in the story folder with a
lowercase, dashed name. Existing files are skipped.

Then create `src/content/stories/<slug>/index.mdx`, starting from the frontmatter below.

## 2. Frontmatter

Field names are fixed (see `src/content.config.ts`). Values are in Spanish.

```yaml
---
title: "El Obelisco: 400 años en una columna blanca"
description: "Excerpt for cards and the meta description."
lead: "Serif lead shown under the title."
date: 2026-10-08
collection: patrimonio # antes | patrimonio | gente | costumbres
cover: ./img-8854.webp
coverAlt: "Alt text for the cover."
coverCaption: "Optional caption under the cover."
coverCredit: "Foto: Lara Cuenta."
card: # optional: a card photo that differs from the cover
  image: ./obelisco-desde-abajo.webp
  alt: "Alt text for the card photo."
featured: # optional: shows the story in the home hero
  order: 2
  image: ./img-8854.webp
  imageMobile: ./img-8848.webp # optional
  thumb: ./img-8859.webp # optional
  alt: "Alt text."
  credit: "Redoma del Obelisco, 18:50 · Foto: Lara Cuenta"
readingTime: 6 # optional; computed from the body when missing
commentCount: 18 # optional; mockup only
draft: false
---
```

Images in frontmatter are relative paths (`./file.webp`) and are optimized by Astro.

## 3. Body: Markdown

Plain Markdown covers most of an article.

```md
Primer párrafo. La primera letra recibe la capital de color.

## Subtítulo con divisor

Texto con **negrita**, _cursiva_ y [enlaces](https://example.com).
```

## 4. Body: images with captions

A standalone image is a photo in a speech bubble with its caption below. The text in
quotes after the path is the caption; the alt text is required.

```md
![El Obelisco entre árboles al anochecer, con la escultura roja.](./img-8855.webp "Los árboles de la redoma, sembrados en los años ochenta.")
```

## 5. Figure with credit

Wrap one image to add a photo credit at the end of its caption.

```mdx
<Figure credit="Foto: Lara Cuenta.">

![El Obelisco entre árboles al anochecer.](./img-8855.webp "Los árboles de la redoma ya le hacen sombra a la base.")

</Figure>
```

## 6. Carousel

A horizontal strip of photos with arrows and dots. Put one image per paragraph inside.

```mdx
<Carousel title="Mirarlo desde abajo" description="Una serie fotografiada en la redoma.">

![La escultura roja a los pies del monumento.](./img-8848.webp "La escultura roja a los pies del monumento.")

![El Obelisco centrado y simétrico.](./img-8859.webp "«1552 · 1952»: cuatro siglos en dos cifras.")

</Carousel>
```

`label` (optional) sets the accessible name of the strip; it defaults to `title`.

## 7. Timeline and Moment

A dated list. Each `Moment` takes a visible `date` and an optional `datetime` for the
machine-readable value (`datetime` defaults to `date`).

```mdx
<Timeline title="Cuatro fechas para una columna" description="Lo que pasó alrededor del Obelisco.">
  <Moment date="1552">Juan de Villegas funda la ciudad.</Moment>
  <Moment date="1970–1990" datetime="1970">
    La avenida crece hasta rodearlo.
  </Moment>
</Timeline>
```

## 8. Quote

A pull quote with the speaker's avatar. `detail` is optional, and `tone` is one of
`sun`, `terracotta`, `orange` or `none` (the default is derived from the name).

```mdx
<Quote by="Carmen" detail="80 años, vecina del oeste" tone="sun">
  Mi papá me trajo a ver cómo lo inauguraban.
</Quote>
```

## 9. Testimony

The same props as `Quote`, for a first-person testimony. Use the quotation marks «» in
the text.

```mdx
<Testimony by="José Gregorio" detail="34 años, vive en Bogotá desde 2017" tone="orange">
  «Cuando vuelvo de viaje y veo el Obelisco desde la ventanilla, sé que ya llegué».
</Testimony>
```

## Checklist

- Every image has alt text. The caption is optional.
- Blank lines separate blocks inside components (MDX needs them to parse Markdown).
- Run `npm run dev` and open `/historias/<slug>` to check the result.

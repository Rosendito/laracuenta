// Link-preview images (Open Graph / Twitter cards), rendered at build time: Satori lays
// out the card as SVG, resvg rasterizes it and sharp encodes the final JPEG.
// Layout: the logo and the text on cream on the left, the photo on the right.
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { Resvg } from "@resvg/resvg-js";
import type { ImageMetadata } from "astro";
import satori from "satori";
import sharp from "sharp";

import type { CollectionId } from "../data/collections";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
const PANEL = 600;
const PAD = 60;

// brand colors (src/styles/tokens/color.css)
const CREAM = "#f8e9d2";
const INK = "#422818";
const TEXT_SOFT = "#6b4a33";

/** Deep tone of each collection, readable on cream (--col-*-deep). */
export const collectionColor: Record<CollectionId, string> = {
  antes: "#7a4f06",
  patrimonio: "#9a4a26",
  gente: "#9a4f1c",
  costumbres: "#54331c",
};

const root = process.cwd();
const fontFile = (pkg: string, file: string) =>
  readFile(join(root, "node_modules/@fontsource", pkg, "files", file));

const fonts = Promise.all([
  fontFile("dm-serif-display", "dm-serif-display-latin-400-normal.woff"),
  fontFile("montserrat", "montserrat-latin-500-normal.woff"),
  fontFile("montserrat", "montserrat-latin-700-normal.woff"),
]).then(([serif, sans, sansBold]) => [
  { name: "DM Serif Display", data: serif, weight: 400 as const, style: "normal" as const },
  { name: "Montserrat", data: sans, weight: 500 as const, style: "normal" as const },
  { name: "Montserrat", data: sansBold, weight: 700 as const, style: "normal" as const },
]);

// the logo SVG is embedded as is, so its masks render exactly as on the site
const LOGO_RATIO = 1066.3 / 513.67;
const logo = readFile(join(root, "public/laracuenta-logo.svg")).then(
  (svg) => `data:image/svg+xml;base64,${svg.toString("base64")}`,
);

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

/** Longer titles get a smaller size so they fit the panel. */
const titleSize = (title: string) => (title.length <= 40 ? 60 : title.length <= 56 ? 52 : 44);

interface Card {
  /** An imported image (a story cover, a site photo). */
  photo: ImageMetadata;
  /** Article title; omitted on the site-wide card, which shows a larger logo. */
  title?: string;
  /** Small uppercase line above the title (the collection), or the tagline. */
  label: string;
  labelColor?: string;
}

export async function renderOgImage({ photo, title, label, labelColor = INK }: Card) {
  // imported images keep the path of their source file in a hidden fsPath property
  const source = (photo as ImageMetadata & { fsPath?: string }).fsPath;
  if (!source) throw new Error(`og: no source file for ${photo.src}`);
  const photoData = await sharp(source)
    .resize(OG_WIDTH - PANEL, OG_HEIGHT, { fit: "cover" })
    .jpeg({ quality: 90 })
    .toBuffer();
  const logoWidth = title ? 230 : 400;

  const text = title
    ? h("div", { display: "flex", flexDirection: "column", gap: 18 }, [
        h(
          "div",
          {
            fontFamily: "Montserrat",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: labelColor,
          },
          label,
        ),
        h(
          "div",
          {
            fontFamily: "DM Serif Display",
            fontSize: titleSize(title),
            lineHeight: 1.06,
            color: INK,
          },
          title,
        ),
      ])
    : h(
        "div",
        {
          fontFamily: "Montserrat",
          fontWeight: 500,
          fontSize: 30,
          lineHeight: 1.3,
          color: TEXT_SOFT,
        },
        label,
      );

  const card = h(
    "div",
    { width: OG_WIDTH, height: OG_HEIGHT, display: "flex", background: CREAM },
    [
      h(
        "div",
        {
          width: PANEL,
          height: OG_HEIGHT,
          flexShrink: 0,
          boxSizing: "border-box",
          padding: PAD,
          display: "flex",
          flexDirection: "column",
          justifyContent: title ? "space-between" : "center",
          gap: title ? 0 : 36,
        },
        [
          h("img", { width: logoWidth, height: logoWidth / LOGO_RATIO }, undefined, {
            src: await logo,
            width: logoWidth,
            height: logoWidth / LOGO_RATIO,
          }),
          text,
        ],
      ),
      h("img", { width: OG_WIDTH - PANEL, height: OG_HEIGHT, objectFit: "cover" }, undefined, {
        src: `data:image/jpeg;base64,${photoData.toString("base64")}`,
        width: OG_WIDTH - PANEL,
        height: OG_HEIGHT,
      }),
    ],
  );

  const svg = await satori(card as never, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await fonts,
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } }).render().asPng();
  return sharp(png).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}

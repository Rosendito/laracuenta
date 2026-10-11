// The four editorial collections. Each one has its own color (see
// src/styles/components/collection.css: .col-<id>).
import type { ImageMetadata } from "astro";

import antesBanner from "../assets/photos/img-8843.webp";
import costumbresBanner from "../assets/photos/img-8870.webp";
import genteBanner from "../assets/photos/img-8852.webp";
import patrimonioBanner from "../assets/photos/img-8854.webp";

export const collectionIds = ["antes", "patrimonio", "gente", "costumbres"] as const;
export type CollectionId = (typeof collectionIds)[number];

export interface Collection {
  id: CollectionId;
  number: number;
  /** Full name: archive headings, chips, article tag. */
  name: string;
  /** Name on card and hero tags. */
  short: string;
  /** Label on the archive banner column. */
  banner: string;
  description: string;
  bannerImage: ImageMetadata;
  /** Avatar color on archive bylines. */
  avatarTone: "sun" | "terracotta" | "orange";
}

export const collections: Record<CollectionId, Collection> = {
  antes: {
    id: "antes",
    number: 1,
    name: "Lara: antes y ahora",
    short: "Lara: antes y ahora",
    banner: "Antes y ahora",
    description:
      "Comparación de fotografías históricas y actuales para documentar cómo se transforman los lugares de la región.",
    bannerImage: antesBanner,
    avatarTone: "sun",
  },
  patrimonio: {
    id: "patrimonio",
    number: 2,
    name: "Patrimonio y memoria de los lugares",
    short: "Patrimonio y memoria",
    banner: "Patrimonio",
    description:
      "Edificaciones, monumentos y espacios de valor cultural: conservados, transformados, desaparecidos o en riesgo.",
    bannerImage: patrimonioBanner,
    avatarTone: "terracotta",
  },
  gente: {
    id: "gente",
    number: 3,
    name: "Historias de nuestra gente",
    short: "Historias de nuestra gente",
    banner: "Nuestra gente",
    description:
      "Microcrónicas, perfiles y testimonios que preservan la memoria oral de quienes hacen la identidad larense.",
    bannerImage: genteBanner,
    avatarTone: "orange",
  },
  costumbres: {
    id: "costumbres",
    number: 4,
    name: "Costumbres y memoria cultural",
    short: "Costumbres y memoria",
    banner: "Costumbres",
    description:
      "Tradiciones, gastronomía, música, oficios y prácticas sociales que forman la memoria colectiva de Lara.",
    bannerImage: costumbresBanner,
    avatarTone: "sun",
  },
};

export const collectionList = collectionIds.map((id) => collections[id]);

/** The archive page lists every story, grouped by collection; stories live under it. */
export const archivePath = "/historias";

export const archiveHref = (id: CollectionId) => `${archivePath}#${id}`;

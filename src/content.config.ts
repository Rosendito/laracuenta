import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { collectionIds } from "./data/collections";

const stories = defineCollection({
  loader: glob({ pattern: "*/index.mdx", base: "./src/content/stories" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Card excerpt and meta description. */
      description: z.string(),
      /** Serif lead under the title. */
      lead: z.string(),
      date: z.coerce.date(),
      collection: z.enum(collectionIds),
      cover: image(),
      coverAlt: z.string(),
      coverCaption: z.string().optional(),
      coverCredit: z.string().optional(),
      /** Card photo when it should differ from the cover. */
      card: z.object({ image: image(), alt: z.string() }).optional(),
      /** Shown in the home hero, in this order. */
      featured: z
        .object({
          order: z.number().int(),
          image: image(),
          imageMobile: image().optional(),
          thumb: image().optional(),
          alt: z.string(),
          credit: z.string(),
        })
        .optional(),
      /** Minutes; computed from the body when missing. */
      readingTime: z.number().int().positive().optional(),
      /** Mockup only, until comments exist. */
      commentCount: z.number().int().nonnegative().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { stories };

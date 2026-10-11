import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { CATEGORIES } from "./site.config";

// One folder per post: content/posts/<slug>/index.mdx (+ images/).
const posts = defineCollection({
  loader: glob({
    pattern: "*/index.{md,mdx}",
    base: "./content/posts",
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(CATEGORIES),
    excerpt: z.string(),
    // Path relative to the post folder, e.g. ./images/cover.jpg
    cover: z.string(),
    coverAlt: z.string().default(""),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };

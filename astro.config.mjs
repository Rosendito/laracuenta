import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import { unwrapImages } from "./src/lib/unwrap-images.mjs";

export default defineConfig({
  // Set to the production domain once it is bought (needed for the sitemap).
  site: "https://example.com",
  integrations: [mdx(), sitemap()],
  markdown: { processor: satteri({ mdastPlugins: [unwrapImages] }) },
  vite: {
    css: {
      transformer: "lightningcss",
      lightningcss: { drafts: { customMedia: true } },
    },
  },
});

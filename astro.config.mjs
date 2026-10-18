import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import { unwrapImages } from "./src/lib/unwrap-images.mjs";

export default defineConfig({
  // Production URL: used for the sitemap, canonical links and link-preview images.
  // Change it here when the site moves to its own domain.
  site: "https://laracuenta.marilouzz.workers.dev",
  integrations: [
    mdx(),
    // study pages under /_learning/ stay out of search engines (src/lib/learning.ts)
    sitemap({ filter: (page) => !page.includes("/_learning/") }),
  ],
  devToolbar: { enabled: false },
  markdown: { processor: satteri({ mdastPlugins: [unwrapImages] }) },
  vite: {
    css: {
      transformer: "lightningcss",
      lightningcss: { drafts: { customMedia: true } },
    },
  },
});

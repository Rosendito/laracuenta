import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

import remarkMedia from "./src/lib/remark-media.mjs";

export default defineConfig({
  // Wix static hosting only serves explicit .html paths (see spikes/wix-hello).
  build: { format: "file" },
  markdown: { remarkPlugins: [remarkMedia] },
  integrations: [mdx()],
});

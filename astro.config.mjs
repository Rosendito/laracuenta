import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Set to the production domain once it is bought (needed for the sitemap).
  site: "https://example.com",
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});

// robots.txt: the whole public site may be crawled; points crawlers at the sitemap.
// Study pages under /_learning/ are not blocked here on purpose: crawlers must reach
// them to read their noindex (see src/lib/learning.ts).
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("/sitemap-index.xml", site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

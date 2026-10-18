// Private study pages served under /_learning/. Astro skips folders that start with
// an underscore, so the prefix comes from a route parameter instead. These pages are
// kept out of search engines three ways: a robots meta tag (Learning layout), an
// X-Robots-Tag header (public/_headers) and the sitemap filter (astro.config.mjs).

export const learningPrefix = "_learning";

export function learningPaths() {
  return [{ params: { learning: learningPrefix } }];
}

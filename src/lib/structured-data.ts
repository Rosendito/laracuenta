// Structured data (schema.org JSON-LD) for search engines: the outlet on every page
// and a NewsArticle on each story.
import { authorHref, site } from "../config/site";
import { isoDate, storyHref, type Story } from "./stories";

const abs = (path: string, base: URL) => new URL(path, base).href;

function publisher(base: URL) {
  return {
    "@type": "NewsMediaOrganization",
    name: site.name,
    url: abs("/", base),
    logo: { "@type": "ImageObject", url: abs("/laracuenta-logo.svg", base) },
    sameAs: site.social.map((s) => s.href),
  };
}

export function websiteData(base: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: abs("/", base),
    description: site.description,
    inLanguage: site.locale,
    publisher: publisher(base),
  };
}

export function articleData(story: Story, base: URL) {
  const url = abs(`${storyHref(story)}/`, base);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.data.title,
    description: story.data.description,
    image: [abs(`/og/${story.id}.jpg`, base)],
    datePublished: isoDate(story.data.date),
    inLanguage: site.locale,
    mainEntityOfPage: url,
    url,
    author: {
      "@type": "Person",
      name: site.author.name,
      jobTitle: site.author.jobTitle,
      url: abs(`${authorHref}/`, base),
    },
    publisher: publisher(base),
  };
}

import { getCollection, type CollectionEntry } from "astro:content";

import { site } from "../config/site";

export type Story = CollectionEntry<"stories">;

/** Published stories, newest first. */
export async function getStories(): Promise<Story[]> {
  const stories = await getCollection("stories", ({ data }) => !data.draft);
  return stories.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const storyHref = (story: Story) => `/historias/${story.id}`;

const dateFormat = new Intl.DateTimeFormat(site.dateLocale, { dateStyle: "long", timeZone: "UTC" });
export const formatDate = (date: Date) => dateFormat.format(date);
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/** Reading time in minutes at 200 words per minute, from the visible text of the body. */
export function readingTime(story: Story): number {
  if (story.data.readingTime) return story.data.readingTime;
  const text = (story.body ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, (image) => image.match(/"([^"]*)"/)?.[1] ?? "") // keep captions
    .replace(/<[A-Z]\w*([^>]*)>/g, (_, attrs: string) =>
      [...attrs.matchAll(/(?:title|description|date|by|detail)="([^"]*)"/g)]
        .map((m) => m[1])
        .join(" "),
    )
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/[#*_>`]/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Link-preview image of each story: its title, collection and cover.
import type { APIRoute, GetStaticPaths } from "astro";

import { collections } from "../../data/collections";
import { getStories, type Story } from "../../lib/stories";
import { collectionColor, renderOgImage } from "../../lib/og";

export const getStaticPaths = (async () => {
  const stories = await getStories();
  return stories.map((story) => ({ params: { slug: story.id }, props: { story } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ story: Story }> = async ({ props: { story } }) => {
  const { title, cover, collection } = story.data;
  const image = await renderOgImage({
    photo: cover,
    title,
    label: collections[collection].name,
    labelColor: collectionColor[collection],
  });
  return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/jpeg" } });
};

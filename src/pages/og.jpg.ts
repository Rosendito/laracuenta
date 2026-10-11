// Site-wide link-preview image, for pages without a cover of their own.
import type { APIRoute } from "astro";

import photo from "../assets/photos/img-8843.webp";
import { renderOgImage } from "../lib/og";
import { strings } from "../config/strings";

export const GET: APIRoute = async () => {
  const image = await renderOgImage({ photo, label: strings.ogTagline });
  return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/jpeg" } });
};

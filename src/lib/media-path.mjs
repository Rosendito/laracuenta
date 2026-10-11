// Shared by the Astro site, the remark plugin and scripts/optimize-media.mjs so the
// three agree on where an optimized image ends up.
import path from "node:path";

export const MEDIA_DIR = "public/media";
export const IMAGE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

/** "./images/foo.JPG" in post "my-post" -> "/media/posts/my-post/foo.webp" */
export function mediaPath(slug, relPath) {
  const name = path.basename(relPath).replace(IMAGE_EXT, ".webp").toLowerCase();
  return slug ? `/media/posts/${slug}/${name}` : `/media/site/${name}`;
}

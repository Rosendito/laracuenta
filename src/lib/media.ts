import { mediaPath } from "./media-path.mjs";

// Empty in dev (served from public/); the jsDelivr URL of a pushed commit in deploys.
const base = import.meta.env.PUBLIC_MEDIA_BASE ?? "";

export const mediaUrl = (slug: string, relPath: string) => base + mediaPath(slug, relPath);

export const siteImage = (name: string) => base + mediaPath(null, `./images/${name}`);

// Optimizes images referenced by the site into public/media (WebP, max 1600px wide).
//   content/posts/<slug>/images/*  -> public/media/posts/<slug>/*.webp
//   content/site/images/*          -> public/media/site/*.webp
// Skips files whose output is newer than the source.
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { IMAGE_EXT, MEDIA_DIR, mediaPath } from "../src/lib/media-path.mjs";

const sources = [];
for (const slug of await readdir("content/posts").catch(() => [])) {
  sources.push({ slug, dir: path.join("content/posts", slug, "images") });
}
sources.push({ slug: null, dir: "content/site/images" });

let done = 0;
let skipped = 0;
for (const { slug, dir } of sources) {
  const files = await readdir(dir).catch(() => []);
  for (const file of files.filter((f) => IMAGE_EXT.test(f))) {
    const src = path.join(dir, file);
    const out = path.join(MEDIA_DIR, "..", mediaPath(slug, file));
    const [srcStat, outStat] = await Promise.all([stat(src), stat(out).catch(() => null)]);
    if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++;
      continue;
    }
    await mkdir(path.dirname(out), { recursive: true });
    await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    done++;
  }
}
console.log(`media: ${done} optimized, ${skipped} up to date`);

// Rewrites relative images in posts (![](./images/x.jpg)) to their optimized
// copy, so authors reference the originals and Astro never bundles them.
import path from "node:path";

import { IMAGE_EXT, mediaPath } from "./media-path.mjs";

export default function remarkMedia() {
  const base = process.env.PUBLIC_MEDIA_BASE ?? "";

  return (tree, file) => {
    const slug = path.basename(path.dirname(file.path));
    const visit = (node) => {
      if (node.type === "image" && node.url.startsWith("./") && IMAGE_EXT.test(node.url)) {
        node.url = base + mediaPath(slug, node.url);
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

// Scaffolds content/posts/<slug>/index.mdx. Usage: npm run new -- "Post title"
import { mkdir, writeFile } from "node:fs/promises";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new -- "Post title"');
  process.exit(1);
}
const slug = title
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
const dir = `content/posts/${slug}`;
const today = new Date().toISOString().slice(0, 10);

await mkdir(`${dir}/images`, { recursive: true });
await writeFile(
  `${dir}/index.mdx`,
  `---
title: "${title.replaceAll('"', '\\"')}"
date: ${today}
category: then-and-now
excerpt: ""
cover: ./images/cover.jpg
coverAlt: ""
draft: true
---

Write the story here. Put photos in ./images and reference them as ![alt](./images/photo.jpg).
`,
  { flag: "wx" },
);
console.log(`Created ${dir}/index.mdx — add ${dir}/images/cover.jpg`);

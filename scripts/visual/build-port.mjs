// Builds .local/design/2-conversacion-port/: the concept HTML styled by the compiled
// src/styles instead of the concept stylesheet. Comparing it with the concept
// (compare.mjs --target port) validates the CSS port independently of Astro.
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { bundle } from "lightningcss";

const ROOT = resolve(import.meta.dirname, "../..");
const CONCEPT = join(ROOT, ".local/design/2-conversacion");
const PORT = join(ROOT, ".local/design/2-conversacion-port");
const FONTS =
  "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Montserrat:ital,wght@0,300..800;1,300..800&display=swap";

mkdirSync(PORT, { recursive: true });
const { code } = bundle({
  filename: join(ROOT, "src/styles/main.css"),
  drafts: { customMedia: true },
  // custom media only resolves when targets are set (Vite sets them in Astro)
  targets: { chrome: 111 << 16, safari: 16 << 16, firefox: 113 << 16 },
});
writeFileSync(join(PORT, "styles.css"), `@import url("${FONTS}");\n${code}`);
for (const file of ["index.html", "archive.html", "post.html", "main.js"]) {
  copyFileSync(join(CONCEPT, file), join(PORT, file));
}
console.log(`port built in ${PORT}`);

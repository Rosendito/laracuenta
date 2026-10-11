// Packs dist/ into the text bundle the Wix MCP upload tool expects
// (`=== FILE: <path> ===` sections). Images are served from jsDelivr, so dist/media
// is left out and every remaining file must be text.
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST = "dist";
const OUT = "dist-mcp-bundle.txt";
const TEXT = /\.(html|css|js|mjs|json|svg|txt|xml|webmanifest)$/i;
const MAX_FILE = 3 * 1024 * 1024;
const MAX_SITE = 20 * 1024 * 1024;

const entries = await readdir(DIST, { recursive: true, withFileTypes: true });
const files = entries
  .filter((e) => e.isFile())
  .map((e) => path.relative(DIST, path.join(e.parentPath, e.name)).split(path.sep).join("/"))
  .filter((p) => !p.startsWith("media/"))
  .sort((a, b) => (a === "index.html" ? -1 : b === "index.html" ? 1 : a.localeCompare(b)));

const binary = files.filter((p) => !TEXT.test(p));
if (binary.length) {
  console.error("Binary files can't travel in the bundle; serve them from jsDelivr:\n" + binary.join("\n"));
  process.exit(1);
}

let total = 0;
const parts = [];
for (const file of files) {
  const content = await readFile(path.join(DIST, file), "utf8");
  const size = Buffer.byteLength(content);
  if (size > MAX_FILE) throw new Error(`${file} is over 3 MB`);
  total += size;
  parts.push(`=== FILE: ${file} ===\n${content.endsWith("\n") ? content : content + "\n"}`);
}
if (total > MAX_SITE) throw new Error("Site is over 20 MB");

await writeFile(OUT, parts.join(""));
console.log(`${OUT}: ${files.length} files, ${(total / 1024).toFixed(1)} KB`);

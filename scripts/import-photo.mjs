// Prepares photos for a story: converts HEIC (macOS sips), limits the long edge to
// 2400px, encodes WebP and drops every metadata block (EXIF, GPS, XMP).
//
//   npm run photo -- <story-slug> <file> [<file> …]
//
// Files land in src/content/stories/<story-slug>/ with a lowercase, dashed name.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const [slug, ...files] = process.argv.slice(2);
if (!slug || !files.length) {
  console.error("Usage: npm run photo -- <story-slug> <file> [<file> …]");
  process.exit(1);
}

const dest = join("src/content/stories", slug);
mkdirSync(dest, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), "photo-"));

try {
  for (const file of files) {
    let input = file;
    if (/\.hei[cf]$/i.test(file)) {
      input = join(tmp, basename(file, extname(file)) + ".jpg");
      execFileSync("sips", ["-s", "format", "jpeg", file, "--out", input], { stdio: "ignore" });
    }
    const name =
      basename(file, extname(file))
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + ".webp";
    const out = join(dest, name);
    if (existsSync(out)) {
      console.error(`skip ${out} (exists)`);
      continue;
    }
    // sharp drops metadata unless asked to keep it; rotate() applies EXIF orientation first
    await sharp(input)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    console.log(`${file} → ${out}`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

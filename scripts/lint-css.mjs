// Rejects raw design values outside src/styles/tokens/. Every color, size, space,
// radius, shadow, z-index and duration must come from a token (var(--…)). A value
// used only once is declared as a local custom property at the top of its block.
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import postcss from "postcss";

const ROOT = "src/styles";
const GUARDED =
  /^(color|background(-color)?|border(-[a-z]+)*|outline(-[a-z]+)*|font-size|font-weight|line-height|letter-spacing|(row-|column-)?gap|margin(-[a-z]+)*|padding(-[a-z]+)*|inset(-[a-z]+)*|top|right|bottom|left|box-shadow|text-shadow|z-index|transition(-[a-z]+)*|animation(-[a-z]+)*|(min-|max-)?(width|height))$/;
const UNITLESS_IS_DESIGN = /^(font-weight|line-height|z-index)$/;

function stripVars(value) {
  let prev;
  do {
    prev = value;
    value = value.replace(/var\(--[\w-]+(,[^()]*)?\)/g, "");
  } while (value !== prev);
  return value;
}

function offending(prop, value) {
  const rest = stripVars(value)
    .replace(/#[0-9a-f]{3,8}\b/gi, (m) => ` HEX:${m} `)
    .replace(/\b(rgba?|hsla?|hwb|lab|lch|oklch|color-mix)\(/gi, (m) => ` COLORFN:${m} `);
  const found = [];
  for (const m of rest.matchAll(/HEX:#\w+|COLORFN:\w+\(/g)) found.push(m[0].split(":")[1]);
  for (const m of rest.matchAll(/(?<![\w-])(-?\d*\.?\d+)([a-z]+|%)?(?![\w-])/gi)) {
    const [, num, unit = ""] = m;
    if (Number(num) === 0) continue;
    if (["%", "vw", "vh", "svh", "dvh", "fr", "deg"].includes(unit)) continue;
    if (!unit && !UNITLESS_IS_DESIGN.test(prop)) continue;
    found.push(num + unit);
  }
  return found;
}

function* cssFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* cssFiles(path);
    else if (entry.name.endsWith(".css")) yield path;
  }
}

let errors = 0;
for (const file of cssFiles(ROOT)) {
  if (relative(ROOT, file).startsWith("tokens/")) continue;
  const root = postcss.parse(readFileSync(file, "utf8"), { from: file });
  root.walkDecls((decl) => {
    if (decl.prop.startsWith("--") || !GUARDED.test(decl.prop)) return;
    const bad = offending(decl.prop, decl.value);
    if (bad.length) {
      errors++;
      const sel = decl.parent.selector ?? `@${decl.parent.name}`;
      console.log(
        `${file}:${decl.source.start.line}  ${sel} { ${decl.prop}: ${decl.value} }  → ${bad.join(", ")}`,
      );
    }
  });
}
if (errors) {
  console.log(
    `\n${errors} raw value(s). Use a token from src/styles/tokens/ or a local custom property.`,
  );
  process.exit(1);
}
console.log("lint:css ok");

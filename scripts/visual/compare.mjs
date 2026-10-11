// Visual diff between the design concept (reference) and a candidate build.
//
//   node scripts/visual/compare.mjs [--page home|archive|post] [--vp 1440|390|360]
//                                   [--target astro|port] [--state <name>] [--limit 15]
//
// For every page × viewport it reports:
//   1. Geometry: elements paired by (tag + classes, index) whose box moved or
//      resized by more than 1px, in document order. The first one is the cause.
//   2. Pixels: mismatch per section and full page, with concept/candidate/diff PNGs
//      in .local/visual/<target>/<page>-<vp>[-<state>]/.
//
// Targets: "astro" = the dev server (npm run dev); "port" = the concept HTML with
// the compiled src/styles (validates the CSS port on its own).
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";

const ROOT = resolve(import.meta.dirname, "../..");
const CONCEPT = join(ROOT, ".local/design/2-conversacion");
const PORT = join(ROOT, ".local/design/2-conversacion-port");
const OUT = join(ROOT, ".local/visual");
const ALLOWLIST = JSON.parse(readFileSync(join(import.meta.dirname, "allowlist.json"), "utf8"));

const PAGES = {
  home: {
    concept: "index.html",
    route: "/",
    sections: ["header.site-header", ".hero", ".recent", ".about", ".contact", "footer.site-footer"],
  },
  archive: {
    concept: "archive.html",
    route: "/archivo",
    sections: ["header.site-header", ".banner", ".collection-nav", "#antes", "#patrimonio", "#gente", "#costumbres", ".load-more", "footer.site-footer"],
  },
  post: {
    concept: "post.html",
    route: "/historias/el-obelisco",
    sections: ["header.site-header", ".article > header", ".article__cover", ".article__body", ".share", ".comments", "footer.site-footer"],
  },
};

const VIEWPORTS = { 1440: { width: 1440, height: 900 }, 390: { width: 390, height: 844 }, 360: { width: 360, height: 780 } };

// Interaction states, applied identically to both pages before capturing.
const STATES = {
  "nav-open": { pages: ["home"], vps: ["390", "360"], run: (p) => p.click(".nav-toggle") },
  "hero-2": { pages: ["home"], run: (p) => p.click('.thumb[data-index="1"]') },
  "menu-open": { pages: ["post"], run: (p) => p.click(".overflow > button") },
  "filter-patrimonio": { pages: ["archive"], run: (p) => p.click('.chip[data-filter="patrimonio"]') },
  "load-more": { pages: ["archive"], run: (p) => p.click(".load-more button") },
  comment: {
    pages: ["post"],
    run: async (p) => {
      await p.fill(".comment-form textarea", "Prueba de comentario.");
      await p.click('.comment-form button[type="submit"]');
    },
  },
};

const { values: args } = parseArgs({
  options: {
    page: { type: "string" },
    vp: { type: "string" },
    target: { type: "string", default: "astro" },
    state: { type: "string" },
    limit: { type: "string", default: "15" },
    base: { type: "string", default: "http://localhost:4321" },
  },
});

const pages = args.page ? [args.page] : Object.keys(PAGES);
const vps = args.vp ? [args.vp] : ["1440", "390"];
const limit = Number(args.limit);

function candidateUrl(page) {
  if (args.target === "port") return pathToFileURL(join(PORT, PAGES[page].concept)).href;
  return args.base + PAGES[page].route;
}

async function prepare(browser, url, viewport, state) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce", deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "load" });
  await page.addStyleTag({ content: "*{caret-color:transparent!important}" });
  // load every lazy image and wait for fonts, so both sides are complete
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = "eager"));
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))));
  });
  if (state) {
    await STATES[state].run(page);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return page;
}

// Boxes of every element in <body>, keyed by tag + classes and occurrence.
function collectBoxes(page) {
  return page.evaluate(() => {
    const skip = new Set(["SCRIPT", "STYLE", "TEMPLATE", "USE", "PATH", "SYMBOL", "DEFS", "CLIPPATH", "RECT", "CIRCLE", "LINK"]);
    const counts = new Map();
    const out = [];
    const describe = (el) => {
      const parts = [];
      for (let n = el; n && n !== document.body && parts.length < 4; n = n.parentElement) {
        const cls = n.classList.length ? "." + [...n.classList].join(".") : "";
        parts.unshift(n.tagName.toLowerCase() + (n.id ? "#" + n.id : "") + cls);
      }
      return parts.join(" > ");
    };
    for (const el of document.body.querySelectorAll("*")) {
      if (skip.has(el.tagName.toUpperCase())) continue;
      if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") continue;
      const key = el.tagName.toLowerCase() + "." + [...el.classList].sort().join(".");
      const i = counts.get(key) ?? 0;
      counts.set(key, i + 1);
      const r = el.getBoundingClientRect();
      const visible = r.width > 0 || r.height > 0;
      out.push({ id: `${key}#${i}`, path: describe(el), x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height, visible });
    }
    return out;
  });
}

function compareBoxes(ref, cand) {
  const byId = new Map(cand.map((b) => [b.id, b]));
  const refIds = new Set(ref.map((b) => b.id));
  const deltas = [];
  const missing = [];
  for (const a of ref) {
    const b = byId.get(a.id);
    if (!b) {
      if (a.visible) missing.push(a);
      continue;
    }
    const d = { x: b.x - a.x, y: b.y - a.y, w: b.w - a.w, h: b.h - a.h };
    if (Object.values(d).some((v) => Math.abs(v) > 1)) deltas.push({ ...a, d });
  }
  const extra = cand.filter((b) => !refIds.has(b.id) && b.visible);
  return { deltas, missing, extra };
}

function toPng(buffer) {
  return PNG.sync.read(buffer);
}

function crop(png, x, y, w, h) {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, x, y, w, h, 0, 0);
  return out;
}

function diffImages(a, b, dir, name) {
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const ca = crop(a, 0, 0, width, height);
  const cb = crop(b, 0, 0, width, height);
  const diff = new PNG({ width, height });
  const n = pixelmatch(ca.data, cb.data, diff.data, width, height, { threshold: 0.1 });
  if (dir) writeFileSync(join(dir, `${name}-diff.png`), PNG.sync.write(diff));
  return (n / (width * height)) * 100;
}

const fmt = (v) => (v > 0 ? "+" : "") + Math.round(v);
let failed = false;
const browser = await chromium.launch({ channel: "chrome" });

for (const pageName of pages) {
  const conf = PAGES[pageName];
  for (const vp of vps) {
    const state = args.state;
    if (state && !STATES[state].pages.includes(pageName)) continue;
    if (state && STATES[state].vps && !STATES[state].vps.includes(vp)) continue;
    const label = `${pageName}-${vp}${state ? "-" + state : ""}`;
    const dir = join(OUT, args.target, label);
    mkdirSync(dir, { recursive: true });

    const ref = await prepare(browser, pathToFileURL(join(CONCEPT, conf.concept)).href, VIEWPORTS[vp], state);
    const cand = await prepare(browser, candidateUrl(pageName), VIEWPORTS[vp], state);

    // geometry
    const allowed = (ALLOWLIST[label] ?? []).map((a) => a.match);
    const isAllowed = (b) => allowed.some((m) => b.id.startsWith(m) || b.path.includes(m));
    const geo = compareBoxes(await collectBoxes(ref), await collectBoxes(cand));
    const deltas = geo.deltas.filter((b) => !isAllowed(b));
    const missing = geo.missing.filter((b) => !isAllowed(b));
    const extra = geo.extra.filter((b) => !isAllowed(b));

    // pixels
    const refShot = toPng(await ref.screenshot({ fullPage: true }));
    const candShot = toPng(await cand.screenshot({ fullPage: true }));
    writeFileSync(join(dir, "concept.png"), PNG.sync.write(refShot));
    writeFileSync(join(dir, "candidate.png"), PNG.sync.write(candShot));
    const full = diffImages(refShot, candShot, dir, "full");
    const sections = [];
    for (const sel of conf.sections) {
      const box = await ref.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.max(0, Math.floor(r.x + scrollX)), y: Math.floor(r.y + scrollY), w: Math.floor(r.width), h: Math.floor(r.height) };
      }, sel);
      if (!box || box.w === 0 || box.h === 0) continue;
      const w = Math.min(box.w, refShot.width - box.x, candShot.width - box.x);
      const h = Math.min(box.h, refShot.height - box.y, candShot.height - box.y);
      if (w <= 0 || h <= 0) {
        sections.push({ sel, pct: 100 });
        continue;
      }
      const pct = diffImages(crop(refShot, box.x, box.y, w, h), crop(candShot, box.x, box.y, w, h), null, sel);
      sections.push({ sel, pct });
    }
    await ref.close();
    await cand.close();

    // report
    const lines = [`## ${label} (${args.target})`, ""];
    lines.push(`Page height: concept ${refShot.height}px · candidate ${candShot.height}px`);
    lines.push(`Geometry: ${deltas.length} moved/resized · ${missing.length} missing · ${extra.length} extra`);
    for (const b of deltas.slice(0, limit)) {
      lines.push(`  Δ ${b.path}  x${fmt(b.d.x)} y${fmt(b.d.y)} w${fmt(b.d.w)} h${fmt(b.d.h)}  (${b.id})`);
    }
    if (deltas.length > limit) lines.push(`  … ${deltas.length - limit} more`);
    for (const b of missing.slice(0, limit)) lines.push(`  − missing ${b.path}  (${b.id})`);
    for (const b of extra.slice(0, limit)) lines.push(`  + extra   ${b.path}  (${b.id})`);
    lines.push(`Pixels: full page ${full.toFixed(2)}%`);
    for (const s of sections) lines.push(`  ${s.pct < 0.5 ? "ok " : "!! "} ${s.sel}: ${s.pct.toFixed(2)}%`);
    lines.push(`Images: ${dir}`);
    const report = lines.join("\n");
    writeFileSync(join(dir, "report.md"), report + "\n");
    console.log(report + "\n");

    const pass = deltas.length === 0 && missing.length === 0 && extra.length === 0 && sections.every((s) => s.pct < 0.5);
    if (!pass) failed = true;
  }
}

await browser.close();
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
process.exit(failed ? 1 : 0);

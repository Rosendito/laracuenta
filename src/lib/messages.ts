import defaults from "../../messages.default.json";

// messages.json is git-ignored and optional: it overrides keys for local copy.
const overrides = Object.values(
  import.meta.glob<{ default: Partial<typeof defaults> }>("../../messages.json", { eager: true }),
)[0]?.default;

export const t: typeof defaults = { ...defaults, ...overrides };

export const categoryName = (slug: string) =>
  (t.categories as Record<string, string>)[slug] ?? slug;

export const formatDate = (date: Date) =>
  date.toLocaleDateString(t.locale, { day: "numeric", month: "long", year: "numeric" });

export const readingMinutes = (body = "") =>
  Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));

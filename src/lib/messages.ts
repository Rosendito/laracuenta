import defaults from "../../messages.default.json";

// messages.json is git-ignored and optional: it overrides keys for local copy.
const overrides = Object.values(
  import.meta.glob<{ default: Partial<typeof defaults> }>("../../messages.json", { eager: true }),
)[0]?.default;

export const t: typeof defaults = { ...defaults, ...overrides };

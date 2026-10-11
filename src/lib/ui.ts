// Names of the icons in the sprite rendered by src/components/SvgDefs.astro.
// The `i-` prefix is added by Icon.astro.
export const iconNames = [
  "instagram",
  "facebook",
  "x",
  "youtube",
  "whatsapp",
  "link",
  "arrow-right",
  "chevron-left",
  "chevron-right",
  "clock",
  "calendar",
  "menu",
  "close",
  "more",
  "send",
  "bubble",
  "camera",
  "bookmark",
  "flag",
  "mail",
] as const;

export type IconName = (typeof iconNames)[number];

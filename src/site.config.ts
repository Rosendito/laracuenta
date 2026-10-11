// Category slugs; their display names live in the messages files.
export const CATEGORIES = [
  "then-and-now",
  "heritage-and-places",
  "our-people",
  "customs-and-culture",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SITE = {
  email: "hello@example.com",
  // Leave a URL empty to hide its icon.
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    x: "",
  },
  // Form backends (e.g. Formspree). Empty: the contact section falls back to a
  // mailto link and the newsletter form is hidden.
  contactFormEndpoint: "",
  newsletterFormEndpoint: "",
  postsPerPage: 6,
};

// Site-wide settings: identity, navigation, social links and form endpoints.

export const site = {
  name: "Lara Cuenta",
  title: "Lara Cuenta — Memoria, patrimonio y gente de Lara",
  description:
    "Un nano-medio digital sobre la memoria, el patrimonio y la gente de Lara, Venezuela. Fotografía y crónicas desde Barquisimeto.",
  locale: "es",
  dateLocale: "es-VE",

  author: {
    name: "Lara Cuenta",
    initial: "M",
    role: "Texto y fotografías · Barquisimeto",
  },

  nav: [
    { id: "home", label: "Inicio", href: "/" },
    { id: "archive", label: "Historias", href: "/historias" },
    { id: "about", label: "Nosotros", href: "/#nosotros" },
    { id: "contact", label: "Contacto", href: "/#contacto" },
  ],

  policies: [
    { label: "Privacidad", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Créditos fotográficos", href: "#" },
    { label: "Uso de las imágenes", href: "#" },
  ],

  social: [
    { id: "instagram", label: "Instagram", href: "#" },
    { id: "facebook", label: "Facebook", href: "#" },
    { id: "x", label: "X", href: "#" },
    { id: "youtube", label: "YouTube", href: "#" },
  ],

  // No backend: forms post to an external service. Replace the placeholders.
  forms: {
    contact: "https://formspree.io/f/placeholder",
    newsletter: "https://formspree.io/f/placeholder",
  },
} as const;

export type NavId = (typeof site.nav)[number]["id"];
export type SocialId = (typeof site.social)[number]["id"];

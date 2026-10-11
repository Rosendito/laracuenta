// Site-wide settings: identity, navigation, social links and form endpoints.
import authorPhoto from "../assets/authors/mariangel-leon.webp";

export const site = {
  name: "Lara Cuenta",
  title: "Lara Cuenta | Memoria, patrimonio y gente de Lara",
  description:
    "Un nano-medio digital sobre la memoria, el patrimonio y la gente de Lara, Venezuela. Fotografía y crónicas desde Barquisimeto.",
  locale: "es",
  dateLocale: "es-VE",

  author: {
    name: "Lic. Mariángel León Ortiz",
    initial: "M",
    photo: authorPhoto,
    role: "Periodista y fotógrafa · Barquisimeto",
    /** Author page: /autora/<slug>. */
    slug: "mariangel-leon",
    jobTitle: "Periodista y fotógrafa",
    bio: [
      "Mariángel León Ortiz es licenciada en Comunicación Social por la Universidad Fermín Toro, donde se graduó en 2025 magna cum laude y como primera de su promoción. Cursa la Maestría en Innovación Digital, mención Periodismo Digital, en Florida Global University, y tiene un diplomado en Escritura Creativa.",
      "Se formó entre la radio, la televisión y los medios digitales: fue moderadora, redactora y camarógrafa en UFT Radio y TV y en Okay 101.5 FM. Hoy coordina contenidos editoriales para marcas y medios en Barquisimeto.",
      "En Lara Cuenta escribe y fotografía las historias de los lugares, la gente y las costumbres de Lara.",
    ],
    /** Credentials on the author page: each entry is a title and a detail line. */
    credentials: [
      {
        label: "Formación",
        items: [
          {
            title: "Maestría en Innovación Digital, mención Periodismo Digital",
            detail: "Florida Global University · En curso",
          },
          {
            title: "Licenciatura en Comunicación Social",
            detail: "Universidad Fermín Toro · 2025 · Magna cum laude, primera de su promoción",
          },
          { title: "Diplomado en Escritura Creativa", detail: "2023" },
        ],
      },
      {
        label: "Trayectoria",
        items: [
          {
            title: "Coordinadora y supervisora de contenidos",
            detail: "Agencia Innova · Desde 2026",
          },
          {
            title: "Community manager, copywriter, guionista y editora de video",
            detail: "Agencia Innova · 2024 a 2026",
          },
          {
            title: "Moderadora, redactora y camarógrafa",
            detail: "UFT Radio y TV y Okay 101.5 FM · 2020 a 2023",
          },
        ],
      },
      {
        label: "Reconocimientos",
        items: [
          {
            title: "2.º lugar, concurso de Escritura Creativa (ensayo)",
            detail: "Universidad Provincial de Ezeiza, Argentina",
          },
        ],
      },
    ],
  },

  nav: [
    { id: "home", label: "Inicio", href: "/" },
    { id: "archive", label: "Historias", href: "/historias" },
    { id: "about", label: "Nosotros", href: "/#nosotros" },
    { id: "contact", label: "Contacto", href: "/#contacto" },
  ],

  policies: [
    { label: "Privacidad", href: "/privacidad" },
    { label: "Cookies", href: "/cookies" },
    { label: "Uso de las imágenes", href: "/uso-de-las-imagenes" },
  ],

  social: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/laracuentamedio" },
  ],

  // No backend: forms post to an external service. Replace the placeholders.
  forms: {
    contact: "https://formspree.io/f/placeholder",
    newsletter: "https://formspree.io/f/placeholder",
  },
} as const;

export type NavId = (typeof site.nav)[number]["id"];
export type SocialId = (typeof site.social)[number]["id"];

export const authorHref = `/autora/${site.author.slug}`;

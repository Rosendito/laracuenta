// Data for the SEO report (/_learning/seo/informe/): what each of the three stories
// looked like before the optimization and what it changes to. `before` values are
// frozen on purpose (the report compares states); flip `done` as each change lands.

export interface Change {
  before: string;
  after: string;
  done: boolean;
}

export interface ReportStory {
  slug: string;
  name: string;
  collection: string;
  keyword: { main: string; longTail: string[] };
  title: Change;
  description: Change;
  /** The H1 stays as the journalistic headline. */
  h1: string;
  h2: Change[];
  internalLinks: { to: string; anchor: string; done: boolean }[];
  externalSources: number;
  images: { files: number; heaviest: string; heaviestAfter: string; done: boolean };
}

export const reportStories: ReportStory[] = [
  {
    slug: "el-obelisco-larense",
    name: "El Obelisco",
    collection: "Patrimonio y memoria de los lugares",
    keyword: {
      main: "Obelisco de Barquisimeto",
      longTail: [
        "historia del Obelisco de Barquisimeto",
        "cuánto mide el Obelisco de Barquisimeto",
        "quién diseñó el Obelisco de Barquisimeto",
        "mirador del Obelisco de Barquisimeto",
      ],
    },
    title: {
      before: "74 años de historias en el Obelisco larense | Lara Cuenta",
      after: "Obelisco de Barquisimeto: 74 años de historia | Lara Cuenta",
      done: true,
    },
    description: {
      before:
        "El monumento que celebró los 400 años de Barquisimeto sigue siendo un punto de encuentro: memorias de su mirador, de sus alrededores y de quienes todavía lo visitan.",
      after:
        "Historia del Obelisco de Barquisimeto, construido en 45 días para los 400 años de la ciudad: su mirador, sus memorias y la vida que lo rodea hoy.",
      done: true,
    },
    h1: "74 años de historias en el Obelisco larense",
    h2: [
      {
        before: "Una obra de 45 días",
        after: "Una obra de 45 días: así se construyó el Obelisco",
        done: true,
      },
      {
        before: "Memorias desde el mirador",
        after: "Memorias desde el mirador del Obelisco",
        done: true,
      },
      {
        before: "Lo que se vive alrededor",
        after: "Lo que se vive alrededor",
        done: true,
      },
    ],
    internalLinks: [
      {
        to: "El Aeropuerto",
        anchor: "el aeropuerto de la ciudad",
        done: true,
      },
    ],
    externalSources: 4,
    images: { files: 14, heaviest: "936 KB", heaviestAfter: "299 KB", done: true },
  },
  {
    slug: "estadio-antonio-herrera-gutierrez",
    name: "El Estadio",
    collection: "Costumbres y memoria cultural",
    keyword: {
      main: "estadio Antonio Herrera Gutiérrez",
      longTail: [
        "historia del estadio Antonio Herrera Gutiérrez",
        "cuándo se inauguró el estadio de Barquisimeto",
        "estadio de los Cardenales de Lara",
        "títulos de los Cardenales de Lara",
      ],
    },
    title: {
      before: "El hogar del equipo crepuscular: Barquisimeto, tierra de jonrones | Lara Cuenta",
      after: "Estadio Antonio Herrera Gutiérrez: historia | Lara Cuenta",
      done: true,
    },
    description: {
      before:
        "Desde 1968, el estadio Antonio Herrera Gutiérrez reúne a generaciones de larenses alrededor de los Cardenales de Lara: su historia, sus títulos y la energía de sus gradas.",
      after:
        "Historia del estadio Antonio Herrera Gutiérrez, casa de los Cardenales de Lara desde 1968: su inauguración, sus títulos y la pasión de sus gradas.",
      done: true,
    },
    h1: "El hogar del equipo crepuscular: Barquisimeto, tierra de jonrones",
    h2: [
      {
        before: "Un estadio para la capital larense",
        after: "Un estadio para la capital larense: la inauguración de 1968",
        done: true,
      },
      {
        before: "Campeones en casa",
        after: "Campeones en casa: los títulos de los Cardenales de Lara",
        done: true,
      },
      {
        before: "Una noche de béisbol",
        after: "Una noche de béisbol",
        done: true,
      },
    ],
    internalLinks: [
      {
        to: "El Obelisco",
        anchor: "el Obelisco de Barquisimeto",
        done: true,
      },
    ],
    externalSources: 7,
    images: { files: 13, heaviest: "324 KB", heaviestAfter: "135 KB", done: true },
  },
  {
    slug: "aeropuerto-jacinto-lara",
    name: "El Aeropuerto",
    collection: "Historias de nuestra gente",
    keyword: {
      main: "Aeropuerto Jacinto Lara",
      longTail: [
        "historia del aeropuerto de Barquisimeto",
        "Aeropuerto Internacional Jacinto Lara historia",
        "cuándo se inauguró el aeropuerto de Barquisimeto",
        "despedidas en el aeropuerto por la migración",
      ],
    },
    title: {
      before: "Un lugar de encuentros y despedidas | Lara Cuenta",
      after: "Aeropuerto Jacinto Lara: historia y despedidas | Lara Cuenta",
      done: true,
    },
    description: {
      before:
        "El Aeropuerto Internacional Jacinto Lara guarda seis décadas de historia y, hoy, las despedidas y los reencuentros de un país marcado por la migración.",
      after:
        "Seis décadas de historia del aeropuerto de Barquisimeto, contadas entre las despedidas y los reencuentros de un país marcado por la migración.",
      done: true,
    },
    h1: "Un lugar de encuentros y despedidas",
    h2: [
      {
        before: "Antes de las despedidas",
        after: "Antes de las despedidas: la historia del aeropuerto",
        done: true,
      },
      {
        before: "Las historias del terminal",
        after: "Las historias del terminal",
        done: true,
      },
      {
        before: "Despedidas y reencuentros",
        after: "Despedidas y reencuentros",
        done: true,
      },
    ],
    internalLinks: [
      {
        to: "El Obelisco",
        anchor: "el Obelisco de Barquisimeto",
        done: true,
      },
    ],
    externalSources: 6,
    images: { files: 11, heaviest: "330 KB", heaviestAfter: "149 KB", done: true },
  },
];

/** Site-wide techniques, in report order. Keys match the glossary. */
export const siteTechniques: { key: string; label: string; done: boolean }[] = [
  { key: "dominio", label: "Dominio propio", done: false },
  { key: "https", label: "HTTPS en todo el sitio", done: true },
  { key: "sitemap", label: "Sitemap XML automático", done: true },
  { key: "robots", label: "Archivo robots.txt", done: true },
  { key: "searchconsole", label: "Google Search Console", done: false },
  { key: "canonical", label: "URL canónica en cada página", done: true },
  { key: "opengraph", label: "Open Graph para redes sociales", done: true },
  { key: "responsive", label: "Diseño responsive e idioma declarado", done: true },
  { key: "estatico", label: "Rendimiento: sitio estático, WebP y carga diferida", done: true },
  { key: "eeat", label: "Autoría visible y fuentes citadas", done: true },
  { key: "datosestructurados", label: "Datos estructurados (NewsArticle)", done: true },
];

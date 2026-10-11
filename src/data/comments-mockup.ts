// Mockup comments for the article page. There is no backend yet: these are
// rendered as static markup and the form only appends to the list in the browser.

export interface MockComment {
  author: string;
  initials: string;
  tone: "sun" | "terracotta" | "orange";
  /** Relative time, already written in Spanish (sample copy). */
  time: string;
  text: string;
  likes: number;
  /** Reply from the author of the story. */
  byAuthor?: boolean;
}

export const commentsMockup: MockComment[] = [
  {
    author: "Ana Teresa",
    initials: "A",
    tone: "sun",
    time: "hace 2 días",
    text: "Mi abuelo trabajó en la obra en el 52. Contaba que subían el concreto en baldes y que el día de la inauguración llovió a cántaros. Gracias por esta historia, se la voy a leer a mi mamá.",
    likes: 14,
  },
  {
    author: "Lara Cuenta",
    initials: "LC",
    tone: "terracotta",
    time: "hace 2 días",
    text: "Ana Teresa, ¡nos encantaría conversar con tu mamá! Escríbenos por el formulario de contacto y armamos una entrevista para la colección «Historias de nuestra gente».",
    likes: 6,
    byAuthor: true,
  },
  {
    author: "Rafael",
    initials: "R",
    tone: "orange",
    time: "ayer",
    text: "Lo de «la única cosa de mi vida que no se ha movido» me dejó pensando toda la tarde. Desde Madrid, un abrazo para el Obelisco.",
    likes: 9,
  },
];

/** Avatars shown stacked in the comments header. */
export const commentAvatarStack: { initials: string; tone: "sun" | "terracotta" | "orange" }[] = [
  { initials: "A", tone: "sun" },
  { initials: "R", tone: "terracotta" },
  { initials: "L", tone: "orange" },
];

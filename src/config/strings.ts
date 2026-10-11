// UI copy (Spanish). Keys are English; values are what the reader sees.

export const strings = {
  skipLink: "Saltar al contenido",
  homeLabel: "Lara Cuenta, inicio",
  menu: "Menú",
  mainNav: "Principal",
  socialNav: "Redes sociales",

  hero: {
    eyebrow: "Un nano-medio desde Barquisimeto",
    titleLines: ["Lara <em>cuenta</em>", "lo que la", "memoria guarda."],
    lead: "Fotografías y crónicas sobre los lugares, la gente y las costumbres de Lara. Una conversación con la ciudad a la hora en que se pone naranja.",
    primaryCta: "Explorar el archivo",
    secondaryCta: "Qué es Lara Cuenta",
    galleryLabel: "Historias destacadas",
    previous: "Historia anterior",
    next: "Historia siguiente",
  },

  recent: {
    eyebrow: "Lo último",
    title: "Historias recientes",
    seeAll: "Ver todas las historias",
  },

  card: {
    readStory: "Leer la historia",
    read: "Leer",
    minutes: (n: number) => `${n} min`,
    comments: (n: number) => `${n} comentarios`,
  },

  about: {
    eyebrow: "Nosotros",
    title: "Una conversación con Lara, a la hora del crepúsculo",
    text: "Lara Cuenta es un nano-medio digital hecho por una fotógrafa y periodista de Barquisimeto. Documenta la memoria, el patrimonio y la gente de la región en cuatro colecciones, con la fotografía como protagonista y la crónica como marco. Es para quienes viven aquí, para quienes se fueron y lo extrañan, y para quienes quieren conocerlo.",
    cta: "Conocer las colecciones",
  },

  contact: {
    eyebrow: "Contacto",
    title: "¿Tienes una historia que contar?",
    text: "Escríbenos si conoces un lugar que está cambiando, una persona que merece un perfil o una foto antigua guardada en una gaveta. Las mejores historias llegan por aquí.",
    noteTitle: "Respondemos en pocos días.",
    noteText:
      "También puedes proponer temas por Instagram o enviarnos tus fotos de familia para la colección «Antes y ahora».",
    noteImageAlt: "Un triciclo decorado con luces cruza el parque al atardecer.",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo electrónico",
    subject: "Asunto",
    subjects: [
      "Quiero proponer una historia",
      "Tengo fotos antiguas de Lara",
      "Quiero contar mi testimonio",
      "Otra cosa",
    ],
    message: "Mensaje",
    messageHint: "Cuéntanos el lugar, la época y por qué importa.",
    consent: "Al enviar aceptas nuestra política de privacidad.",
    send: "Enviar mensaje",
  },

  archive: {
    title: "Archivo",
    description:
      "Todas las historias de Lara Cuenta, organizadas en cuatro colecciones: antes y ahora, patrimonio, gente y costumbres.",
    eyebrow: "Archivo",
    heading: "Todas las historias, en cuatro colecciones",
    intro:
      "Lo que Lara cuenta, ordenado por lo que recuerda: lugares que cambian, patrimonio que resiste, gente que se queda o se va, y costumbres que se repiten cada tarde.",
    collectionsNav: "Colecciones",
    all: "Todas",
    storyCount: (n: number) => `${n} historias`,
    loadMore: "Cargar más historias",
    noMore: "No hay más historias por ahora",
    showing: (shown: number, total: number) => `Mostrando ${shown} de ${total} historias`,
  },

  article: {
    readingTime: (n: number) => `${n} min de lectura`,
    moreOptions: "Más opciones",
    copyLink: "Copiar enlace",
    linkCopied: "Enlace copiado",
    copyFailed: "No se pudo copiar",
    saveForLater: "Guardar para después",
    photoCredits: "Créditos de las fotos",
    reportError: "Reportar un error",
    share: "Compartir",
    shareOn: (network: string) => `Compartir en ${network}`,
    previousPhoto: "Foto anterior",
    nextPhoto: "Foto siguiente",
    photoOf: (i: number, n: number) => `Foto ${i} de ${n}`,
  },

  comments: {
    title: "La conversación",
    reply: "Responder",
    like: (n: number) => `Me gusta · ${n}`,
    authorBadge: "Autora",
    label: "Escribe un comentario",
    placeholder: "Súmate a la conversación: ¿qué recuerdo tienes del Obelisco?",
    moderation: "Los comentarios se revisan antes de publicarse.",
    submit: "Publicar comentario",
    you: "Tú",
    now: "ahora mismo",
    pending: "Pendiente",
  },

  footer: {
    about:
      "Memoria, patrimonio y gente de Lara, Venezuela. Un nano-medio de periodismo digital hecho con fotografía y crónica.",
    navigate: "Navegar",
    policies: "Políticas",
    newsletter: "Boletín",
    newsletterText: "Una historia nueva en tu correo cada vez que publicamos. Sin ruido.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@correo.com",
    subscribe: "Suscribirme",
    copyright: "© 2026 Lara Cuenta · Barquisimeto, Venezuela",
    mockupNote: "Maqueta de diseño (concepto «Conversación»). Textos y testimonios de muestra.",
  },
} as const;

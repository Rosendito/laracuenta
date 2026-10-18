// Glossary for the SEO report (/_learning/seo/informe/). Each key is used by
// <Term k="…"> for the hover definition and by the glossary annex.

export const seoGlossary = {
  seo: {
    term: "SEO",
    definition:
      "Search Engine Optimization: el conjunto de prácticas para que un buscador entienda una página y la muestre entre sus resultados orgánicos (no pagados).",
  },
  onpage: {
    term: "SEO On-Page",
    definition:
      "Las optimizaciones que se hacen dentro del propio sitio: títulos, descripciones, encabezados, URL, enlaces, imágenes y código.",
  },
  organico: {
    term: "Resultado orgánico",
    definition:
      "Un resultado que aparece en el buscador por su relevancia, sin pago. Los anuncios, en cambio, se marcan como patrocinados.",
  },
  rastreo: {
    term: "Rastreo",
    definition:
      "El proceso por el que el buscador descubre páginas: su robot visita una URL y sigue sus enlaces para encontrar otras.",
  },
  googlebot: {
    term: "Googlebot",
    definition: "El programa (robot o «araña») con el que Google rastrea la web.",
  },
  indexacion: {
    term: "Indexación",
    definition:
      "El paso en que el buscador analiza una página rastreada y la guarda en su índice. Una página no indexada no puede aparecer en los resultados.",
  },
  posicionamiento: {
    term: "Posicionamiento",
    definition:
      "El lugar que ocupa una página en los resultados para una búsqueda concreta. Depende de la relevancia, la calidad y la experiencia de uso.",
  },
  serp: {
    term: "SERP",
    definition:
      "Search Engine Results Page: la página de resultados que muestra el buscador después de una consulta.",
  },
  keyword: {
    term: "Palabra clave",
    definition:
      "La palabra o frase que las personas escriben en el buscador. En inglés, keyword. Cada página se optimiza para una principal y varias secundarias.",
  },
  longtail: {
    term: "Long-tail",
    definition:
      "Palabra clave de cola larga: una búsqueda de tres o más palabras, muy específica. Tiene menos volumen, pero menos competencia y una intención más clara.",
  },
  intencion: {
    term: "Intención de búsqueda",
    definition:
      "Lo que la persona quiere lograr con su búsqueda: informarse (informativa), llegar a un sitio (navegacional) o hacer una acción, como comprar (transaccional).",
  },
  nicho: {
    term: "Nicho",
    definition:
      "El tema y el público específicos a los que se dirige un sitio. El de Lara Cuenta es la memoria, el patrimonio y la gente del estado Lara.",
  },
  metatitle: {
    term: "Meta title",
    definition:
      "La etiqueta <title> de una página: el título azul que muestra Google y el texto de la pestaña del navegador. Se recomienda que no pase de unos 60 caracteres.",
  },
  metadescription: {
    term: "Meta description",
    definition:
      "La etiqueta que resume una página. Google suele mostrarla bajo el título en los resultados. Se recomienda que no pase de unos 155 a 160 caracteres.",
  },
  ctr: {
    term: "CTR",
    definition:
      "Click-Through Rate: el porcentaje de personas que hacen clic en un resultado después de verlo. Un buen título y una buena descripción lo aumentan.",
  },
  encabezados: {
    term: "Encabezados (H1, H2, H3)",
    definition:
      "Las etiquetas que marcan la jerarquía del texto: H1 es el título principal (uno por página), H2 los apartados y H3 los subapartados.",
  },
  slug: {
    term: "Slug",
    definition:
      "La parte final de una URL que identifica a una página, por ejemplo «el-obelisco-larense». Debe ser corta, legible y contener la palabra clave.",
  },
  canonical: {
    term: "URL canónica",
    definition:
      "La etiqueta que le indica al buscador cuál es la dirección oficial de una página, para evitar que cuente versiones duplicadas.",
  },
  interno: {
    term: "Enlace interno",
    definition:
      "Un enlace que lleva a otra página del mismo sitio. Ayuda al rastreo y reparte la relevancia entre las páginas.",
  },
  externo: {
    term: "Enlace externo",
    definition:
      "Un enlace hacia otro sitio. Citar fuentes confiables refuerza la credibilidad del contenido.",
  },
  anchor: {
    term: "Anchor text",
    definition:
      "El texto visible y clicable de un enlace. Debe describir el destino; «haz clic aquí» no le dice nada al lector ni al buscador.",
  },
  alt: {
    term: "Texto alternativo (alt)",
    definition:
      "La descripción de una imagen en el código. La leen los lectores de pantalla de las personas ciegas y la usa el buscador para entender la foto.",
  },
  webp: {
    term: "WebP",
    definition:
      "Un formato de imagen para la web que pesa bastante menos que JPEG o PNG con una calidad similar.",
  },
  lazy: {
    term: "Carga diferida",
    definition:
      "Lazy loading: las imágenes que están fuera de la pantalla se descargan solo cuando el lector se acerca a ellas, y la página abre más rápido.",
  },
  sitemap: {
    term: "Sitemap",
    definition:
      "Un archivo XML con la lista de las páginas de un sitio. Le facilita al buscador descubrirlas todas.",
  },
  robots: {
    term: "robots.txt",
    definition:
      "Un archivo en la raíz del sitio con instrucciones para los robots de los buscadores: qué pueden rastrear y dónde está el sitemap.",
  },
  noindex: {
    term: "noindex",
    definition:
      "Una instrucción que le pide al buscador no mostrar una página en sus resultados, por ejemplo una página privada o de pruebas.",
  },
  searchconsole: {
    term: "Google Search Console",
    definition:
      "La herramienta gratuita de Google para ver cómo rastrea e indexa un sitio, enviar el sitemap y consultar con qué búsquedas aparece.",
  },
  dominio: {
    term: "Dominio",
    definition:
      "La dirección de un sitio en internet, como laracuenta.com. Un dominio propio da identidad y confianza, y conserva lo que el sitio gana en el buscador.",
  },
  https: {
    term: "HTTPS",
    definition:
      "La versión cifrada del protocolo web. Protege la conexión del lector y es una señal de confianza que Google tiene en cuenta.",
  },
  responsive: {
    term: "Diseño responsive",
    definition:
      "Un diseño que se adapta al tamaño de la pantalla. Google indexa primero la versión móvil de los sitios (mobile-first).",
  },
  cwv: {
    term: "Core Web Vitals",
    definition:
      "Las métricas de Google sobre la experiencia de carga: cuánto tarda en verse el contenido principal (LCP), cuánto tarda en responder (INP) y cuánto se mueve la página (CLS).",
  },
  pagespeed: {
    term: "PageSpeed Insights",
    definition:
      "La herramienta gratuita de Google que mide la velocidad de una página y da notas de rendimiento, accesibilidad, buenas prácticas y SEO.",
  },
  opengraph: {
    term: "Open Graph",
    definition:
      "Etiquetas que definen el título, la descripción y la imagen que se muestran cuando se comparte un enlace en redes sociales o mensajería.",
  },
  datosestructurados: {
    term: "Datos estructurados",
    definition:
      "Código (normalmente JSON-LD) que describe el contenido de forma estándar, por ejemplo «esto es un artículo, de esta autora, publicado en esta fecha».",
  },
  eeat: {
    term: "E-E-A-T",
    definition:
      "Experiencia, conocimiento, autoridad y confianza: los criterios con los que Google valora la calidad de un contenido y de quien lo firma.",
  },
  stuffing: {
    term: "Keyword stuffing",
    definition:
      "Repetir una palabra clave de forma forzada para manipular al buscador. Google lo considera spam y lo penaliza.",
  },
  redireccion: {
    term: "Redirección 301",
    definition:
      "Una instrucción que envía de forma permanente una URL antigua a una nueva y le indica al buscador que traslade su valor.",
  },
  cms: {
    term: "CMS",
    definition:
      "Content Management System: un gestor de contenidos con panel de administración, como WordPress. Lara Cuenta no usa uno: está hecho con código.",
  },
  estatico: {
    term: "Sitio estático",
    definition:
      "Un sitio cuyas páginas se generan por adelantado como archivos HTML. Se sirve muy rápido y no necesita base de datos.",
  },
  astro: {
    term: "Astro",
    definition:
      "El framework con el que está construido Lara Cuenta. Genera páginas HTML estáticas a partir de componentes y archivos de contenido.",
  },
  mdx: {
    term: "MDX",
    definition:
      "El formato de los archivos de cada historia: texto en Markdown con componentes, como galerías o líneas de tiempo.",
  },
  frontmatter: {
    term: "Frontmatter",
    definition:
      "El bloque de datos al inicio de cada archivo de historia: título, descripción, fecha, foto de portada y su texto alternativo.",
  },
  cdn: {
    term: "CDN",
    definition:
      "Content Delivery Network: una red de servidores repartidos por el mundo que entrega el sitio desde el punto más cercano al lector. Lara Cuenta usa la de Cloudflare.",
  },
} as const;

export type GlossaryKey = keyof typeof seoGlossary;

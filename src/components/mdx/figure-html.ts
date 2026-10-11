// Helpers for MDX components that decorate the <figure> rendered by Img.

export const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** Appends a photo credit to the end of the caption, creating the caption if needed. */
export const addCredit = (html: string, credit: string) => {
  const creditHtml = ` <span class="credit">${escapeHtml(credit)}</span>`;
  return html.includes("</figcaption>")
    ? html.replace("</figcaption>", `${creditHtml}</figcaption>`)
    : html.replace("</figure>", `<figcaption>${creditHtml.trimStart()}</figcaption></figure>`);
};

/** Adds a modifier class to the figure and a corner label (a `.tag` bubble) on the photo. */
export const addStamp = (html: string, modifier: string, label: string) =>
  html
    .replace('<figure class="article__figure"', `<figure class="article__figure ${modifier}"`)
    .replace(
      '<div class="photo-bubble">',
      `<div class="photo-bubble"><span class="tag figure__stamp">${escapeHtml(label)}</span>`,
    );

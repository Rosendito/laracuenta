import { defineMdastPlugin } from "satteri";

// Markdown wraps standalone images in <p>. Images render as <figure>, which cannot
// live inside <p>, so a paragraph holding only images is replaced by its images.
const isBlank = (node) => node.type === "text" && node.value.trim() === "";

export const unwrapImages = defineMdastPlugin({
  name: "unwrap-images",
  paragraph(node, ctx) {
    const images = node.children.filter((child) => child.type === "image");
    if (images.length && node.children.every((child) => child.type === "image" || isBlank(child))) {
      ctx.replaceNode(node, images);
    }
  },
});

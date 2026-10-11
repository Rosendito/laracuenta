// Components available inside story MDX. `img` renders every Markdown image.
import Carousel from "./Carousel.astro";
import Figure from "./Figure.astro";
import Img from "./Img.astro";
import Moment from "./Moment.astro";
import Quote from "./Quote.astro";
import Testimony from "./Testimony.astro";
import Timeline from "./Timeline.astro";

export const mdxComponents = { img: Img, Carousel, Figure, Moment, Quote, Testimony, Timeline };

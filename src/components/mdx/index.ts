// Components available inside story MDX. `img` renders every Markdown image.
import Archive from "./Archive.astro";
import Carousel from "./Carousel.astro";
import Fact from "./Fact.astro";
import Facts from "./Facts.astro";
import Figure from "./Figure.astro";
import Img from "./Img.astro";
import Moment from "./Moment.astro";
import Now from "./Now.astro";
import PullQuote from "./PullQuote.astro";
import Quote from "./Quote.astro";
import Sources from "./Sources.astro";
import Testimony from "./Testimony.astro";
import ThenNow from "./ThenNow.astro";
import Timeline from "./Timeline.astro";

export const mdxComponents = {
  img: Img,
  Archive,
  Carousel,
  Fact,
  Facts,
  Figure,
  Moment,
  Now,
  PullQuote,
  Quote,
  Sources,
  Testimony,
  ThenNow,
  Timeline,
};

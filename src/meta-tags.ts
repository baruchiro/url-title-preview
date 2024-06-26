import { load } from 'cheerio';

export type MetaTags = {
  title?: string;
  description?: string;
  image?: string;
};

export const getMetaTags = (html: string): MetaTags => {
  const $ = load(html);

  // prettier-ignore
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text() ||
    $('meta[name="title"]').attr("content");
  // prettier-ignore
  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content");
  // prettier-ignore
  const image =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:url"]').attr("content");

  return {
    title,
    description,
    image,
  };
};

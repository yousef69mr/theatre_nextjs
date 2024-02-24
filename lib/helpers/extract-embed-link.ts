export const extractEmbedLink = (url: string) => {
  if (isIframe(url)) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(url, "text/html");
    const iframe = doc.querySelector("iframe");

    const embedLink = iframe?.getAttribute("src");
    return embedLink;
  }
  return url;
};

export const isEmbedLink = (url: string) => {
  return url.includes("/embed/");
};

export const isIframe = (url: string) => {
  return url.includes("iframe");
};

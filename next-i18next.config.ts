import { Config } from "next-i18n-router/dist/types";

const i18nConfig: Config = {
  locales: ["en", "ar"],
  defaultLocale: "en",
  // routingStrategy: "dynamicSegment",
  
};

export type Locale = (typeof i18nConfig)["locales"][number];

export default i18nConfig;


export const isValidLocale = (locale: Locale) => {
  return i18nConfig.locales.includes(locale);
};

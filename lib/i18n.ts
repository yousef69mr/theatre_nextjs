import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";

import resourcesToBackend from "i18next-resources-to-backend";
import i18nConfig from "@/next-i18next.config";
import LanguageDetector from "i18next-browser-languagedetector";

const runsOnServerSide = typeof window === "undefined";

export default async function initTranslations(
  locale: string,
  namespaces: string[]
) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      detection: {
        order: ["path", "cookie", "htmlTag", "localStorage", "subdomain"],
        caches: ["cookie"],
      },
      //   backend: {
      //     loadPath: `locales/${locale}/${namespaces[0]}.json`,
      //   },
      defaultNS: namespaces[0],
      fallbackNS: namespaces[0],
      ns: namespaces,
      preload: runsOnServerSide ? i18nConfig.locales : [],
      // interpolation: {
      //   skipOnVariables: false,
      // },
    });

  return i18nInstance;
}

export async function ServerTranslation(
  lng: string,
  ns: string[],
  options = {} as any
) {
  const i18nextInstance = await initTranslations(lng, ns);
  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}

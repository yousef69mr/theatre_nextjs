import { createInstance, i18n, Resource } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";

import resourcesToBackend from "i18next-resources-to-backend";
import i18nConfig from "@/next-i18next.config";
import LanguageDetector from "i18next-browser-languagedetector";

const runsOnServerSide = typeof window === "undefined";

// export default async function initTranslations(
//   locale: string,
//   namespaces: string[]
// ) {
//   const i18nInstance = createInstance();

//   await i18nInstance
//     .use(initReactI18next)
//     .use(LanguageDetector)
//     .use(
//       resourcesToBackend(
//         (language: string, namespace: string) =>
//           import(`/locales/${language}/${namespace}.json`)
//       )
//     )
//     .init({
//       lng: locale,
//       fallbackLng: i18nConfig.defaultLocale,
//       supportedLngs: i18nConfig.locales,
//       detection: {
//         order: ["path", "cookie", "htmlTag", "localStorage", "subdomain"],
//         caches: ["cookie"],
//       },
//       //   backend: {
//       //     loadPath: `locales/${locale}/${namespaces[0]}.json`,
//       //   },
//       defaultNS: namespaces[0],
//       fallbackNS: namespaces[0],
//       ns: namespaces,
//       preload: runsOnServerSide ? i18nConfig.locales : [],
//       // interpolation: {
//       //   skipOnVariables: false,
//       // },
//     });

//   return i18nInstance;
// }

export default async function initTranslations(
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: Resource
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/locales/${language}/${namespace}.json`)
      )
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}


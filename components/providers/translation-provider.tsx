"use client";

import { I18nextProvider } from "react-i18next";
import { ReactNode, useEffect, useState } from "react";
import initTranslations from "@/lib/i18n";
import { createInstance, Resource } from "i18next";
import { Locale } from "@/next-i18next.config";
// import { useLanguageStore } from "@/hooks/use-language-store";

// let i18n: i18nInterface;

// export default function TranslationsProvider({
//   children,
//   locale,
//   namespaces,
// }: {
//   children: ReactNode;
//   locale: string;
//   namespaces: string[];
// }) {
//   // const { onUpdate } = useLanguageStore();
//   const [instance, setInstance] = useState(i18n);

//   useEffect(() => {
//     const init = async () => {
//       if (!i18n) {
//         const newInstance = await initTranslations(locale, namespaces);
//         i18n = newInstance;
//         setInstance(newInstance);
//         // onUpdate(newInstance.language);
//       } else {
//         if (i18n.language !== locale) {
//           i18n.changeLanguage(locale);
//           // onUpdate(locale);
//         }
//       }
//     };

//     init();
//   }, [locale, namespaces]);

//   if (!instance) {
//     return null;
//   }

//   return (
//     <I18nextProvider i18n={instance} defaultNS={namespaces[0]}>
//       {children}
//     </I18nextProvider>
//   );
// }

interface TranslationsProviderProps {
  children: ReactNode;
  locale: Locale;
  namespaces: string[];
  resources: Resource;
}
export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationsProviderProps) {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

"use client";

import { I18nextProvider } from "react-i18next";
import { ReactNode, useEffect, useState } from "react";
import initTranslations from "@/lib/i18n";
import { i18n as i18nInterface } from "i18next";
// import { useLanguageStore } from "@/hooks/use-language-store";

let i18n: i18nInterface;

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
}: {
  children: ReactNode;
  locale: string;
  namespaces: string[];
}) {
  // const { onUpdate } = useLanguageStore();
  const [instance, setInstance] = useState(i18n);

  useEffect(() => {
    const init = async () => {
      if (!i18n) {
        const newInstance = await initTranslations(locale, namespaces);
        i18n = newInstance;
        setInstance(newInstance);
        // onUpdate(newInstance.language);
      } else {
        if (i18n.language !== locale) {
          i18n.changeLanguage(locale);
          // onUpdate(locale);
        }
      }
    };

    init();
  }, [locale, namespaces]);

  if (!instance) {
    return null;
  }

  return (
    <I18nextProvider i18n={instance} defaultNS={namespaces[0]}>
      {children}
    </I18nextProvider>
  );
}

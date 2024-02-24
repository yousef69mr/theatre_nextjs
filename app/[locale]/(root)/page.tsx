import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import initTranslations from "@/lib/i18n";
import { globalNamespaces, homeNamespaces } from "@/lib/namespaces";
import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";

import { FC } from "react";

interface HomePageProps {
  params: {
    locale: Locale;
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

const HomePage: FC<HomePageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, globalNamespaces);
  return (
    // <TranslationsProvider
    //   locale={locale}
    //   namespaces={homeNamespaces}
    //   resources={resources}
    // >
      <main className={cn("w-full general-padding")}>HomePage</main>
    // </TranslationsProvider>
  );
};

export default HomePage;

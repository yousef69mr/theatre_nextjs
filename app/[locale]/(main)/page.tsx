import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import { homeNamespaces } from "@/lib/namespaces";
import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";

import React, { FC } from "react";

interface HomePageProps {
  params: {
    locale: Locale;
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

const HomePage: FC<HomePageProps> = (props) => {
  const {
    params: { locale },
  } = props;

  return (
    <TranslationsProvider locale={locale} namespaces={homeNamespaces}>
      <main className={cn("w-full general-padding")}>HomePage</main>
    </TranslationsProvider>
  );
};

export default HomePage;

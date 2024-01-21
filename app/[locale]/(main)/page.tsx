import TranslationsProvider from "@/components/providers/translation-provider";
import { homeNamespaces } from "@/lib/namespaces";
import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";
import React, { FC } from "react";

interface HomePageProps {
  params: {
    locale: Locale;
  };
}

const HomePage: FC<HomePageProps> = (props) => {
  const {
    params: { locale },
  } = props;

  return (
    // <TranslationsProvider locale={locale} namespaces={[""]}>
      <main className={cn("w-full general-padding")}>HomePage</main>
    // </TranslationsProvider>
  );
};

export default HomePage;

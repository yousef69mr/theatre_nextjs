import PlayListClient from "@/components/clients/play/public/plays-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
// import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { PlayType } from "@/types";
import { Metadata } from "next";
import { FC } from "react";
interface PlaysPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

export const metadata: Metadata = {
  title: "Plays | user",
  description: "all theatre plays",
};

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];


const PlaysPage: FC<PlaysPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);

  const plays: PlayType[] = await getAllPlaysRequest();
  // console.log(plays)
  return (
    <main className="flex flex-col w-full">
    <TranslationsProvider
      locale={locale}
      namespaces={i18nextNamspaces}
      resources={resources}
    >
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlayListClient data={plays} />
      </div>
    </TranslationsProvider>
  </main>
  );
};

export default PlaysPage;

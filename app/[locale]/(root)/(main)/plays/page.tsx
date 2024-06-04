import PlayListClient from "@/components/clients/play/public/plays-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
// import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { PlayType } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";
interface PlaysPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

export async function generateMetadata(
  { params }: PlaysPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const plays: PlayType[] = await getAllPlaysRequest();
  const parentKeywords = (await parent).keywords || [];
  const keywords = plays.map((play) => play.name);
  const title = `${t("play.plural", { ns: "constants" })} | ${t(
    "UserRole.USER",
    {
      ns: "common",
    }
  )}`;
  return {
    title,
    description: title,
    keywords: [
      ...parentKeywords,
      t("play.single", { ns: "constants" }),
      t("play.plural", { ns: "constants" }),
      ...keywords,
    ],
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const PlaysPage: FC<PlaysPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);

  const plays: PlayType[] = await getAllPlaysRequest();
  // console.log(plays)
  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <PlayListClient data={plays} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default PlaysPage;

import { getAllActorsRequest } from "@/lib/api-calls/models/actor";
import { FC } from "react";
import { Metadata } from "next";
import ActorListClient from "@/components/clients/actor/public/actors-client";

import TranslationsProvider from "@/components/providers/translation-provider";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
// import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { ActorType } from "@/types";

interface ActorsPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateMetadata({
  params,
}: ActorsPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const title = `${t("actor.plural", { ns: "constants" })} | ${t(
    "UserRole.USER",
    {
      ns: "common",
    }
  )}`;
  return {
    title,
    description: title,
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const ActorsPage: FC<ActorsPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const actors: ActorType[] = await getAllActorsRequest();

  // console.log(plays)
  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 pt-6">
          <ActorListClient data={actors} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default ActorsPage;

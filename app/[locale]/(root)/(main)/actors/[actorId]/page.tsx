import ActorClient from "@/components/clients/actor/public/single-actor-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getActorByIdRequest } from "@/lib/api-calls/models/actor";
import initTranslations from "@/lib/i18n";
import { globalNamespaces } from "@/lib/namespaces";

import { Locale } from "@/next-i18next.config";
import { ActorType } from "@/types";
import { type Metadata } from "next";
import { FC } from "react";

interface SingleActorPageProps {
  params: {
    locale: Locale;
    actorId: string;
  };
}

const i18nextNamspaces = [...globalNamespaces];

export async function generateMetadata({
  params,
}: SingleActorPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  // fetch data
  const id = params.actorId;

  const actor: ActorType | null = await getActorByIdRequest(id);
  // console.log(actor);

  if (actor) {
    const title = `${actor.name} | ${t("actor.single", { ns: "constants" })}`;
    return {
      title,
      description: actor.description || title,
    };
  }

  return {
    title: "not found",
    description: "unknown actor to the database.",
  };
}

// export async function generateStaticParams() {
//   const actors: ActorType[] = await getAllActorsRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (actors.length > 0) {
//       return actors.map((actor) => ({
//         actorId: actor.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, actorId: "1" };
//     }
//   });
// }

const SingleActorPage: FC<SingleActorPageProps> = async (props) => {
  const {
    params: { locale, actorId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const actor: ActorType | null = await getActorByIdRequest(actorId);

  if (!actor) {
    return <>not found</>;
  }

  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ActorClient actor={actor} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default SingleActorPage;

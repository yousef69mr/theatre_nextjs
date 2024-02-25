import { FC } from "react";
import ActorClient from "@/components/clients/actor/single-actor-client";

import TranslationsProvider from "@/components/providers/translation-provider";
import {
  getAllActorsRequest,
  getActorByIdRequest,
} from "@/lib/api-calls/models/actor";
// import { getAllExecutorsRequest } from "@/lib/api-calls/models/executor";
import { getAllFestivalsRequest } from "@/lib/api-calls/models/festival";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";

import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { ActorType, FestivalType, PlayType } from "@/types";

// export async function generateStaticParams() {
//   const actors: ActorType[] = await getAllActorsRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (actors.length > 0) {
//       return actors.map((actor) => ({
//         actorId: actor.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, actorId: "" };
//     }
//   });
// }

interface AdminSingleActorPageProps {
  params: { locale: Locale; actorId: string };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminSingleActorPage: FC<AdminSingleActorPageProps> = async (props) => {
  const {
    params: { actorId, locale },
  } = props;

  const { resources } = await initTranslations(locale, i18nextNamspaces);

  const festivals: FestivalType[] = await getAllFestivalsRequest();
  const plays: PlayType[] = await getAllPlaysRequest();
  // const executors: ExecutorType[] = await getAllExecutorsRequest();

  const actor: ActorType | null = await getActorByIdRequest(actorId);

  if (!actor && actorId !== "new") {
    // throw new Error("Not found");
  }
  return (
    <main className="w-full main-section general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ActorClient
            actor={actor}
            festivals={festivals}
            plays={plays}
            // executors={executors}
          />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminSingleActorPage;

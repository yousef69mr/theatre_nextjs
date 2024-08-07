import { FC } from "react";
import ActorClient from "@/components/clients/actor/admin/single-actor-client";

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
import { Metadata, ResolvingMetadata } from "next";

// export async function generateStaticParams() {
//   const actors: ActorType[] = await getAllActorsRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (actors.length > 0) {
//       return actors.map((actor) => ({
//         actorId: actor.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, actorId: "new" };
//     }
//   });
// }

interface AdminSingleActorPageProps {
  params: { locale: Locale; actorId: string };
}

export async function generateMetadata(
  { params }: AdminSingleActorPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  const parentKeywords = (await parent).keywords || [];

  // fetch data
  const id = params.actorId;

  const actor: ActorType | null =
    id !== "new" ? await getActorByIdRequest(id) : null;

  const baseKeywords = [
    ...parentKeywords,
    t("actor.single", { ns: "constants" }),
  ];
  if (actor) {
    const title = `${actor?.name}  ${
      actor.nickname ? `(${actor.nickname})` : ""
    } | ${t("actor.single", { ns: "constants" })}`;

    return {
      title,
      description: actor.description || title,
      keywords: [...baseKeywords, actor.name, actor.nickname || ""],
      icons: {
        icon: actor.imgUrl || "",
        apple: [
          {
            url: actor.imgUrl || "",
          },
        ],
      },
    };
  }
  return {
    title: t("actions.add", {
      ns: "common",
      instance: t("actor.single", { ns: "constants" }),
    }),
    description: "Add a new actor to the database.",
    keywords: [...baseKeywords],
  };
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

  const actor: ActorType | null =
    actorId !== "new" ? await getActorByIdRequest(actorId) : null;

  // if (!actor && actorId !== "new") {
  //   // throw new Error("Not found");
  // }
  return (
    <main className="w-full main-section general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
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

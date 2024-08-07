import PlayClient from "@/components/clients/play/admin/single-play-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllActorsRequest } from "@/lib/api-calls/models/actor";
import { getAllExecutorsRequest } from "@/lib/api-calls/models/executor";
import { getAllFestivalsRequest } from "@/lib/api-calls/models/festival";
import {
  getAllPlaysRequest,
  getPlayByIdRequest,
} from "@/lib/api-calls/models/play";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { ActorType, ExecutorType, FestivalType, PlayType } from "@/types";
import { ExecutorRole } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";

// export async function generateStaticParams() {
//   const plays: PlayType[] = await getAllPlaysRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (plays.length > 0) {
//       return plays.map((play) => ({
//         playId: play.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, playId: "new" };
//     }
//   });
// }

interface AdminSinglePlayPageProps {
  params: { locale: Locale; playId: string };
}

export async function generateMetadata(
  { params }: AdminSinglePlayPageProps,
  parent: ResolvingMetadata
): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const parentKeywords = (await parent).keywords || [];

  // fetch data
  const id = params.playId;

  const play: PlayType | null =
    id !== "new" ? await getPlayByIdRequest(id) : null;
  // console.log(play);

  const baseKeywords = [
    ...parentKeywords,
    t("play.single", { ns: "constants" }),
  ];

  if (play) {
    const director = play.executors.find(
      (executor) => executor.role === ExecutorRole.DIRECTOR
    )?.executor;

    const directorKeywords = director
      ? [director.name, director.nickname || ""]
      : [];

    const title = `${play.name} | ${t("play.single", { ns: "constants" })}`;
    return {
      title,
      description: play.description || title,
      keywords: [...baseKeywords, play.name, ...directorKeywords],
    };
  }

  return {
    title: t("actions.add", {
      ns: "common",
      instance: t("play.single", { ns: "constants" }),
    }),
    description: "Add a new play to the database.",
    keywords: [...baseKeywords],
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminSinglePlayPage: FC<AdminSinglePlayPageProps> = async (props) => {
  const {
    params: { locale, playId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);

  const festivals: FestivalType[] = await getAllFestivalsRequest();
  const executors: ExecutorType[] = await getAllExecutorsRequest();
  const actors: ActorType[] = await getAllActorsRequest();
  // console.log(executors);
  // console.log(playId);
  const play: PlayType | null =
    playId !== "new" ? await getPlayByIdRequest(playId) : null;
  // console.log(play);

  const formattedPlay = play
    ? {
        ...play,
        director: play.executors.find(
          (executor) => executor.role === ExecutorRole.DIRECTOR
        )?.executor,
      }
    : null;
  // console.log(formattedPlay);
  return (
    <main className="w-full main-section general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <PlayClient
            play={formattedPlay}
            festivals={festivals}
            executors={executors}
            actors={actors}
          />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminSinglePlayPage;

import PlayClient from "@/components/clients/play/single-play-client";
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

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

interface AdminSinglePlayPageProps {
  params: { locale: Locale; playId: string };
}
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
  const play: PlayType | null = await getPlayByIdRequest(playId);
  // console.log(play)
  if (!play && playId !== "new") {
     throw new Error("Not found");
  }
  const formattedPlay = play
    ? {
        ...play,
        director: play.executors.find(
          (executor) => executor.role === ExecutorRole.DIRECTOR
        )?.executor,
      }
    : null;
  return (
    <main className="w-full main-section general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 p-8 pt-6">
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

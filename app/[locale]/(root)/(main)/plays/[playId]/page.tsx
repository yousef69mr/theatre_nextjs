import { FC } from "react";
import { Metadata } from "next";
import { getPlayByIdRequest } from "@/lib/api-calls/models/play";
import { Locale } from "@/next-i18next.config";
import { PlayType } from "@/types";
import TranslationsProvider from "@/components/providers/translation-provider";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import PlayClient from "@/components/clients/play/public/single-play-client";
import { notFound } from "next/navigation";

interface SinglePlayPageProps {
  params: {
    locale: Locale;
    playId: string;
  };
}

export async function generateMetadata({
  params,
}: SinglePlayPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  // fetch data
  const id = params.playId;

  const play: PlayType | null = await getPlayByIdRequest(id);
  // console.log(play);

  if (play) {
    const title = `${play.name} | ${t("play.single", { ns: "constants" })}`;
    return {
      title,
      description: play.description || title,
    };
  }

  const title = `${t("errors.notFound", {
    ns: "constants",
    instance: t("play.single", { ns: "constants" }),
  })} | ${t("UserRole.USER", {
    ns: "common",
  })}`;
  return {
    title,
    description: "unknown play to the database.",
  };
}

// export async function generateStaticParams() {
//   const plays: PlayType[] = await getAllPlaysRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (plays.length > 0) {
//       return plays.map((play) => ({
//         playId: play.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, playId: "1" };
//     }
//   });
// }

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const SinglePlayPage: FC<SinglePlayPageProps> = async (props) => {
  const {
    params: { locale, playId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const play: PlayType | null = await getPlayByIdRequest(playId, {
    viewIncrement: true,
  });

  if (!play) {
    notFound();
  }

  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <PlayClient play={play} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default SinglePlayPage;

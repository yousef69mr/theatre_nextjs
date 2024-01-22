import { FC } from "react";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { PlayType } from "@/types";

interface SinglePlayPageProps {
  params: {
    locale: Locale;
    playId: string;
  };
}

export async function generateStaticParams() {
  const plays: PlayType[] = await getAllPlaysRequest();

  return i18nConfig.locales.map((locale) => {
    if (plays.length > 0) {
      return plays.map((play) => ({
        playId: play.id,
        locale: locale,
      }));
    } else {
      return { locale: locale };
    }
  });
}

const SinglePlayPage: FC<SinglePlayPageProps> = (props) => {
  const {
    params: { locale, playId },
  } = props;
  return (
    <main className={cn("w-full general-padding")}>
      SinglePlayPage {playId}
    </main>
  );
};

export default SinglePlayPage;

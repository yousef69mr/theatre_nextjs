import { FC } from "react";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";
import { PlayType } from "@/types";

interface SinglePlayPageProps {
  params: {
    locale: Locale;
    playId: string;
  };
}

export async function generateStaticParams() {
  const plays: PlayType[] = await getAllPlaysRequest();
  return plays.map((play) => ({
    playId: play.id,
  }));
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

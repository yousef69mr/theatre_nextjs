import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { PlayType } from "@/types";
import { FC } from "react";
interface PlaysPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

const PlaysPage: FC<PlaysPageProps> = async (props) => {
  const plays: PlayType[] = await getAllPlaysRequest();
  // console.log(plays)
  return (
    <main className={cn("w-full general-padding")}>
    
    </main>
  );
};

export default PlaysPage;

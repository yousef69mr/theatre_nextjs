import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";
import React, { FC } from "react";
interface SinglePlayPageProps {
  params: {
    locale: Locale;
    playId: string;
  };
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

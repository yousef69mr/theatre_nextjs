import { FC } from "react";

import ActorCarousel from "@/components/carousels/actor-carousel";
import ExecutorCarousel from "@/components/carousels/executor-carousel";
import HomeCarousel from "@/components/carousels/home-carousel";
import TranslationsProvider from "@/components/providers/translation-provider";
import { Separator } from "@/components/ui/separator";
import { getAllActorsRequest } from "@/lib/api-calls/models/actor";
import { getAllExecutorsRequest } from "@/lib/api-calls/models/executor";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import initTranslations from "@/lib/i18n";
import { globalNamespaces } from "@/lib/namespaces";
// import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { ActorType, ExecutorType, NewsCardType, PlayType } from "@/types";


interface HomePageProps {
  params: {
    locale: Locale;
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

const i18nextNamspaces = [...globalNamespaces];

const HomePage: FC<HomePageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { t, resources } = await initTranslations(locale, i18nextNamspaces);
  const plays: PlayType[] = await getAllPlaysRequest();
  const executors: ExecutorType[] = await getAllExecutorsRequest();
  const actors: ActorType[] = await getAllActorsRequest();

  // console.log(plays)

  const formattedActors = actors.map((actor) => ({
    ...actor,
    festivals: actor.plays,
  }));

  const formattedExecutors = executors.map((executor) => ({
    ...executor,
    festivals: executor.plays,
  }));

  const news: NewsCardType[] = plays.slice(0, 2).map((play) => ({
    id: play.id,
    title: play.name,
    imageUrl: play.posterImgUrl,
    type: "play",
  }));

  // console.log(news);
  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <div className="px-10">
            <HomeCarousel news={news} />
            {formattedActors.length > 0 && (
              <>
                <Separator className="bg-red-100 dark:bg-red-700/15  my-10" />
                <section className="space-y-3 w-full">
                  <h1 className="font-bold text-2xl capitalize">
                    {t("actor.plural", { ns: "constants" })} ({actors.length})
                  </h1>

                  <ActorCarousel actors={formattedActors} />
                </section>
              </>
            )}

            {executors.length > 0 && (
              <>
                <Separator className="bg-red-100 dark:bg-red-700/15 my-10" />
                <section className="space-y-3 w-full">
                  <h1 className="font-bold text-2xl capitalize">
                    {t("executor.plural", { ns: "constants" })} (
                    {executors.length})
                  </h1>

                  <ExecutorCarousel executors={formattedExecutors} />
                </section>
              </>
            )}
          </div>
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default HomePage;

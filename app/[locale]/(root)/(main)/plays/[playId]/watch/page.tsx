import { type Metadata } from "next";
import Image from "next/image";
import TranslationsProvider from "@/components/providers/translation-provider";
import {
  getAllPlaysRequest,
  getPlayByIdRequest,
} from "@/lib/api-calls/models/play";
import initTranslations from "@/lib/i18n";
import { Locale } from "@/next-i18next.config";
import { FestivalType, PlayType, TicketType } from "@/types";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import CardWrapper from "@/components/helpers/card-wrapper";
import BookPlayTicketsForm from "@/components/forms/actions/book-play-tickets";
import { isPlayLive } from "@/lib/helpers/play-validations";
import { AudioLines } from "lucide-react";
import FormError from "@/components/forms/form-error";
import { getUserTicketsRequest } from "@/lib/api-calls/models/ticket";
import EmbedPlayer from "@/components/helpers/emded-player";
import { Separator } from "@/components/ui/separator";
import PlayCarousel from "@/components/carousels/play-carousel";
import { notFound } from "next/navigation";
// import { redirect } from "next/navigation";

interface BookPlayTicketPageProps {
  params: {
    locale: Locale;
    playId: string;
  };
}
const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

export async function generateMetadata({
  params,
}: BookPlayTicketPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  // fetch data
  const id = params.playId;

  const play: PlayType | null = await getPlayByIdRequest(id);
  // console.log(play);

  if (play) {
    const title = `${play.name} | ${t("actions.watch", {
      ns: "common",
      instance: t("play.single", { ns: "constants" }),
    })}`;
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

const WatchPlayPage: React.FC<BookPlayTicketPageProps> = async (props) => {
  const {
    params: { locale, playId },
  } = props;
  const { t, resources } = await initTranslations(locale, i18nextNamspaces);

  const play: PlayType | null = await getPlayByIdRequest(playId);

  if (!play) {
    notFound();
    // return redirect(`/${locale}/plays/${playId}`);
  }
  const plays: PlayType[] | null = await getAllPlaysRequest();

  const title = t("app_title", { ns: "common" }).split("|");
  const pageTitle = (
    <>
      <span className="font-semibold text-2xl">{title[0]}</span>
      {/* <br /> */}
      <span className="font-semibold text-sm md:text-xl">{title[1]}</span>
    </>
  );

  const isLive = isPlayLive(play.festivals);

  const subTitle = (
    <>
      <div className="flex items-center justify-start gap-x-2">
        <span>
          {t("actions.watch", {
            ns: "constants",
            instance: t("play.single", { ns: "constants" }),
          })}
        </span>
        {isLive && (
          <AudioLines className="w-5 h-5 transition-all text-emerald-500 animate-pulse" />
        )}
      </div>
      {/* <br />{" "} */}
      <span className="font-bold text-lg md:text-2xl text-primary dark:text-red-200">
        {play.name}
      </span>
    </>
  );

  const otherPlays = plays?.filter((temp) => temp.id !== play.id);
  return (
    <main className="flex flex-col items-center justify-center w-full relative general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 flex-col space-y-4 flex items-center w-full">
          <div className="flex size-full p-4 items-center justify-center relative">
            {play.videoUrl && (
              <>
                <div className="w-full h-full bg-neutral-800/40 backdrop-saturate-50 top-0 left-0 -z-10 absolute" />
                <Image
                  fill
                  priority
                  src="/bg-play-watch.jpg"
                  alt="theatre background"
                  className="-z-20"
                />
              </>
            )}

            {play.videoUrl ? (
              <EmbedPlayer
                src={play.videoUrl}
                type="video"
                className="w-full play-video-section"
              />
            ) : (
              <CardWrapper headerTitle={pageTitle} headerSubTitle={subTitle}>
                <FormError
                  message={t("errors.noPlayVideo", {
                    ns: "constants",
                    instance: t("play.single", { ns: "constants" }),
                  })}
                />
              </CardWrapper>
            )}
          </div>
          {otherPlays && (
            <div className="px-10 space-y-4 w-full">
              <Separator className="bg-red-100 dark:bg-red-700/15  my-16" />
              <section className="space-y-3 w-full">
                <div className="flex items-center gap-2 justify-start">
                  <h3 className="flex items-center gap-x-2 font-bold text-2xl capitalize rtl:flex-row-reverse">
                    <span> {t("other.single", { ns: "constants" })}</span>
                    <span>{t("play.plural", { ns: "constants" })}</span>{" "}
                  </h3>
                  <span className="font-bold text-2xl">
                    ({otherPlays.length})
                  </span>
                </div>

                <PlayCarousel plays={otherPlays} />
              </section>
            </div>
          )}
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default WatchPlayPage;

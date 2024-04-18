import { type Metadata } from "next";
import Image from "next/image";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getPlayByIdRequest } from "@/lib/api-calls/models/play";
import initTranslations from "@/lib/i18n";
import { Locale } from "@/next-i18next.config";
import { FestivalType, PlayType, TicketType } from "@/types";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import CardWrapper from "@/components/helpers/card-wrapper";
import BookPlayTicketsForm from "@/components/forms/actions/book-play-tickets";
import { getAllFestivalsRequest } from "@/lib/api-calls/models/festival";
import { isPlayLive } from "@/lib/helpers/play-validations";
import { AudioLines } from "lucide-react";
import FormError from "@/components/forms/form-error";
import { getUserTicketsRequest } from "@/lib/api-calls/models/ticket";
import { currentUser } from "@/lib/auth";
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
    const title = `${play.name} | ${t("actions.book", {
      ns: "common",
      instance: t("ticket.plural", { ns: "constants" }),
    })}`;
    return {
      title,
      description: play.description || title,
    };
  }

  return {
    title: t("errors.notFound", {
      ns: "constants",
      instance: t("play.single", { ns: "constants" }),
    }),
    description: "unknown play to the database.",
  };
}

const BookPlayTicketPage: React.FC<BookPlayTicketPageProps> = async (props) => {
  const {
    params: { locale, playId },
  } = props;
  const { t, resources } = await initTranslations(locale, i18nextNamspaces);
  const user = await currentUser();
  const play: PlayType | null = await getPlayByIdRequest(playId);
  const tickets: TicketType[] = await getUserTicketsRequest(user?.id as string);

  if (!play) {
    notFound();
    // return redirect(`/${locale}/plays/${playId}`);
  }

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
          {t("actions.book", {
            ns: "constants",
            instance: t("ticket.single", { ns: "constants" }),
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
  return (
    <main className="flex flex-col items-center justify-center w-full relative general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="w-full h-full bg-neutral-800/40 backdrop-saturate-50 top-0 left-0 -z-10 absolute" />
        <div className="flex-1 space-y-4 pt-6 flex items-center">
          <Image
            fill
            priority
            src="/book-tickets.jpg"
            alt="theatre background"
            className="-z-20"
          />

          <CardWrapper headerTitle={pageTitle} headerSubTitle={subTitle}>
            {isLive ? (
              <BookPlayTicketsForm play={play} userTickets={tickets} />
            ) : (
              <FormError
                message={t("errors.notLive", {
                  ns: "constants",
                  instance: t("play.single", { ns: "constants" }),
                })}
              />
            )}
          </CardWrapper>
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default BookPlayTicketPage;

import PlayList from "@/components/cards/plays/play-list";
import PlayListClient from "@/components/clients/play/public/plays-client";
import FormError from "@/components/forms/form-error";
import CardWrapper from "@/components/helpers/card-wrapper";
import Heading from "@/components/helpers/heading";
import TranslationsProvider from "@/components/providers/translation-provider";
import { Separator } from "@/components/ui/separator";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import { isPlayLive } from "@/lib/helpers/play-validations";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
// import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { PlayType } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import { FC } from "react";
interface AttendPlayPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

export async function generateMetadata({
  params,
}: AttendPlayPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  // fetch data
  const app_title = t("app_title", { ns: "common" });

  const plays: PlayType[] = await getAllPlaysRequest();
  // console.log(plays)
  const livePlays: PlayType[] = plays.filter((play) =>
    isPlayLive(play.festivals)
  );

  if (livePlays.length > 0) {
    const title = `${t("play.plural", { ns: "constants" })} | ${t(
      "actions.book",
      {
        ns: "common",
        instance: t("ticket.plural", { ns: "constants" }),
      }
    )}`;

    return {
      title,
      description: title,
    };
  }

  return {
    title: `${t("errors.noLive", {
      ns: "constants",
      instance: t("play.plural", { ns: "constants" }),
    })}  | ${app_title}`,
    description: t("errors.noPlaysToAttend", {
      ns: "constants",
    }),
  };
}
const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AttendPlayPage: FC<AttendPlayPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { t, resources } = await initTranslations(locale, i18nextNamspaces);

  const plays: PlayType[] = await getAllPlaysRequest();
  // console.log(plays)
  const livePlays: PlayType[] = plays.filter((play) =>
    isPlayLive(play.festivals)
  );

  const headingTitle = `${t("play.plural", { ns: "constants" })} (${
    livePlays.length || 0
  })`;

  const title = t("app_title", { ns: "common" }).split("|");
  const pageTitle = (
    <>
      <span className="font-semibold text-2xl">{title[0]}</span>
      {/* <br /> */}
      <span className="font-semibold text-sm md:text-xl">{title[1]}</span>
    </>
  );
  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        {livePlays.length > 0 ? (
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <Heading title={headingTitle} />
            </div>
            <Separator />
            <PlayList plays={livePlays} redirect="attend" />
          </div>
        ) : (
          <div className="size-full flex items-center justify-center relative main-section">
            <div className="w-full h-full bg-neutral-800/40 backdrop-saturate-50 top-0 left-0 -z-10 absolute" />
            <Image
              fill
              priority
              src="/book-tickets.jpg"
              alt="theatre background"
              className="-z-20"
            />
            <CardWrapper headerTitle={pageTitle}>
              <FormError
                message={t("errors.noPlaysToAttend", {
                  ns: "constants",
                })}
              />
            </CardWrapper>
          </div>
        )}
      </TranslationsProvider>
    </main>
  );
};

export default AttendPlayPage;

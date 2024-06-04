import { FC } from "react";

import { Locale } from "@/next-i18next.config";
import { TicketType, PlayType } from "@/types";
import { getTicketByIdRequest } from "@/lib/api-calls/models/ticket";
import initTranslations from "@/lib/i18n";
import TranslationsProvider from "@/components/providers/translation-provider";
import TicketClient from "@/components/clients/ticket/public/single-ticket-client";
import { globalNamespaces } from "@/lib/namespaces";
import { ResolvingMetadata, type Metadata } from "next";
import { notFound } from "next/navigation";

interface SingleTicketPageProps {
  params: {
    locale: Locale;
    ticketId: string;
  };
}

const i18nextNamspaces = [...globalNamespaces];

export async function generateMetadata(
  { params }: SingleTicketPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  const parentKeywords = (await parent).keywords || [];

  // fetch data
  const id = params.ticketId;

  const ticket: TicketType | null = await getTicketByIdRequest(id);
  // console.log(ticket);

  const baseKeywords = [
    ...parentKeywords,
    t("ticket.single", { ns: "constants" }),
  ];

  if (ticket) {
    const title = `${ticket.guestName} (${ticket.id}) | ${t("ticket.single", {
      ns: "constants",
    })}`;
    const description = ticket.play.name;
    return {
      title,
      description,
      keywords: [...baseKeywords, ticket.festival.name, ticket.play.name],
      openGraph: {
        title,
        description,
        type: "website",
        // images: executor.imgUrl ?? undefined,
      },
    };
  }

  const title = `${t("errors.notFound", {
    ns: "constants",
    instance: t("ticket.single", { ns: "constants" }),
  })} | ${t("UserRole.USER", {
    ns: "common",
  })}`;

  return {
    title,
    description: "unknown ticket to the database.",
    keywords: [...baseKeywords],
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

const SingleTicketPage: FC<SingleTicketPageProps> = async (props) => {
  const {
    params: { locale, ticketId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const ticket: TicketType | null = await getTicketByIdRequest(ticketId);

  if (!ticket) {
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
          <TicketClient ticket={ticket} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default SingleTicketPage;

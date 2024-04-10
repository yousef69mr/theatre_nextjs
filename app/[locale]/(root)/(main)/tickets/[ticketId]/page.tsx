import { FC } from "react";

import { Locale } from "@/next-i18next.config";
import { TicketType, PlayType } from "@/types";
import { getTicketByIdRequest } from "@/lib/api-calls/models/ticket";
import initTranslations from "@/lib/i18n";
import TranslationsProvider from "@/components/providers/translation-provider";
import TicketClient from "@/components/clients/ticket/public/single-ticket-client";
import { globalNamespaces } from "@/lib/namespaces";
import { type Metadata } from "next";

interface SingleTicketPageProps {
  params: {
    locale: Locale;
    ticketId: string;
  };
}

const i18nextNamspaces = [...globalNamespaces];

export async function generateMetadata({
  params,
}: SingleTicketPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  // fetch data
  const id = params.ticketId;

  const ticket: TicketType | null = await getTicketByIdRequest(id);
  // console.log(ticket);

  if (ticket) {
    const title = `${ticket.guestName} (${ticket.id}) | ${t("ticket.single", {
      ns: "constants",
    })}`;
    return {
      title,
      description: ticket.festival.name || title,
    };
  }

  return {
    title: "not found",
    description: "unknown ticket to the database.",
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
    return <>not found</>;
  }

  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 p-8 pt-6">
          <TicketClient ticket={ticket} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default SingleTicketPage;

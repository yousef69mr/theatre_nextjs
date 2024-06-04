import TicketClient from "@/components/clients/ticket/admin/single-ticket-client";
import TranslationsProvider from "@/components/providers/translation-provider";

import { getTicketByIdRequest } from "@/lib/api-calls/models/ticket";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { Locale } from "@/next-i18next.config";
import { TicketType } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";

// export async function generateStaticParams() {
//   const tickets: TicketType[] = await getAllTicketsRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (tickets.length > 0) {
//       return tickets.map((ticket) => ({
//         ticketId: ticket.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, ticketId: "new" };
//     }
//   });
// }

interface AdminSingleTicketPageProps {
  params: { locale: Locale; ticketId: string };
}

export async function generateMetadata(
  { params }: AdminSingleTicketPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  const parentKeywords = (await parent).keywords || [];

  // fetch data
  const id = params.ticketId;

  const ticket: TicketType | null =
    id !== "new" ? await getTicketByIdRequest(id) : null;
  // console.log(ticket);

  const baseKeywords = [
    ...parentKeywords,
    t("ticket.single", {
      ns: "constants",
    }),
  ];
  if (ticket) {
    const title = `${ticket.guestName} (${ticket.id}) | ${t("ticket.single", {
      ns: "constants",
    })}`;
    return {
      title,
      description: ticket.festival.name || title,
      keywords: [...baseKeywords, ticket.festival.name, ticket.play.name],
    };
  }

  return {
    title: t("actions.add", {
      ns: "common",
      instance: t("ticket.single", { ns: "constants" }),
    }),
    description: "Add a new ticket to the database.",
    keywords: [...baseKeywords],
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminSingleTicketPage: FC<AdminSingleTicketPageProps> = async (props) => {
  const {
    params: { locale, ticketId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  // console.log(executors);
  // console.log(ticketId);
  const ticket: TicketType | null =
    ticketId !== "new" ? await getTicketByIdRequest(ticketId) : null;
  // console.log(ticket);

  // console.log(formattedTicket);
  return (
    <main className="w-full main-section general-padding">
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

export default AdminSingleTicketPage;

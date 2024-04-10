import { FC } from "react";
import type { Metadata } from "next";
import TicketListClient from "@/components/clients/ticket/admin/ticket-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllTicketsRequest } from "@/lib/api-calls/models/ticket";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { Locale } from "@/next-i18next.config";
import { TicketType } from "@/types";

interface AdminTicketsPage {
  params: { locale: Locale };
}

export const metadata: Metadata = {
  title: "Tickets | admin",
  description: "all theatre tickets",
};

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminTicketsPage: FC<AdminTicketsPage> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const tickets: TicketType[] = await getAllTicketsRequest();

  // console.log(tickets);
  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 p-8 pt-6">
          <TicketListClient data={tickets} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminTicketsPage;

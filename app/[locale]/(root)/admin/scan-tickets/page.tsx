import { FC } from "react";
import type { Metadata } from "next";
import TicketListClient from "@/components/clients/ticket/admin/ticket-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllTicketsRequest } from "@/lib/api-calls/models/ticket";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { Locale } from "@/next-i18next.config";
import { TicketType } from "@/types";
import TicketQRScanner from "@/components/helpers/TicketQRScanner";

interface AdminScanTicketsPage {
  params: { locale: Locale };
}

export async function generateMetadata({
  params,
}: AdminScanTicketsPage): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const title = `${t("actions.scan", {
    ns: "common",
    instance: t("ticket.plural", { ns: "constants" }),
  })} | ${t("UserRole.ADMIN", {
    ns: "common",
  })}`;

  //TODO: make proper
  const description = "scan all theatre tickets";
  return {
    title,
    description,
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminScanTicketsPage: FC<AdminScanTicketsPage> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);

  // console.log(tickets);
  return (
    <main className="flex flex-col justify-center w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 w-full md:max-w-96 mx-auto">
          <TicketQRScanner/>
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminScanTicketsPage;

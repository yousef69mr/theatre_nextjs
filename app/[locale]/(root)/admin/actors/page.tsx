import ActorListClient from "@/components/clients/actor/admin/actor-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllActorsRequest } from "@/lib/api-calls/models/actor";

import initTranslations from "@/lib/i18n";
import type { Metadata } from "next";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { Locale } from "@/next-i18next.config";
import { ActorType } from "@/types";
import { FC } from "react";
interface AdminActorsPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({
  params,
}: AdminActorsPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const title = `${t("actor.plural", { ns: "constants" })} | ${t(
    "UserRole.ADMIN",
    {
      ns: "common",
    }
  )}`;

  //TODO: make proper
  const description = "all theatre actors";
  return {
    title,
    description,
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminActorsPage: FC<AdminActorsPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const actors: ActorType[] = await getAllActorsRequest();
  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <ActorListClient data={actors} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminActorsPage;

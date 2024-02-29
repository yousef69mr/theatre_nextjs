import ActorListClient from "@/components/clients/actor/actor-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllActorsRequest } from "@/lib/api-calls/models/actor";

import initTranslations from "@/lib/i18n";
import type { Metadata } from "next";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { Locale } from "@/next-i18next.config";
import { ActorType } from "@/types";
import { FC } from "react";
interface AdminPlaysPageProps {
  params: { locale: Locale };
}

export const metadata: Metadata = {
  title: "Actors | admin",
  description: "all actors",
};

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminActorsPage: FC<AdminPlaysPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const actors: ActorType[] = await getAllActorsRequest();
  return (
    <main className="flex flex-col w-full">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ActorListClient data={actors} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminActorsPage;

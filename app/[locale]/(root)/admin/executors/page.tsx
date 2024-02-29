import ExecutorListClient from "@/components/clients/executor/executor-client";
import PlayForm from "@/components/forms/models/play-form";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllExecutorsRequest } from "@/lib/api-calls/models/executor";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { Locale } from "@/next-i18next.config";
import { ExecutorType } from "@/types";
import type { Metadata } from "next";
import { FC } from "react";
interface AdminPlaysPage {
  params: { locale: Locale };
}
export const metadata: Metadata = {
  title: "Executors | admin",
  description: "all executors",
};

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminPlaysPage: FC<AdminPlaysPage> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const executors: ExecutorType[] = await getAllExecutorsRequest();

  return (
    <main className="flex flex-col w-full">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ExecutorListClient data={executors} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminPlaysPage;

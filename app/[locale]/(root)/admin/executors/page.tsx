import ExecutorListClient from "@/components/clients/executor/admin/executor-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllExecutorsRequest } from "@/lib/api-calls/models/executor";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { Locale } from "@/next-i18next.config";
import { ExecutorType } from "@/types";
import type { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";

interface AdminExecutorsPageProps {
  params: { locale: Locale };
}
export async function generateMetadata({
  params,
}: AdminExecutorsPageProps, parent: ResolvingMetadata): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const executors: ExecutorType[] = await getAllExecutorsRequest();

  const parentKeywords = (await parent).keywords || [];
  const keywords = executors.map((executor) => executor.name);
  const title = `${t("executor.plural",{ns:"constants"})}`;

  //TODO: make proper
  const description = "all theatre executors";
  return {
    title,
    description,
    keywords: [
      ...parentKeywords,
      t("executor.single", { ns: "constants" }),
      t("executor.plural", { ns: "constants" }),
      ...keywords,
    ],
  };
}
const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminExecutorsPage: FC<AdminExecutorsPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const executors: ExecutorType[] = await getAllExecutorsRequest();

  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <ExecutorListClient data={executors} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminExecutorsPage;

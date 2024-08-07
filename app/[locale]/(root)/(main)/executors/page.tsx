import { FC } from "react";
import { Metadata, ResolvingMetadata } from "next";
import ExecutorListClient from "@/components/clients/executor/public/executors-client";

import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllExecutorsRequest } from "@/lib/api-calls/models/executor";

import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
// import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { ExecutorType } from "@/types";

interface ExecutorsPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

export async function generateMetadata(
  { params }: ExecutorsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const executors: ExecutorType[] = await getAllExecutorsRequest();

  const parentKeywords = (await parent).keywords || [];
  const keywords = executors.map((executor) => executor.name);

  const title = `${t("executor.plural", { ns: "constants" })} | ${t(
    "UserRole.USER",
    {
      ns: "common",
    }
  )}`;
  return {
    title,
    description: title,
    keywords: [
      ...parentKeywords,
      t("executor.single", { ns: "constants" }),
      t("executor.plural", { ns: "constants" }),
      ...keywords,
    ],
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const PlaysPage: FC<ExecutorsPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);

  const executors: ExecutorType[] = await getAllExecutorsRequest();
  // console.log(plays)
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

export default PlaysPage;

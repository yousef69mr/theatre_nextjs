import { FC } from "react";
import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Executors | user",
  description: "all theatre executors",
};

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const PlaysPage: FC<ExecutorsPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);

  const executors: ExecutorType[] = await getAllExecutorsRequest();
  // console.log(plays)
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

export default PlaysPage;

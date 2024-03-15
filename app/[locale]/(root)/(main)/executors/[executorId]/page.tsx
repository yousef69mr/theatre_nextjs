import { FC } from "react";

import { Locale } from "@/next-i18next.config";
import { ExecutorType, PlayType } from "@/types";
import { getExecutorByIdRequest } from "@/lib/api-calls/models/executor";
import initTranslations from "@/lib/i18n";
import TranslationsProvider from "@/components/providers/translation-provider";
import ExecutorClient from "@/components/clients/executor/public/single-executor-client";
import { globalNamespaces } from "@/lib/namespaces";
import { type Metadata } from "next";

interface SingleExecutorPageProps {
  params: {
    locale: Locale;
    executorId: string;
  };
}

const i18nextNamspaces = [...globalNamespaces];

export async function generateMetadata({
  params,
}: SingleExecutorPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  // fetch data
  const id = params.executorId;

  const executor: ExecutorType | null = await getExecutorByIdRequest(id);
  // console.log(executor);

  if (executor) {
    const title = `${executor.name} | ${t("executor.single", {
      ns: "constants",
    })}`;
    return {
      title,
      description: executor.description || title,
    };
  }

  return {
    title: "not found",
    description: "unknown executor to the database.",
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

const SingleExecutorPage: FC<SingleExecutorPageProps> = async (props) => {
  const {
    params: { locale, executorId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const executor: ExecutorType | null = await getExecutorByIdRequest(
    executorId
  );

  if (!executor) {
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
          <ExecutorClient executor={executor} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default SingleExecutorPage;

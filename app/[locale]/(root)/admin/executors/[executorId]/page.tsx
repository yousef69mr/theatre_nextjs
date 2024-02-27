// import PlayForm from "@/components/forms/play-form";
import ExecutorListClient from "@/components/clients/executor/single-executor-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import {
  getAllExecutorsRequest,
  getExecutorByIdRequest,
} from "@/lib/api-calls/models/executor";
import { getAllFestivalsRequest } from "@/lib/api-calls/models/festival";

import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { ExecutorType, FestivalType } from "@/types";
import { FC } from "react";

// export async function generateStaticParams() {
//   const executors: ExecutorType[] = await getAllExecutorsRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (executors.length > 0) {
//       return executors.map((executor) => ({
//         executorId: executor.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, executorId: "new" };
//     }
//   });
// }

interface AdminSingleExecutorPageProps {
  params: { locale: Locale; executorId: string };
}
const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminSingleExecutorPage: FC<AdminSingleExecutorPageProps> = async (
  props
) => {
  const {
    params: { locale, executorId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);

  const festivals: FestivalType[] = await getAllFestivalsRequest();

  const executor: ExecutorType | null = await getExecutorByIdRequest(
    executorId
  );

  if (!executor && executorId !== "new") {
    // throw new Error("Not found");
  }
  return (
    <main className="w-full main-section general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ExecutorListClient executor={executor} festivals={festivals} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminSingleExecutorPage;

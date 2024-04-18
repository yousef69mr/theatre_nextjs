import { FC } from "react";
import type { Metadata } from "next";
import PlayListClient from "@/components/clients/play/admin/play-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllPlaysRequest } from "@/lib/api-calls/models/play";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { Locale } from "@/next-i18next.config";
import { PlayType } from "@/types";

interface AdminPlaysPageProps {
  params: { locale: Locale };
}


export async function generateMetadata({
  params,
}: AdminPlaysPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const title = `${t("play.plural",{ns:"constants"})} | ${t("UserRole.ADMIN", {
    ns: "common",
  })}`;

  //TODO: make proper
  const description = "all theatre plays";
  return {
    title,
    description,
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminPlaysPage: FC<AdminPlaysPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const plays: PlayType[] = await getAllPlaysRequest();

  // console.log(plays);
  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <PlayListClient data={plays} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminPlaysPage;

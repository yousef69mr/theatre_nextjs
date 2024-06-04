import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";
import initTranslations from "@/lib/i18n";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import TranslationsProvider from "@/components/providers/translation-provider";
import { redirect } from "next/navigation";

interface AdminDashboardPageProps {
  params: { locale: Locale };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

export async function generateMetadata({
  params,
}: AdminDashboardPageProps, parent: ResolvingMetadata):
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  const parentKeywords = (await parent).keywords || [];

  const title = `${t("navbar.routes.adminDashboard")}`;

  //TODO: make proper
  const description = title;
  return {
    title,
    description,
    keywords:[...parentKeywords]
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminDashboardPage: FC<AdminDashboardPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;

  const { resources } = await initTranslations(locale, i18nextNamspaces);

  return redirect(`/${locale}/admin/plays`);

  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">Admin Dashboard</div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminDashboardPage;

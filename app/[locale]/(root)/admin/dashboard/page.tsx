import { Metadata } from "next";
import { FC } from "react";
import initTranslations from "@/lib/i18n";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";

interface AdminDashboardPageProps {
  params: { locale: Locale };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

export async function generateMetadata({
  params,
}: AdminDashboardPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const title = `${t("navbar.routes.adminDashboard")} | ${t("UserRole.ADMIN", {
    ns: "common",
  })}`;

  //TODO: make proper
  const description = title;
  return {
    title,
    description,
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminDashboardPage: FC<AdminDashboardPageProps> = (props) => {
  const {
    params: { locale },
  } = props;
  return <main className="w-full general-padding">AdminDashboardPage</main>;
};

export default AdminDashboardPage;

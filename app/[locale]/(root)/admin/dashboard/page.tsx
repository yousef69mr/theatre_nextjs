import i18nConfig, { Locale } from "@/next-i18next.config";
import { FC } from "react";

interface AdminDashboardPageProps {
  params: { locale: Locale };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

const AdminDashboardPage: FC<AdminDashboardPageProps> = (props) => {
  const {
    params: { locale },
  } = props;
  return <main className="w-full">AdminDashboardPage</main>;
};

export default AdminDashboardPage;

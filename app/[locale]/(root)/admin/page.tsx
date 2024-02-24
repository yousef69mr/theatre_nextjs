import i18nConfig, { Locale } from "@/next-i18next.config";
import { redirect } from "next/navigation";
import { FC } from "react";

interface AdminPageProps {
  params: { locale: Locale };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

const AdminPage: FC<AdminPageProps> = (props) => {
  const {
    params: { locale },
  } = props;
  return redirect(`/${locale}/admin/dashboard`);
};

export default AdminPage;

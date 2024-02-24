import i18nConfig, { Locale } from "@/next-i18next.config";
import { FC } from "react";

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

interface AttendPlayPageProps {
  params: {
    locale: Locale;
  };
}

const AttendPlayPage: FC<AttendPlayPageProps> = (props) => {
  const {
    params: { locale },
  } = props;
  return <div>AttendPlayPage</div>;
};

export default AttendPlayPage;

import ResetForm from "@/components/forms/auth/reset-form";
import CardWrapper from "@/components/helpers/card-wrapper";
import { Locale } from "@/next-i18next.config";
import { FC } from "react";
interface ResetPageProps {
  params: {
    locale: Locale;
  };
}

const ResetPage: FC<ResetPageProps> = (props) => {
  const {
    params: { locale },
  } = props;
  return (
    <CardWrapper
      backButtonLabel="Back to login"
      backButtonHref={`/${locale}/auth/login`}
      headerLabel="Forgot your password?"
    >
      <ResetForm />
    </CardWrapper>
  );
};

export default ResetPage;

import ResetForm from "@/components/forms/auth/reset-form";
import AuthCardWrapper from "@/components/cards/auth-card-wrapper";
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
    <AuthCardWrapper
      backButtonLabel="Back to login"
      backButtonHref={`/${locale}/auth/login`}
      headerLabel="Forgot your password?"
    >
      <ResetForm />
    </AuthCardWrapper>
  );
};

export default ResetPage;

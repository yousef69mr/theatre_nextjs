import NewVerificationForm from "@/components/forms/auth/new-verification-form";
import AuthCardWrapper from "@/components/cards/auth-card-wrapper";
import { Locale } from "@/next-i18next.config";
import { FC } from "react";
interface NewVerificationPageProps {
  params: {
    locale: Locale;
  };
}
const NewVerificationPage: FC<NewVerificationPageProps> = (props) => {
  const {
    params: { locale },
  } = props;
  return (
    <AuthCardWrapper
      headerLabel="confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref={`/${locale}/auth/login`}
    >
      <NewVerificationForm />
    </AuthCardWrapper>
  );
};

export default NewVerificationPage;

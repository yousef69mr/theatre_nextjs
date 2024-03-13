import NewPasswordForm from "@/components/forms/auth/new-password-form";
import NewVerificationForm from "@/components/forms/auth/new-verification-form";
import AuthCardWrapper from "@/components/cards/auth-card-wrapper";
import { Locale } from "@/next-i18next.config";
import { FC } from "react";
interface NewPasswordPageProps {
  params: {
    locale: Locale;
  };
}
const NewPasswordPage: FC<NewPasswordPageProps> = (props) => {
  const {
    params: { locale },
  } = props;
  return (
    <AuthCardWrapper
      headerLabel="confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref={`${locale}/auth/login`}
    >
      <NewPasswordForm />
    </AuthCardWrapper>
  );
};

export default NewPasswordPage;

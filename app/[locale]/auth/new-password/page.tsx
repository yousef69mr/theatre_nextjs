import NewPasswordForm from "@/components/forms/new-password-form";
import NewVerificationForm from "@/components/forms/new-verification-form";
import CardWrapper from "@/components/helpers/card-wrapper";
import { Locale } from "@/next-i18next.config";
import { FC } from "react";
interface NewPasswordPageProps {
  params: {
    locale: Locale;
  };
}
const NewPasswordPage:FC<NewPasswordPageProps> = (props) => {
  const {
    params: { locale },
  } = props;
  return (
    <CardWrapper
      headerLabel="confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref={`${locale}/auth/login`}
    >
      <NewPasswordForm />
    </CardWrapper>
  );
};

export default NewPasswordPage;

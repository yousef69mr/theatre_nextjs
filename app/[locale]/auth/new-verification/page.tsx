import NewVerificationForm from "@/components/forms/new-verification-form";
import CardWrapper from "@/components/helpers/card-wrapper";
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
    <CardWrapper
      headerLabel="confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref={`/${locale}/auth/login`}
    >
      <NewVerificationForm />
    </CardWrapper>
  );
};

export default NewVerificationPage;

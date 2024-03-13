import RegisterForm from "@/components/forms/auth/register-form";
import AuthCardWrapper from "@/components/cards/auth-card-wrapper";
import { Locale } from "@/next-i18next.config";

interface RegisterPageProps {
  params: {
    locale: Locale;
  };
}

const RegisterPage = (props: RegisterPageProps) => {
  const {
    params: { locale },
  } = props;
  return (
    <AuthCardWrapper
      headerMainLabel="🔐 Auth"
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref={`/${locale}/auth/login`}
      showSocial
    >
      <RegisterForm />
    </AuthCardWrapper>
  );
};

export default RegisterPage;

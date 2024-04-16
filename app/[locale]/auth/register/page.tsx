import RegisterForm from "@/components/forms/auth/register-form";
import AuthCardWrapper from "@/components/cards/auth-card-wrapper";
import { Locale } from "@/next-i18next.config";
import { globalNamespaces } from "@/lib/namespaces";
import TranslationsProvider from "@/components/providers/translation-provider";
import initTranslations from "@/lib/i18n";

const i18nextNamspaces = [...globalNamespaces];

interface RegisterPageProps {
  params: {
    locale: Locale;
  };
}

const RegisterPage = async (props: RegisterPageProps) => {
  const {
    params: { locale },
  } = props;

  const { t, resources } = await initTranslations(locale, i18nextNamspaces);

  return (
    <TranslationsProvider
      resources={resources}
      namespaces={i18nextNamspaces}
      locale={locale}
    >
      <AuthCardWrapper
        headerMainLabel="🔐 Auth"
        headerLabel="Create an account"
        backButtonLabel={t("messages.already-have-account", {
          ns: "constants",
        })}
        backButtonHref={`/${locale}/auth/login`}
        showSocial
      >
        <RegisterForm />
      </AuthCardWrapper>
    </TranslationsProvider>
  );
};

export default RegisterPage;

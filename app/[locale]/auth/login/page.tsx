import LoginForm from "@/components/forms/auth/login-form";
import Image from "next/image";
import { Locale } from "@/next-i18next.config";
import AuthCardWrapper from "@/components/cards/auth-card-wrapper";
import initTranslations from "@/lib/i18n";
import { globalNamespaces } from "@/lib/namespaces";
import TranslationsProvider from "@/components/providers/translation-provider";

interface LoginPageProps {
  params: {
    locale: Locale;
  };
}

const i18nextNamspaces = [...globalNamespaces];

const LoginPage = async (props: LoginPageProps) => {
  const {
    params: { locale },
  } = props;
  // console.log(locale);

  const { t, resources } = await initTranslations(locale, i18nextNamspaces);

  const title = t("app_title", { ns: "common" }).split("|");
  const pageTitle = (
    <>
      <span>{title[0]}</span>
      <br />{" "}
      <span className="font-semibold text-sm md:text-xl">{title[1]}</span>
    </>
  );
  return (
    <TranslationsProvider
      resources={resources}
      namespaces={i18nextNamspaces}
      locale={locale}
    >
      <main className="w-full flex items-center justify-center py-4 relative">
        <Image
          fill
          priority
          src="/bg-login.jpg"
          alt="theatre background"
          className="-z-10"
        />
        <AuthCardWrapper
          headerMainLabel={pageTitle}
          headerLabel="Welcome back"
          backButtonLabel="Don't have an account?"
          backButtonHref={`/${locale}/auth/register`}
          showSocial
        >
          <LoginForm />
        </AuthCardWrapper>
      </main>
    </TranslationsProvider>
  );
};

export default LoginPage;

import LoginForm from "@/components/forms/login-form";
import Image from "next/image";
import { Locale } from "@/next-i18next.config";
import CardWrapper from "@/components/helpers/card-wrapper";

interface LoginPageProps {
  params: {
    locale: Locale;
  };
}

const LoginPage = (props: LoginPageProps) => {
  const {
    params: { locale },
  } = props;
  // console.log(locale);
  return (
    <main className="w-full flex items-center justify-center py-4 relative">
      <Image fill src="/bg-login.jpg" alt="theatre background" className="-z-10"/>
      <CardWrapper
        headerMainLabel="🔐 Auth"
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account?"
        backButtonHref={`/${locale}/auth/register`}
        showSocial
      >
        <LoginForm />
      </CardWrapper>
    </main>
    
  );
};

export default LoginPage;

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import Navbar from "@/components/navigation/navbar";
import { dir } from "i18next";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { SessionProvider } from "next-auth/react";
// import ScrollToTopButton from "@/components/helpers/scroll-to-top-button";
import TranslationsProvider from "@/components/providers/translation-provider";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
// import { EdgeStoreProvider } from "@/lib/edgestore";
import initTranslations from "@/lib/i18n";
import Footer from "@/components/navigation/footer";
import { author } from "@/lib/constants";
// import { ToastProvider } from "@/components/providers/toaster-provider";
// import ModalProvider from "@/components/providers/modal-provider";
// import { ConfettiProvider } from "@/components/providers/confetti-provider";

const ScrollToTopButton = dynamic(
  () => import("@/components/helpers/scroll-to-top-button"),
  { ssr: false }
);

const ToastProvider = dynamic(
  () =>
    import("@/components/providers/toaster-provider").then(
      (module) => module.ToastProvider
    ),
  { ssr: false }
);

const ConfettiProvider = dynamic(
  () =>
    import("@/components/providers/confetti-provider").then(
      (module) => module.ConfettiProvider
    ),
  { ssr: false }
);

const ModalProvider = dynamic(
  () => import("@/components/providers/modal-provider"),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: {
    locale: Locale;
  };
}): // parent: ResolvingMetadata
Promise<Metadata> {
  const { locale } = params;
  const { t } = await initTranslations(locale, i18nextNamspaces);

  const title = t("app_title", { ns: "common" });

  const languages: Record<string, string> = {};

  i18nConfig.locales.forEach((languageCode) => {
    languages[languageCode] = languageCode;
  });

  // console.log(languages);

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: t("app_description", { ns: "common" }),
    keywords: [...title.split(/[,| ]+/)],
    applicationName: title,
    creator: author.name,
    authors: [{ name: author.name, url: author.socialLink }],
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),
    alternates: {
      canonical: "/",
      languages,
    },
    openGraph: {
      title,
      url: process.env.NEXT_PUBLIC_DOMAIN,
      type: "website",
      locale,
    },
  };
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}) {
  // console.log(params.locale);
  const { locale } = params;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  return (
    <html
      lang={locale ?? i18nConfig.defaultLocale}
      dir={locale ? dir(locale) : dir(i18nConfig.defaultLocale)}
      suppressHydrationWarning
    >
      <body className={cn("min-h-screen w-full pb-5", inter?.className)}>
        <ConfettiProvider />
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <SessionProvider>
          <TranslationsProvider
            locale={locale}
            namespaces={i18nextNamspaces}
            resources={resources}
          >
            <ModalProvider />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              storageKey="theatre-theme"
              enableSystem
              disableTransitionOnChange
            >
              <ToastProvider />

              <Navbar
                locale={locale}
                className="general-padding min-h-[var(--header-height)]"
              />
              {children}
              <Footer className="general-padding" locale={locale} />
            </ThemeProvider>
          </TranslationsProvider>
          <ScrollToTopButton />
        </SessionProvider>
      </body>
    </html>
  );
}

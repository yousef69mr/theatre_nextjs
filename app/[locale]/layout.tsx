import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import Navbar from "@/components/navigation/navbar";
import { dir } from "i18next";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { SessionProvider } from "next-auth/react";
import ScrollToTopButton from "@/components/helpers/scroll-to-top-button";
import TranslationsProvider from "@/components/providers/translation-provider";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
// import { EdgeStoreProvider } from "@/lib/edgestore";
import initTranslations from "@/lib/i18n";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FCAI Theatre cast",
  description:
    "The FCAI (Faculty of Computer and Artificial Intelligence) Cast Theatre is an innovative platform that seamlessly integrates cutting-edge technologies with the performing arts. With its state-of-the-art facilities and dedicated team of professionals, the Cast Theatre offers a dynamic and immersive experience for both performers and audiences alike. At the heart of the FCAI Cast Theatre is a commitment to pushing the boundaries of traditional theatre through the use of artificial intelligence, computer graphics, and interactive media. From captivating virtual sets to real-time visual effects, every aspect of a performance is elevated to new heights, creating a truly unforgettable experience.Designed to inspire creativity and foster collaboration, the Cast Theatre serves as a hub for artists, technologists, and audiences to explore new possibilities in storytelling and expression. Whether it's a live stage production, a virtual reality experience, or a hybrid performance blending the physical and digital realms, the Cast Theatre is at the forefront of innovation in the arts. Join us at the FCAI Cast Theatre and immerse yourself in a world where imagination knows no bounds, and where the future of theatre is being redefined, one performance at a time.",
};

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
  const { resources } = await initTranslations(params.locale, i18nextNamspaces);
  return (
    <html
      lang={params.locale ? params.locale : i18nConfig.defaultLocale}
      dir={params.locale ? dir(params.locale) : dir(i18nConfig.defaultLocale)}
      suppressHydrationWarning
    >
      <body className={cn("min-h-screen w-full", inter.className)}>
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
            locale={params.locale}
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
                locale={params.locale}
                className="general-padding min-h-[var(--header-height)]"
              />
              {children}
            </ThemeProvider>
          </TranslationsProvider>
          <ScrollToTopButton />
        </SessionProvider>
      </body>
    </html>
  );
}

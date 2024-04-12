import { RoleGate } from "@/components/auth/role-gate";
import AdminSidebar from "@/components/navigation/admin-sidebar";
import TranslationsProvider from "@/components/providers/translation-provider";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { UserRole } from "@prisma/client";
import { Metadata } from "next";

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const title = `${t("route.plural", { ns: "constants" })} | ${t(
    "UserRole.ADMIN",
    {
      ns: "common",
    }
  )}`;

  //TODO: make proper
  const description = "all theatre executors";
  return {
    title,
    description,
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];
const AdminLayout = async ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) => {
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  return (
    <RoleGate
      allowedRoles={[
        UserRole.ADMIN,
        UserRole.CAST_HEAD,
        UserRole.CAST_VICE_PRESIDENT,
      ]}
    >
      <TranslationsProvider
        locale={locale}
        resources={resources}
        namespaces={i18nextNamspaces}
      >
        <div className="flex flex-nowrap relative">
          <AdminSidebar className="bottom-3 ltr:left-4 rtl:right-4" />
          {children}
        </div>
      </TranslationsProvider>
    </RoleGate>
  );
};

export default AdminLayout;

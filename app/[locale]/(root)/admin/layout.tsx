import { RoleGate } from "@/components/auth/role-gate";
import AdminSidebar from "@/components/navigation/admin-sidebar";
import TranslationsProvider from "@/components/providers/translation-provider";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { UserRole } from "@prisma/client";

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale: locale }));
}
const i18Namespaces = [...globalNamespaces, ...adminNamespaces];
const AdminLayout = async ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) => {
  const { resources } = await initTranslations(locale, i18Namespaces);
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
        namespaces={i18Namespaces}
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

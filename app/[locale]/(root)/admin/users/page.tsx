import { FC } from "react";
import type { Metadata } from "next";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllUsersRequest } from "@/lib/api-calls/models/user";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { Locale } from "@/next-i18next.config";
import { UserType } from "@/types";
import UserListClient from "@/components/clients/user/admin/user-client";

interface AdminUsersPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({
  params,
}: AdminUsersPageProps): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);

  const title = `${t("user.plural", { ns: "constants" })} | ${t(
    "UserRole.ADMIN",
    {
      ns: "common",
    }
  )}`;

  //TODO: make proper
  const description = "all FCAI users ";
  return {
    title,
    description,
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminUsersPage: FC<AdminUsersPageProps> = async (props) => {
  const {
    params: { locale },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const users: UserType[] = await getAllUsersRequest();

  // console.log(users);
  const formattedUsers = users.map((user) => ({
    ...user,
    userName: user.name,
    // profileImage:user.image
  }));

  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <UserListClient data={formattedUsers} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default AdminUsersPage;

import UserClient from "@/components/clients/user/public/single-user-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getUserByIdRequest } from "@/lib/api-calls/models/auth/user";
import initTranslations from "@/lib/i18n";
import { Locale } from "@/next-i18next.config";
import { TicketType, UserType } from "@/types";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import { FC } from "react";
import { getUserTicketsRequest } from "@/lib/api-calls/models/ticket";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: {
    locale: Locale;
    userId: string;
  };
}
const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const UserPage: FC<UserPageProps> = async (props) => {
  const {
    params: { locale, userId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const user: UserType | null = await getUserByIdRequest(userId);
  const userTickets: TicketType[] = await getUserTicketsRequest(userId);

  if (!user) {
    notFound();
  }

  const formattedUser = { ...user, tickets: userTickets };
  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <UserClient user={formattedUser} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default UserPage;

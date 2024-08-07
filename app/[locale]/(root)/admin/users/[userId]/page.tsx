import UserClient from "@/components/clients/user/admin/single-user-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getAllActorsRequest } from "@/lib/api-calls/models/actor";
import { getAllExecutorsRequest } from "@/lib/api-calls/models/executor";
import { getAllFestivalsRequest } from "@/lib/api-calls/models/festival";
import {
  getAllUsersRequest,
  getUserByIdRequest,
} from "@/lib/api-calls/models/user";
import initTranslations from "@/lib/i18n";
import { adminNamespaces, globalNamespaces } from "@/lib/namespaces";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { ActorType, ExecutorType, FestivalType, UserType } from "@/types";
import { ExecutorRole } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";

// export async function generateStaticParams() {
//   const users: UserType[] = await getAllUsersRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (users.length > 0) {
//       return users.map((user) => ({
//         userId: user.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, userId: "new" };
//     }
//   });
// }

interface AdminSingleUserPageProps {
  params: { locale: Locale; userId: string };
}

export async function generateMetadata(
  { params }: AdminSingleUserPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  const parentKeywords = (await parent).keywords || [];

  // fetch data
  const id = params.userId;

  const user: UserType | null =
    id !== "new" ? await getUserByIdRequest(id) : null;
  // console.log(user);

  if (user) {
    const title = `${user.name} | ${t("user.single", { ns: "constants" })}`;

    const actorProfile = user.actor?.actor;
    const executorProfile = user.executor?.executor;
    const actorProfileKeywords = actorProfile
      ? [actorProfile.name, actorProfile.nickname || ""]
      : [];
    const executorProfileKeywords = executorProfile
      ? [executorProfile.name, executorProfile.nickname || ""]
      : [];
    return {
      title,
      description: title,
      keywords: [
        ...parentKeywords,
        ...actorProfileKeywords,
        ...executorProfileKeywords,
        user.name,
        t("user.single", {
          ns: "constants",
        }),
      ],
    };
  }

  return {
    title: t("actions.add", {
      ns: "common",
      instance: t("user.single", { ns: "constants" }),
    }),
    description: "Add a new user to the database.",
    keywords:[...parentKeywords]
  };
}

const i18nextNamspaces = [...globalNamespaces, ...adminNamespaces];

const AdminSingleUserPage: FC<AdminSingleUserPageProps> = async (props) => {
  const {
    params: { locale, userId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);

  const festivals: FestivalType[] = await getAllFestivalsRequest();
  const executors: ExecutorType[] = await getAllExecutorsRequest();
  const actors: ActorType[] = await getAllActorsRequest();
  // console.log(executors);
  // console.log(userId);
  const user: UserType | null =
    userId !== "new" ? await getUserByIdRequest(userId) : null;
  // console.log(user);

  const formattedUser = user
    ? {
        ...user,
      }
    : null;
  // console.log(formattedUser);
  return (
    <main className="w-full main-section general-padding">
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

export default AdminSingleUserPage;

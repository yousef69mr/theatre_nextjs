import ActorClient from "@/components/clients/actor/public/single-actor-client";
import TranslationsProvider from "@/components/providers/translation-provider";
import { getActorByIdRequest } from "@/lib/api-calls/models/actor";
import initTranslations from "@/lib/i18n";
import { globalNamespaces } from "@/lib/namespaces";

import { Locale } from "@/next-i18next.config";
import { ActorType } from "@/types";
import { ResolvingMetadata, type Metadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";

interface SingleActorPageProps {
  params: {
    locale: Locale;
    actorId: string;
  };
}

const i18nextNamspaces = [...globalNamespaces];

export async function generateMetadata(
  { params }: SingleActorPageProps,
  parent: ResolvingMetadata
): // parent: ResolvingMetadata
Promise<Metadata> {
  const { t } = await initTranslations(params.locale, i18nextNamspaces);
  const parentKeywords = (await parent).keywords || [];

  // fetch data
  const id = params.actorId;

  const actor: ActorType | null = await getActorByIdRequest(id);
  // console.log(actor);
  const baseKeywords = [
    ...parentKeywords,
    t("actor.single", { ns: "constants" }),
  ];

  if (actor) {
    const title = `${actor.name} | ${t("actor.single", { ns: "constants" })}`;
    const description = actor.description || title;
    return {
      title,
      description,
      keywords: [...baseKeywords, actor.name, actor.nickname || ""],
      openGraph: {
        title,
        description,
        type: "profile",
        images: actor.imgUrl ?? undefined,
      },
    };
  }

  const title = `${t("errors.notFound", {
    ns: "constants",
    instance: t("actor.single", { ns: "constants" }),
  })} | ${t("UserRole.USER", {
    ns: "common",
  })}`;

  return {
    title,
    description: "unknown actor to the database.",
    keywords: [...baseKeywords],
  };
}

// export async function generateStaticParams() {
//   const actors: ActorType[] = await getAllActorsRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (actors.length > 0) {
//       return actors.map((actor) => ({
//         actorId: actor.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, actorId: "1" };
//     }
//   });
// }

const SingleActorPage: FC<SingleActorPageProps> = async (props) => {
  const {
    params: { locale, actorId },
  } = props;
  const { resources } = await initTranslations(locale, i18nextNamspaces);
  const actor: ActorType | null = await getActorByIdRequest(actorId, {
    viewIncrement: true,
  });

  if (!actor) {
    notFound();
  }

  return (
    <main className="flex flex-col w-full general-padding">
      <TranslationsProvider
        locale={locale}
        namespaces={i18nextNamspaces}
        resources={resources}
      >
        <div className="flex-1 space-y-4">
          <ActorClient actor={actor} />
        </div>
      </TranslationsProvider>
    </main>
  );
};

export default SingleActorPage;

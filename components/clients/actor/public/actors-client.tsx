"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import RotateLoader from "react-spinners/RotateLoader";

import { useParams, useRouter } from "next/navigation";
import { ActorType } from "@/types";
import { cn } from "@/lib/utils";
// import linkLocaleWrapper from "@/lib/link-locale-wrapper";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/helpers/heading";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { isAdmin } from "@/lib/auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { useActorStore } from "@/hooks/stores/use-actor-store";
import ActorList from "@/components/cards/actors/actor-list";
import CardsListClientSkeleton from "@/components/skeletons/clients/public/cards-list-client-skeleton";

interface ActorListClientProps {
  data: ActorType[];
}

const ActorListClient: FC<ActorListClientProps> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();

  const role = useCurrentRole();
  const setLocalActors = useActorStore((state) => state.setActors);
  // const localPlays = usePlayStore((state) => state.plays);
  const [filteredActors, setFilteredActors] = useState<ActorType[]>(data);

  const locale = params.locale as Locale;

  const headingTitle = `${t("actor.plural", { ns: "constants" })} (${
    filteredActors?.length || 0
  })`;

  useEffect(() => {
    setLocalActors(data);
  }, [data]);

  const isUserAdmin = isAdmin(role as UserRole);

  useEffect(() => {
    isUserAdmin && router.prefetch(`/${locale}/admin/actors/new`);
  }, [router, isUserAdmin]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={headingTitle} />
        {isUserAdmin && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => router.push(`/${locale}/admin/actors/new`)}
                >
                  <Plus className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")} />
                  <span className="hidden md:block">
                    {t("actions.add", {
                      ns: "common",
                      instance: t("actor.single", { ns: "constants" }),
                    })}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden flex">
                <span>
                  {t("actions.add", {
                    ns: "common",
                    instance: t("actor.single", { ns: "constants" }),
                  })}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Separator />

      {filteredActors ? (
        <>{Array.isArray(data) && <ActorList actors={data} />}</>
      ) : (
        <div className="size-full">
          <CardsListClientSkeleton />
        </div>
      )}
    </>
  );
};

export default ActorListClient;

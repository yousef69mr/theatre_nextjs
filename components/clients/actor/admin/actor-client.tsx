"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { ActorType } from "@/types";
import { cn } from "@/lib/utils";
// import linkLocaleWrapper from "@/lib/link-locale-wrapper";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/helpers/heading";
import { useTranslation } from "react-i18next";
// import { DataTable } from "../ui/data-table";
import ActorTable from "@/components/tables/actors/actors-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActorStore } from "@/hooks/stores/use-actor-store";
import TableSkeleton from "@/components/skeletons/table-skeleton";

interface ActorListClientProps {
  data: ActorType[];
}
const ActorListClient: FC<ActorListClientProps> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const setActors = useActorStore((state) => state.setActors);
  const actors = useActorStore((state) => state.actors);

  const locale = params.locale as Locale;

  const headingTitle = `${t("actor.plural", { ns: "constants" })} (${
    actors?.length||0
  })`;

  useEffect(() => {
    setActors(data);
  }, [data]);

  console.log(actors)

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={headingTitle} />
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
      </div>
      <Separator />
      {actors ? (
        <>{Array.isArray(data) && <ActorTable actors={actors} />}</>
      ) : (
        <div className=" w-full h-full">
          <TableSkeleton cols={5} rows={4} />
        </div>
      )}
    </>
  );
};

export default ActorListClient;

"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import RotateLoader from "react-spinners/RotateLoader";

import { useParams, useRouter } from "next/navigation";
import { PlayType } from "@/types";
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
import { usePlayStore } from "@/hooks/stores/use-play-store";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import PlayList from "@/components/cards/plays/play-list";
import { isAdmin } from "@/lib/auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

interface PlayListClientProps {
  data: PlayType[];
}
const PlayListClient: FC<PlayListClientProps> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();

  const role = useCurrentRole();
  const setLocalPlays = usePlayStore((state) => state.setPlays);
  // const localPlays = usePlayStore((state) => state.plays);
  const [filteredPlays, setFilteredPlays] = useState<PlayType[]>(data);

  const locale = params.locale as Locale;

  const headingTitle = `${t("play.plural", { ns: "constants" })} (${
    filteredPlays?.length || 0
  })`;

  useEffect(() => {
    setLocalPlays(data);
  }, [data]);

  useEffect(() => {
    router.prefetch(`/${locale}/admin/plays/new`);
  }, [router]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={headingTitle} />
        {isAdmin(role as UserRole) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => router.push(`/${locale}/admin/plays/new`)}
                >
                  <Plus className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")} />
                  <span className="hidden md:block">
                    {t("actions.add", {
                      ns: "common",
                      instance: t("play.single", { ns: "constants" }),
                    })}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden flex">
                <span>
                  {t("actions.add", {
                    ns: "common",
                    instance: t("play.single", { ns: "constants" }),
                  })}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Separator />

      {filteredPlays ? (
        <>{Array.isArray(data) && <PlayList plays={data} />}</>
      ) : (
        <div className=" w-full h-full">
          <TableSkeleton cols={5} rows={4} />
        </div>
      )}
    </>
  );
};

export default PlayListClient;

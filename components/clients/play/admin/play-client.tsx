"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect } from "react";
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
// import { DataTable } from "../../ui/data-table";
import PlayTable from "@/components/tables/plays/plays-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePlayStore } from "@/hooks/stores/use-play-store";
import TableSkeleton from "@/components/skeletons/table-skeleton";

interface PlayListClientProps {
  data: PlayType[];
}
const PlayListClient: FC<PlayListClientProps> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const setPlays = usePlayStore((state) => state.setPlays);
  const plays = usePlayStore((state) => state.plays);

  const locale = params.locale as Locale;

  const headingTitle = `${t("play.plural", { ns: "constants" })} (${
    plays?.length || 0
  })`;

  useEffect(() => {
    setPlays(data);
  }, [data]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={headingTitle} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => router.push(`/${locale}/admin/plays/new`)}>
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
      </div>
      <Separator />
      {plays ? (
        <>{Array.isArray(data) && <PlayTable plays={plays} />}</>
      ) : (
        <div className=" w-full h-full">
          <TableSkeleton cols={5} rows={4} />
        </div>
      )}
    </>
  );
};

export default PlayListClient;

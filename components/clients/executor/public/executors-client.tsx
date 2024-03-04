"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import RotateLoader from "react-spinners/RotateLoader";

import { useParams, useRouter } from "next/navigation";
import { ExecutorType } from "@/types";
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

import TableSkeleton from "@/components/skeletons/table-skeleton";

import { isAdmin } from "@/lib/auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { useExecutorStore } from "@/hooks/stores/use-executor-store";
import ExecutorList from "@/components/cards/executors/executor-list";

interface ExecutorListClientProps {
  data: ExecutorType[];
}

const ExecutorListClient: FC<ExecutorListClientProps> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();

  const role = useCurrentRole();
  const setLocalExecutors = useExecutorStore((state) => state.setExecutors);
  // const localPlays = usePlayStore((state) => state.plays);
  const [filteredExecutors, setFilteredExecutors] =
    useState<ExecutorType[]>(data);

  const locale = params.locale as Locale;

  const headingTitle = `${t("executor.plural", { ns: "constants" })} (${
    filteredExecutors?.length || 0
  })`;

  useEffect(() => {
    setLocalExecutors(data);
  }, [data]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={headingTitle} />
        {isAdmin(role as UserRole) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => router.push(`/${locale}/admin/executors/new`)}
                >
                  <Plus className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")} />
                  <span className="hidden md:block">
                    {t("actions.add", {
                      ns: "common",
                      instance: t("executor.single", { ns: "constants" }),
                    })}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden flex">
                <span>
                  {t("actions.add", {
                    ns: "common",
                    instance: t("executor.single", { ns: "constants" }),
                  })}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Separator />

      {filteredExecutors ? (
        <>{Array.isArray(data) && <ExecutorList executors={data} />}</>
      ) : (
        <div className=" w-full h-full">
          <TableSkeleton cols={5} rows={4} />
        </div>
      )}
    </>
  );
};

export default ExecutorListClient;

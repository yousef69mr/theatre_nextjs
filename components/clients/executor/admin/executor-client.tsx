"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { ExecutorType } from "@/types";
import { cn } from "@/lib/utils";
// import linkLocaleWrapper from "@/lib/link-locale-wrapper";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/helpers/heading";
import { useTranslation } from "react-i18next";
import { DataTable } from "../../../ui/data-table";
import PlayTable from "../../../tables/plays/plays-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ExecutorTable from "@/components/tables/executors/executors-table";
import { useExecutorStore } from "@/hooks/stores/use-executor-store";
import TableSkeleton from "@/components/skeletons/table-skeleton";

interface ExecutorListClientProps {
  data: ExecutorType[];
}
const ExecutorListClient: FC<ExecutorListClientProps> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const setExecutors = useExecutorStore((state) => state.setExecutors);
  const executors = useExecutorStore((state) => state.executors);

  const locale = params.locale as Locale;

  const headingTitle = `${t("executor.plural", { ns: "constants" })} (${
    executors?.length || 0
  })`;

  useEffect(() => {
    setExecutors(data);
  }, [data]);
  // console.log(executors);
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={headingTitle} />
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
      </div>
      <Separator />
      {executors ? (
        <>{Array.isArray(data) && <ExecutorTable executors={executors} />}</>
      ) : (
        <div className=" w-full h-full">
          <TableSkeleton cols={5} rows={4} />
        </div>
      )}
    </>
  );
};

export default ExecutorListClient;

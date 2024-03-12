"use client";
import { Locale } from "@/next-i18next.config";
import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { ExecutorType, FestivalType } from "@/types";
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
import ExecutorForm from "@/components/forms/models/executor-form";
import PermissionBox from "@/components/helpers/permission-box";
import { updateExecutorRequest } from "@/lib/api-calls/models/executor";
import toast from "react-hot-toast";
import { useExecutorStore } from "@/hooks/stores/use-executor-store";
import { useModal } from "@/hooks/stores/use-modal-store";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import Link from "next/link";
import ExecutorInPlayControl from "@/components/controls/executor-in-play-control";

interface ExecutorClientProps {
  executor: ExecutorType | null;
  festivals: FestivalType[];
}
const ExecutorClient: FC<ExecutorClientProps> = (props) => {
  const { executor, festivals } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const updateExecutor = useExecutorStore((state) => state.updateExecutor);
  const setFestivals = useFestivalStore((state) => state.setFestivals);
  const onOpen = useModal((state) => state.onOpen);

  const headingTitle = executor
    ? `${t("executor.single", { ns: "constants" })} ${executor.name} ${
        executor.nickname ? `(${executor.nickname})` : ""
      }`
    : `${t("actions.add", {
        instance: t("executor.single", { ns: "constants" }),
      })}`;

  const handleDelete = () => {
    onOpen("deleteExecutor", { executor: executor || undefined });
  };
  const handlePublished = (isPublished: boolean) => {
    // onOpen("deleteActor", { actor: actor });
    updateExecutorRequest(
      {
        name: executor?.name as string,
        imgUrl: executor?.imgUrl,
        description: executor?.description,
        isPublished,
      },
      executor?.id as string
    )
      .then((response) => response.json())
      .then(async (data) => {
        // console.log("api success");
        data.isPublished
          ? toast.success(
              t("messages.published", {
                ns: "constants",
                instance: t("executor.single", { ns: "constants" }),
              })
            )
          : toast.success(
              t("messages.unpublished", {
                ns: "constants",
                instance: t("executor.single", { ns: "constants" }),
              })
            );

        updateExecutor(data);
        router.refresh();
      })
      .catch((error) => toast.error("something went wrong"));
  };

  useEffect(() => {
    setFestivals(festivals);
  }, [festivals]);

  useEffect(() => {
    executor && updateExecutor(executor);
  }, [executor]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {executor && (
          <>
            <Link href={`/${locale}/executors/${executor.id}`}>
              <Heading title={headingTitle} />
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleDelete}>
                    <Trash className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")} />
                    <span className="hidden md:block">
                      {t("actions.delete", {
                        ns: "common",
                        instance: t("executor.single", { ns: "constants" }),
                      })}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="md:hidden flex">
                  <span>
                    {t("actions.delete", {
                      ns: "common",
                      instance: t("executor.single", { ns: "constants" }),
                    })}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>

      <Separator />
      <ExecutorForm initialData={executor} />
      {executor && (
        <>
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <ExecutorInPlayControl
            executorInPlayList={executor.plays}
            type="play"
          />
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <PermissionBox
            handleDelete={handleDelete}
            type={"executor"}
            isPublished={executor.isPublished}
            handleIsPublished={handlePublished}
          />
        </>
      )}
    </div>
  );
};

export default ExecutorClient;

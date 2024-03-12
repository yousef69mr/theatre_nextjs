"use client";
import { FC } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExecutorInPlayType } from "@/types";
import { useModal } from "@/hooks/stores/use-modal-store";
import {
  AlertOctagon,
  Edit,
  PartyPopper,
  Speech,
  Theater,
  Trash,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
interface ExecutorInPlayCardProps {
  executorInPlay: ExecutorInPlayType;
  mode?: "search" | "default";
}

const ExecutorInPlayCard: FC<ExecutorInPlayCardProps> = (props) => {
  const { executorInPlay, mode = "default" } = props;
  const onOpen = useModal((state) => state.onOpen);

  const params = useParams();
  const { t } = useTranslation();

  const locale = params.locale;

  const festivalId = params.festivalId as string;
  const executorId = params.executorId as string;
  const playId = params.playId as string;

  const handleDelete = () => {
    onOpen("deleteExecutorPlayLink", { executorInPlay: executorInPlay });
  };

  // console.log(executorInPlay);

  if (mode === "search") {
    return (
      <div className="flex justify-between items-center w-full ">
        <div className="flex w-full py-2 gap-y-2 flex-col justify-center">
          {!playId && (
            <Link
              href={`/${locale}/admin/plays/${executorInPlay.play?.id}`}
              className="hover:text-yellow-400"
            >
              <div className="flex items-center justify-start">
                <Theater className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />

                <span className="truncate font-medium">
                  {executorInPlay.play?.name}
                </span>
              </div>
            </Link>
          )}
          {!executorId && (
            <Link
              href={`/${locale}/admin/executors/${executorInPlay.executor?.id}`}
              className="hover:text-yellow-400"
            >
              <div className="flex items-center justify-start">
                <Speech className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
                <span className="truncate font-medium ">
                  {executorInPlay.executor?.name}{" "}
                  {executorInPlay.executor?.nickname
                    ? `(${executorInPlay.executor?.nickname})`
                    : ""}
                </span>{" "}
                <span className="mx-1">
                  {`(${t(`ExecutorRole.${executorInPlay.role}`, {
                    ns: "common",
                  })})`}
                </span>
              </div>
            </Link>
          )}

          {!festivalId && (
            <div className="flex items-center justify-start">
              <PartyPopper className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
              <span className="truncate font-medium">
                {executorInPlay.festival?.name}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() =>
                    onOpen("linkExecutorPlay", {
                      executorInPlay: executorInPlay,
                    })
                  }
                  size={"icon"}
                  variant="ghost"
                  className="capitalize"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t("actions.edit", {
                    instance: t(`relation.single`, { ns: "constants" }),
                    ns: "common",
                  })}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDelete}
                  variant="ghost"
                  className="capitalize text-destructive dark:text-red-500"
                  size={"icon"}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t("actions.delete", {
                    instance: t(`relation.single`, { ns: "constants" }),
                    ns: "common",
                  })}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  }
  return (
    <div className="border p-5 space-y-2 w-full md:max-w-72">
      <div className="flex items-center justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  onOpen("linkExecutorPlay", { executorInPlay: executorInPlay })
                }
                size={"icon"}
                variant="ghost"
                className="capitalize"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {t("actions.edit", {
                  instance: t(`relation.single`, { ns: "constants" }),
                  ns: "common",
                })}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleDelete}
                variant="ghost"
                className="capitalize text-destructive dark:text-red-500"
                size={"icon"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {t("actions.delete", {
                  instance: t(`relation.single`, { ns: "constants" }),
                  ns: "common",
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator className="mb-2" />
      <div className="flex w-full gap-y-2 py-2 flex-col justify-center">
        {!playId && (
          <div className="flex items-center justify-start">
            <Theater className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
            <Link href={`/${locale}/admin/plays/${executorInPlay.play?.id}`}>
              <span className="truncate font-medium">
                {executorInPlay.play?.name}
              </span>
            </Link>
          </div>
        )}
        {!executorId && (
          <Link
            href={`/${locale}/admin/executors/${executorInPlay.executor?.id}`}
            className="hover:text-yellow-400"
          >
            <div className="flex items-center justify-start">
              <Speech className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
              <span className="truncate font-medium ">
                {executorInPlay.executor?.name}{" "}
                {executorInPlay.executor?.nickname
                  ? `(${executorInPlay.executor?.nickname})`
                  : ""}
              </span>
            </div>
          </Link>
        )}
        <div className="flex items-center justify-start">
          <AlertOctagon className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
          <div className="flex rtl:flex-row-reverse gap-x-1  truncate font-medium capitalize">
            <span>
              {t(`ExecutorRole.${executorInPlay.role}`, { ns: "common" })}{" "}
            </span>
            <span> {t(`role.single`, { ns: "constants" })}</span>
          </div>
        </div>
        {!festivalId && (
          <div className="flex items-center justify-start">
            <PartyPopper className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
            <span className="truncate font-medium">
              {executorInPlay.festival?.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutorInPlayCard;

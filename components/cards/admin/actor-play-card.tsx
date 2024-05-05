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
import { ActorInPlayType } from "@/types";
import { useModal } from "@/hooks/stores/use-modal-store";
import { Bot, Drama, Edit, PartyPopper, Theater, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { removeArrayDuplicates } from "@/lib/helpers/list-fomratters";
import { Badge } from "@/components/ui/badge";
interface ActorInPlayCardProps {
  actorInPlay: ActorInPlayType;
  mode?: "search" | "default";
}

const ActorInPlayCard: FC<ActorInPlayCardProps> = (props) => {
  const { actorInPlay, mode = "default" } = props;
  const onOpen = useModal((state) => state.onOpen);

  const params = useParams();
  const { t } = useTranslation();

  const locale = params.locale;

  const festivalId = params.festivalId as string;
  const actorId = params.actorId as string;
  const playId = params.playId as string;

  const handleDelete = () => {
    onOpen("deleteActorPlayLink", { actorInPlay: actorInPlay });
  };

  // console.log(actorInPlay);

  if (mode === "search") {
    return (
      <div className="flex justify-between items-center w-full ">
        <div className="flex w-full py-2 gap-y-2 flex-col justify-center">
          {!playId && (
            <Link
              href={`/${locale}/admin/plays/${actorInPlay.play?.id}`}
              className="hover:text-yellow-400"
            >
              <div className="flex items-center justify-start">
                <Theater className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
                <span className="truncate font-medium">
                  {actorInPlay.play?.name}
                </span>
              </div>
            </Link>
          )}
          {!actorId && (
            <Link
              href={`/${locale}/admin/actors/${actorInPlay.actor?.id}`}
              className="hover:text-yellow-400"
            >
              <div className="flex items-center justify-start">
                <Drama className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
                <span className="truncate font-medium ">
                  {actorInPlay.actor?.name}{" "}
                  {actorInPlay.actor?.nickname
                    ? `(${actorInPlay.actor?.nickname})`
                    : ""}
                </span>
              </div>
            </Link>
          )}
          {!festivalId && (
            <div className="flex items-center justify-start">
              <PartyPopper className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
              <span className="truncate font-medium">
                {actorInPlay.festival?.name}
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
                    onOpen("linkActorPlay", { actorInPlay: actorInPlay })
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
                  onOpen("linkActorPlay", { actorInPlay: actorInPlay })
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
          <Link
            href={`/${locale}/admin/plays/${actorInPlay.play?.id}`}
            className="hover:text-yellow-400"
          >
            <div className="flex items-center justify-start">
              <Theater className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />

              <span className="truncate font-medium">
                {actorInPlay.play?.name}
              </span>
            </div>
          </Link>
        )}
        {!actorId && (
          <Link
            href={`/${locale}/admin/actors/${actorInPlay.actor?.id}`}
            className="hover:text-yellow-400"
          >
            <div className="flex items-center justify-start">
              <Drama className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
              <span className="truncate font-medium ">
                {actorInPlay.actor?.name}{" "}
                {actorInPlay.actor?.nickname
                  ? `(${actorInPlay.actor?.nickname})`
                  : ""}
              </span>
            </div>
          </Link>
        )}
        {!festivalId && (
          <div className="flex items-center justify-start">
            <PartyPopper className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
            <span className="truncate font-medium">
              {actorInPlay.festival?.name}
            </span>
          </div>
        )}
        {actorInPlay.characterNames &&
          actorInPlay.characterNames.length !== 0 && (
            <div className="flex items-center justify-start w-full gap-2">
              {removeArrayDuplicates(actorInPlay.characterNames).map(
                (characterName, index) => (
                  <Badge key={index} variant={"outline"} className="px-4 py-2">
                    {characterName}
                  </Badge>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default ActorInPlayCard;

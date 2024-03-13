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
import { PlayFestivalType } from "@/types";
import { useModal } from "@/hooks/stores/use-modal-store";
import { Award, Edit, PartyPopper, Theater, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface FestivalPlayCardProps {
  festivalPlay: PlayFestivalType;
  mode?: "search" | "default";
}

const FestivalPlayCard: FC<FestivalPlayCardProps> = (props) => {
  const { festivalPlay, mode = "default" } = props;
  const onOpen = useModal((state) => state.onOpen);

  const params = useParams();
  const { t } = useTranslation();

  const locale = params.locale;

  const festivalId = params.festivalId as string;
  const playId = params.playId as string;

  const handleDelete = () => {
    onOpen("deleteFestivalPlayLink", { festivalPlay: festivalPlay });
  };

  if (mode === "search") {
    return (
      <div className="flex justify-between items-center w-full ">
        <div className="flex w-full py-2 gap-y-2 flex-col justify-center">
          {!playId && (
            <Link
              href={`/${locale}/admin/plays/${festivalPlay.play?.id}`}
              className="hover:text-yellow-400"
            >
              <div className="flex items-center justify-start">
                <Theater className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
                <span className="truncate font-medium">
                  {festivalPlay.play?.name}
                </span>
              </div>
            </Link>
          )}

          {!festivalId && (
            <div className="flex items-center justify-start">
              <PartyPopper className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
              <span className="truncate font-medium">
                {festivalPlay.festival?.name}
              </span>
            </div>
          )}
          {festivalPlay.showTimes.length > 0 && (
            <>
              {/* <Separator className="bg-red-100 dark:bg-red-700/15 my-1" /> */}
              <div className="flex gap-2 mt-2 items-center justify-start">
                {festivalPlay.showTimes.map((showtime, index) => (
                  <Badge key={index} variant={"outline"}>
                    {format(showtime, "MMMM do, yyyy")}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() =>
                    onOpen("linkFestivalPlay", { festivalPlay: festivalPlay })
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
      <TooltipProvider>
        <div className="flex items-center justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  onOpen("linkFestivalPlay", { festivalPlay: festivalPlay })
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
        </div>
        <Separator className="mb-2" />
        <div className="flex w-full gap-y-2 py-2 flex-col justify-center">
          {!playId && (
            <Link href={`/${locale}/admin/plays/${festivalPlay.play.id}`}>
              <div className="flex items-center justify-start">
                <Theater className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
                <span className="truncate font-medium">
                  {festivalPlay.play.name}
                </span>
              </div>
            </Link>
          )}

          {!festivalId && (
            <div className="flex items-center justify-start">
              <PartyPopper className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
              <span className="truncate font-medium">
                {festivalPlay.festival.name}
              </span>
            </div>
          )}
          {festivalPlay.position && (
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-start">
                  <Award className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-orange-300" />
                  <span className="truncate font-medium">
                    {festivalPlay.position}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  {t(`places.${festivalPlay.position}.single`, {
                    ns: "constants",
                  })}
                  <span className="mx-1">
                    {t(`compition-place.single`, { ns: "constants" })}
                  </span>
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          {festivalPlay.showTimes.length > 0 && (
            <>
              {/* <Separator className="bg-red-100 dark:bg-red-700/15 my-1" /> */}
              <div className="flex gap-2 mt-2 items-center justify-start">
                {festivalPlay.showTimes.map((showtime, index) => (
                  <Badge key={index} variant={"outline"}>
                    {format(showtime, "MMMM do, yyyy")}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default FestivalPlayCard;

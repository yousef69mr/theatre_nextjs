"use client";

import ActorInPlayCard from "@/components/cards/admin/actor-play-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModal } from "@/hooks/stores/use-modal-store";
import { cn } from "@/lib/utils";
import { PlayFestivalType } from "@/types";
import { PlusCircle } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import FestivalPlayCard from "@/components/cards/admin/festival-play-card";
interface FestivalPlayControlProps {
  festivalPlayList: PlayFestivalType[];
  type: "festival" | "play";
}
const FestivalPlayControl: FC<FestivalPlayControlProps> = (props) => {
  const { festivalPlayList, type } = props;
  const { t } = useTranslation();
  const onOpen = useModal((state) => state.onOpen);
  //   console.log(actorInPlayList);
  return (
    <div className="mt-6 border rounded-md p-4 space-y-2">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center justify-center">
          <span className="capitalize">
            {t(`${type}.plural`, { ns: "constants" })}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onOpen("linkFestivalPlay")}
                  variant="ghost"
                  className="capitalize"
                >
                  <PlusCircle className="h-5 w-5 text-emerald-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {t("actions.add", {
                    instance: t(`${type}.single`, { ns: "constants" }),
                    ns: "common",
                  })}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Separator />
      <div
        className={cn(
          "flex items-center justify-center",
          festivalPlayList.length > 0 && "justify-start flex-wrap gap-3 py-1"
        )}
      >
        {festivalPlayList.length > 0 ? (
          festivalPlayList.map((festivalPlay) => (
            <FestivalPlayCard
              key={festivalPlay.id}
              festivalPlay={festivalPlay}
            />
          ))
        ) : (
          <p className="text-muted-foreground">
            {t("notFound", {
              ns: "constants",
              instance: t(`${type}.plural`, { ns: "constants" }),
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default FestivalPlayControl;

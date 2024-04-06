"use client";

import { FC, HTMLAttributes } from "react";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBigInt } from "@/lib/helpers/bigInt-converter";
import { PlayType } from "@/types";
import { AudioLines, Eye, PartyPopper, Trophy } from "lucide-react";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isPlayLive } from "@/lib/helpers/play-validations";

interface PlayCardProps extends HTMLAttributes<HTMLElement> {
  play: PlayType;
  redirect?: "attend" | "default";
}
const PlayCard: FC<PlayCardProps> = (props) => {
  const { play, redirect = "default", className } = props;
  const { t } = useTranslation();
  const params = useParams();

  const locale = params.locale as string;

  const festivals = play.festivals.map((festivalLink) => ({
    // showTimes: festivalLink.showTimes,
    position: festivalLink.position,
    ...festivalLink.festival,
    ...festivalLink,
  }));
  const isLive = isPlayLive(festivals);

  const { value: numOfViews, unit } = formatBigInt(play.numOfViews || "0");

  const redirectUrl =
    redirect === "default"
      ? `/${locale}/plays/${play.id}`
      : `/${locale}/plays/${play.id}/book-tickets`;
  return (
    <DirectionAwareHover
      className={className}
      imageUrl={
        play.posterImgUrl ? play.posterImgUrl : "/play-poster-template.png"
      }
    >
      <TooltipProvider>
        <Link href={redirectUrl}>
          <div className="flex flex-col items-start justify-center px-2 space-y-2 w-full">
            <div className="flex items-center justify-start gap-x-2">
              <h3 className="text-sm md:text-md font-medium truncate">
                {play.name}
              </h3>
              {isLive && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AudioLines className="w-5 h-5 text-emerald-500 animate-pulse" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      {t("messages.live", {
                        ns: "constants",
                        instance: t("play.single", { ns: "constants" }),
                      })}
                    </span>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-medium">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center justify-center">
                    <Eye className="rtl:ml-2 ltr:mr-2 w-4 h-4" /> {numOfViews}
                    {unit && t(`units.${unit}.symbol`, { ns: "constants" })}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {!unit ? (
                    <>
                      {numOfViews}{" "}
                      {Number(numOfViews) > 1 && Number(numOfViews) <= 10
                        ? t(`view.plural`, { ns: "constants" })
                        : t(`view.single`, { ns: "constants" })}
                    </>
                  ) : (
                    <>
                      {numOfViews}{" "}
                      {Number(numOfViews) > 1
                        ? t(`units.${unit}.plural`, { ns: "constants" })
                        : t(`units.${unit}.single`, { ns: "constants" })}{" "}
                      {Number(numOfViews) > 1 && Number(numOfViews) <= 10
                        ? t(`view.plural`, { ns: "constants" })
                        : t(`view.single`, { ns: "constants" })}
                    </>
                  )}
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center justify-center">
                <Trophy className="rtl:ml-2 ltr:mr-2 w-4 h-4" />
                {play.awards.length}
              </div>
              {festivals && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center justify-center">
                      <PartyPopper className="rtl:ml-2 ltr:mr-2 w-4 h-4" />{" "}
                      {festivals?.length}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-col items-center justify-center gap-2">
                      {festivals?.map((festival) => (
                        <div key={festival.id}>{festival.festival.name}</div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </Link>
      </TooltipProvider>
    </DirectionAwareHover>
  );
};

export default PlayCard;

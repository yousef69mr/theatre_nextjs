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
import { ExecutorType } from "@/types";
import { Eye, Trophy } from "lucide-react";

import { useTranslation } from "react-i18next";

interface ExecutorCardProps extends HTMLAttributes<HTMLElement> {
  executor: ExecutorType;
}
const ExecutorCard: FC<ExecutorCardProps> = (props) => {
  const { executor, className } = props;
  const { t } = useTranslation();

  const { value: numOfViews, unit } = formatBigInt(executor.numOfViews);
  return (
    <DirectionAwareHover
      className={className}
      imageUrl={executor.imgUrl ? executor.imgUrl : "/default-profile.png"}
    >
      <div className="flex flex-col items-start justify-center px-2 space-y-2 w-full">
        <h3 className="text-md md:text-xl font-medium truncate">
          {executor.name} {executor.nickname ? `(${executor.nickname})` : ""}
        </h3>
        <div className="flex flex-wrap gap-3 text-xs font-medium">
          <TooltipProvider>
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
          </TooltipProvider>
          <div className="flex items-center justify-center">
            <Trophy className="rtl:ml-2 ltr:mr-2 w-4 h-4" />
            {executor.awards.length}
          </div>
        </div>
      </div>
    </DirectionAwareHover>
  );
};

export default ExecutorCard;

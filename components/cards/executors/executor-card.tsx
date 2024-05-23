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
import { ExecutorCardType, ExecutorType } from "@/types";
import { Eye, PartyPopper, Trophy } from "lucide-react";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExecutorRole } from "@prisma/client";
import { removeArrayDuplicates } from "@/lib/helpers/list-fomratters";

interface ExecutorCardProps extends HTMLAttributes<HTMLElement> {
  executor: ExecutorCardType;
  // role?: ExecutorRole;
}
const ExecutorCard: FC<ExecutorCardProps> = (props) => {
  const { executor, className } = props;
  const { t } = useTranslation();
  const params = useParams();

  const locale = params.locale as string;

  const { value: numOfViews, unit } = formatBigInt(executor.numOfViews || "0");
  // console.log(executor);
  return (
    <TooltipProvider>
      <Link href={`/${locale}/executors/${executor.id}`}>
        <DirectionAwareHover
          className={className}
          imageUrl={executor.imgUrl ? executor.imgUrl : "/default-profile.png"}
        >
          <div className="flex flex-col items-start justify-center px-2 space-y-1 w-full">
            <h3 className="text-sm md:!text-lg font-medium truncate">
              {executor.name}{" "}
              {executor.nickname ? `(${executor.nickname})` : ""}
            </h3>
            {executor?.roles && executor?.roles.length !== 0 && (
              <p className="text-md capitalize font-bold text-red-500 flex flex-wrap items-center gap-1">
                {removeArrayDuplicates(executor.roles).map((role) => (
                  <span key={role}>
                    {t(`ExecutorRole.${role}`, { ns: "common" })}
                  </span>
                ))}
              </p>
            )}
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
                {executor.awards.length}
              </div>
              {executor.festivals && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center justify-center">
                      <PartyPopper className="rtl:ml-2 ltr:mr-2 w-4 h-4" />{" "}
                      {executor.festivals?.length}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent align="center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      {executor.festivals?.map((festival) => (
                        <div key={festival.id}>{festival.festival.name}</div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </DirectionAwareHover>
      </Link>
    </TooltipProvider>
  );
};

export default ExecutorCard;

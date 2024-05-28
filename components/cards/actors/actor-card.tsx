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
import { ActorCardType } from "@/types";
import { Eye, PartyPopper, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { removeArrayDuplicates } from "@/lib/helpers/list-fomratters";
import { Badge } from "@/components/ui/badge";
import { FacultyCast } from "@prisma/client";
// import { Button } from "@/components/ui/button";
// import { isAdmin } from "@/lib/auth";
// import { useCurrentRole } from "@/hooks/use-current-role";
// import { UserRole } from "@prisma/client";
interface ActorCardProps extends HTMLAttributes<HTMLElement> {
  actor: ActorCardType;
}

const ActorCard: FC<ActorCardProps> = (props) => {
  const { actor, className } = props;
  const { t } = useTranslation();
  const params = useParams();
  // const router = useRouter();
  // const role = useCurrentRole();

  const locale = params.locale as string;

  // const handleEdit = () => {
  //   router.push(`/${locale}/admin/actors/${actor.id}`);
  // };

  const { value: numOfViews, unit } = formatBigInt(actor.numOfViews || "0");

  const imgUrl =
    actor.images?.length > 0
      ? actor.images[0]
      : actor.imgUrl ?? "/default-profile.png";

  return (
    <TooltipProvider>
      <Link href={`/${locale}/actors/${actor.id}`}>
        <DirectionAwareHover className={className} imageUrl={imgUrl}>
          <div className="flex flex-col items-start justify-center px-2 space-y-2 w-full">
            <h3 className="text-sm md:!text-xl font-medium truncate">
              {actor.name} {actor.nickname ? `(${actor.nickname})` : ""}
            </h3>
            {actor.characterNames && (
              <p className="text-sm md:!text-lg capitalize font-bold text-muted-foreground">
                {removeArrayDuplicates(actor.characterNames).join(", ")}
              </p>
            )}
            {![FacultyCast.OTHER, FacultyCast.COMPUTERS].includes(
              actor.facultyCast as any
            ) && (
              // <div className="flex item-center justify-start gap-2">
              <div className="flex items-center justify-center rtl:flex-row-reverse gap-x-1 text-red-500 font-medium">
                <span>
                  {t(`FacultyCast.${actor.facultyCast}`, { ns: "common" })}
                </span>
                <span>{t(`cast.single`, { ns: "constants" })}</span>
              </div>
              // </div>
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
                {actor.awards.length}
              </div>
              {actor.festivals && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center justify-center">
                      <PartyPopper className="rtl:ml-2 ltr:mr-2 w-4 h-4" />{" "}
                      {actor.festivals?.length}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent align="center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      {actor.festivals?.map((festival) => (
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

export default ActorCard;

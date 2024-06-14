"use client";
import { FC } from "react";
import { useTranslation } from "react-i18next";
// import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CastMemberType } from "@/types";
import { useModal } from "@/hooks/stores/use-modal-store";
import { AlertOctagon, Edit, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CastMemberCardProps {
  castMember: CastMemberType;
  mode?: "search" | "default";
}

const CastMemberCard: FC<CastMemberCardProps> = (props) => {
  const { castMember, mode = "default" } = props;
  const onOpen = useModal((state) => state.onOpen);

  // const params = useParams();
  const { t } = useTranslation();

  // const locale = params.locale;

  const handleDelete = () => {
    onOpen("deleteCastMember", { castMember: castMember });
  };

  const intervals = castMember.timeIntervals;

  // console.log(castMember);
  if (mode === "search") {
    return (
      <div className="flex justify-between items-center w-full ">
        <div className="flex w-full py-2 gap-y-2 flex-col justify-center">
          <div className="flex items-center justify-start">
            <AlertOctagon className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
            <div className="flex rtl:flex-row-reverse gap-x-1 truncate font-medium capitalize">
              <span>{t(`UserRole.${castMember.role}`, { ns: "common" })} </span>
              <span> {t(`role.single`, { ns: "constants" })}</span>
            </div>
          </div>

          {intervals.length > 0 && (
            <div className="flex gap-2 mt-2 items-center justify-center flex-col">
              {intervals.map((interval, index) => (
                <Badge variant={"outline"} className="px-2" key={index}>
                  <div className="flex gap-x-2 items-center justify-between">
                    {format(interval.startDate, "MMMM do, yyyy")}
                    <Separator className="mx-2 w-5" />
                    {interval.endDate
                      ? format(interval.endDate, "MMMM do, yyyy")
                      : t("present", { ns: "constants" })}
                  </div>
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onOpen("linkCastMember", { castMember })}
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
                onClick={() => onOpen("linkCastMember", { castMember })}
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
        <div className="flex items-center justify-start">
          <AlertOctagon className="w-5 h-5 ltr:mr-2 rtl:ml-2 text-primary" />
          <div className="flex rtl:flex-row-reverse gap-x-1  truncate font-medium capitalize">
            <span>{t(`UserRole.${castMember.role}`, { ns: "common" })} </span>
            <span> {t(`role.single`, { ns: "constants" })}</span>
          </div>
        </div>

        {/* <Separator className="bg-red-100 dark:bg-red-700/15 my-1" /> */}
        {intervals.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 flex-wrap items-start justify-center">
            {intervals.map((interval, index) => (
              <Badge variant={"outline"} className="px-2" key={index}>
                <div className="flex gap-x-2 items-center justify-between">
                  {format(interval.startDate, "MMMM do, yyyy")}
                  <Separator className="mx-2 w-5" />
                  {interval.endDate
                    ? format(interval.endDate, "MMMM do, yyyy")
                    : t("present", { ns: "constants" })}
                </div>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CastMemberCard;

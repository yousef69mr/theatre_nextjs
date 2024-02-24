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
import { Drama, Edit, PartyPopper, Theater, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
interface FestivalPlayCardProps {
  festivalPlay: PlayFestivalType;
}

const FestivalPlayCard: FC<FestivalPlayCardProps> = (props) => {
  const { festivalPlay } = props;
  const onOpen = useModal((state) => state.onOpen);

  const params = useParams();
  const { t } = useTranslation();

  const locale = params.locale;

  const festivalId = params.festivalId as string;
  const playId = params.playId as string;

  const handleDelete = () => {
    onOpen("deleteFestivalPlayLink", { festivalPlay: festivalPlay });
  };

  return (
    <div className="border p-5 space-y-2 w-full md:max-w-72">
      <div className="flex items-center justify-start">
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
      </div>
    </div>
  );
};

export default FestivalPlayCard;

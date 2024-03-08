"use client";
import { Locale } from "@/next-i18next.config";
import { FC, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { ActorType, ExecutorType, FestivalType, PlayType } from "@/types";
import { cn } from "@/lib/utils";
// import linkLocaleWrapper from "@/lib/link-locale-wrapper";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/helpers/heading";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useModal } from "@/hooks/stores/use-modal-store";
import { usePlayStore } from "@/hooks/stores/use-play-store";

import { useCurrentRole } from "@/hooks/use-current-role";
import { isAdmin } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBreakpoint } from "@/hooks/use-break-point";

interface PlayClientProps {
  play: PlayType;
}
const PlayClient: FC<PlayClientProps> = (props) => {
  const { play } = props;
  const role = useCurrentRole();
  const { t } = useTranslation();
  const { isBelowMd, isAboveMd } = useBreakpoint("md");
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updatePlay = usePlayStore((state) => state.updatePlay);
  const updatePlay = usePlayStore((state) => state.updatePlay);

  const handleDelete = () => {
    onOpen("deletePlay", { play: play || undefined });
  };

  const handleEdit = () => {
    router.push(`/${locale}/admin/plays/${play.id}`);
  };

  useEffect(() => {
    updatePlay(play);
  }, [play]);

  return (
    <>
      {/* <div className="flex items-center justify-between">
        {isAdmin(role as UserRole) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleEdit}>
                  <Pencil className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")} />
                  <span className="hidden md:block">
                    {t("actions.edit", {
                      ns: "common",
                      instance: t("play.single", { ns: "constants" }),
                    })}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden flex">
                <span>
                  {t("actions.edit", {
                    ns: "common",
                    instance: t("play.single", { ns: "constants" }),
                  })}
                </span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleDelete}>
                  <Trash className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")} />
                  <span className="hidden md:block">
                    {t("actions.delete", {
                      ns: "common",
                      instance: t("play.single", { ns: "constants" }),
                    })}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="md:hidden flex">
                <span>
                  {t("actions.delete", {
                    ns: "common",
                    instance: t("play.single", { ns: "constants" }),
                  })}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Separator /> */}
      <div
        className={cn(
          "w-full flex flex-row flex-wrap items-start justify-between gap-6 relative"
          // isBelowMd && "!flex-col"
        )}
      >
        <div
          className={cn(
            "w-full min-h-80 sm:max-w-56 md:max-w-64 lg:max-w-80 flex items-center justify-center  md:top-28 md:sticky"
          )}
        >
          {/* <AspectRatio ratio={9 / 16}> */}
          <Image
            src={play.posterImgUrl}
            fill
            className="object-contain rounded-lg !relative"
            alt={`${play.name} ${t("poster.single", { ns: "constants" })}`}
          />
          {/* </AspectRatio> */}
        </div>
        <div className="w-full sm:flex-1 sm:h-full flex flex-col items-start justify-center">
          <div className="w-full flex flex-wrap items-center justify-between">
            <h1 className="text-2xl font-semibold capitalize">{play.name}</h1>
            {isAdmin(role as UserRole) && (
              <div className="flex items-center gap-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant={"outline"} onClick={handleEdit}>
                        <Pencil className={"h-4 w-4"} />
                        {/* <span className="hidden md:block">
                          {t("actions.edit", {
                            ns: "common",
                            instance: t("play.single", { ns: "constants" }),
                          })}
                        </span> */}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        {t("actions.edit", {
                          ns: "common",
                          instance: t("play.single", { ns: "constants" }),
                        })}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleDelete}>
                        <Trash className={"h-4 w-4"} />
                        {/* <span className="hidden md:block">
                          {t("actions.delete", {
                            ns: "common",
                            instance: t("play.single", { ns: "constants" }),
                          })}
                        </span> */}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        {t("actions.delete", {
                          ns: "common",
                          instance: t("play.single", { ns: "constants" }),
                        })}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                {t("actions.show", {
                  ns: "common",
                  instance: t("story.single", { ns: "constants" }),
                })}
              </AccordionTrigger>
              <AccordionContent>
                {play.description
                  ? play.description
                  : t("errors.notProvided", {
                      ns: "constants",
                      instance: t("story.single", { ns: "constants" }),
                    })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default PlayClient;

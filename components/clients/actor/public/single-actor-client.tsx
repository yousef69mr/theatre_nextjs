"use client";

import { Locale } from "@/next-i18next.config";
import { FC, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AudioLines,
  Award,
  Eye,
  // CalendarDays,
  Pencil,
  Ticket,
  Trash,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { ActorType } from "@/types";
import { cn } from "@/lib/utils";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useModal } from "@/hooks/stores/use-modal-store";
import { useActorStore } from "@/hooks/stores/use-actor-store";

import { useCurrentRole } from "@/hooks/use-current-role";
import { isAdmin } from "@/lib/auth";
import { ExecutorRole, UserRole } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import PlayCarousel from "@/components/carousels/play-carousel";
import { removeActorPlayDuplicates } from "@/lib/helpers/list-fomratters";
import { useCurrentUser } from "@/hooks/use-current-user";
import toast from "react-hot-toast";
import { formatBigInt } from "@/lib/helpers/bigInt-converter";

// import {
//   removeActorActorDuplicates,
//   removeActorExecutorDuplicates,
// } from "@/lib/helpers/list-fomratters";

interface ActorClientProps {
  actor: ActorType;
}

const ActorClient: FC<ActorClientProps> = (props) => {
  const { actor } = props;
  const loggedUser = useCurrentUser();
  const { t } = useTranslation();
  // const { isBelowMd, isAboveMd } = useBreakpoint("md");
  // console.log(loggedUser);
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updateActor = useActorStore((state) => state.updateActor);
  const updateActor = useActorStore((state) => state.updateActor);

  const handleDelete = () => {
    onOpen("deleteActor", { actor });
  };

  const handleEdit = () => {
    if (loggedUser?.role === UserRole.ADMIN) {
      router.push(`/${locale}/admin/actors/${actor.id}`);
    } else if (isMyActorProfile) {
      onOpen("editActor", { actor });
    } else {
      toast.error(t("errors.codes.401", { ns: "constants" }));
    }
  };

  const plays = removeActorPlayDuplicates(actor);

  const isMyActorProfile = actor.id === loggedUser?.actorId;
  // console.log(isMyActorProfile);
  const isAdminUser = isAdmin(loggedUser?.role as UserRole);

  useEffect(() => {
    updateActor(actor);
  }, [actor]);

  useEffect(() => {
    isAdminUser && router.prefetch(`/${locale}/admin/actors/${actor.id}`);
  }, [router, isAdminUser]);

  const { value: numOfViews, unit } = formatBigInt(actor.numOfViews || "0");

  return (
    <div className="md:px-10">
      <div
        className={cn(
          "w-full flex flex-row flex-wrap items-start justify-between gap-6 relative"
          // isBelowMd && "!flex-col"
        )}
      >
        <div
          className={cn(
            "w-full min-h-80 sm:max-w-56 md:max-w-64 lg:max-w-80 flex items-center justify-center relative"
          )}
        >
          {/* <AspectRatio ratio={9 / 16}> */}
          <Image
            src={actor.imgUrl ? actor.imgUrl : "/actor-poster-template.png"}
            fill
            sizes="32x32 64x64 128x128"
            className="object-contain rounded-lg !relative"
            alt={`${actor.name} ${t("poster.single", { ns: "constants" })}`}
          />
          {/* </AspectRatio> */}
        </div>
        <TooltipProvider>
          <div className="w-full relative space-y-4 sm:flex-1 sm:h-full flex flex-col items-start justify-center">
            <div className="w-full flex flex-wrap items-center justify-between">
              <div className="flex gap-x-2 items-center">
                <h1 className="text-2xl font-semibold capitalize">
                  {actor.name} {actor.nickname ? `(${actor.nickname})` : ""}
                </h1>
              </div>

              {(isAdminUser || isMyActorProfile) && (
                <div className="flex items-center gap-x-2">
                  {(isAdminUser || isMyActorProfile) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant={"outline"} onClick={handleEdit}>
                          <Pencil className={"h-4 w-4"} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>
                          {t("actions.edit", {
                            ns: "common",
                            instance: t("actor.single", { ns: "constants" }),
                          })}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {isAdminUser && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleDelete}>
                          <Trash className={"h-4 w-4"} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>
                          {t("actions.delete", {
                            ns: "common",
                            instance: t("actor.single", { ns: "constants" }),
                          })}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>

            <div className="flex item-center justify-start gap-2">
              <Badge
                variant={"secondary"}
                className="flex items-center justify-center rtl:flex-row-reverse gap-x-1 px-3 py-2"
              >
                <span>
                  {t(`FacultyCast.${actor.facultyCast}`, { ns: "common" })}
                </span>
                <span>{t(`cast.single`, { ns: "constants" })}</span>
              </Badge>
            </div>

            <div className="flex item-center justify-start gap-2">
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
            </div>
            {/* {festivals.filter((festivalLink) => festivalLink.position).length >
              0 && (
              <div className="flex flex-wrap items-center justify-start gap-2">
                {festivals.map((festival) => (
                  <>
                    {festival.position && (
                      <div
                        key={festival.id}
                        className="flex items-center flex-nowrap gap-x-2 text-wrap"
                      >
                        <Award className="w-5 h-5 text-orange-300 ltr:mr-2 rtl:ml-2" />
                        <div className="flex gap-x-2 items-center justify-center rtl:flex-row ltr:flex-row-reverse">
                          <span>
                            {t(`compition-place.single`, {
                              ns: "constants",
                            })}
                          </span>
                          <span className="text-primary font-semibold">
                            {t(`places.${festival.position}.single`, {
                              ns: "constants",
                            })}
                          </span>
                        </div>{" "}
                        <hr className="w-2 h-1 rounded-md dark:bg-red-100 bg-red-700/15" />
                        <span>{festival.name}</span>
                      </div>
                    )}
                  </>
                ))}
              </div>
            )} */}
            {/* {isLive && (
              <div className="flex gap-4 items-center justify-start my-1">
                {isLive && (
                  <Button
                    onClick={() => router.push(`${actor.id}/book-tickets`)}
                    size={"lg"}
                    variant="outline"
                    className="hover:text-orange-300 hover:border-orange-300"
                  >
                    <Ticket className="w-5 h-5 rtl:ml-2 ltr:mr-2 text-orange-300 transition-all animate-pulse" />
                    {t("actions.book", {
                      ns: "common",
                      instance: t("ticket.single", { ns: "constants" }),
                    })}
                  </Button>
                )}
              </div>
            )} */}
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {t("actions.show", {
                    ns: "common",
                    instance: t("description.single", { ns: "constants" }),
                  })}
                </AccordionTrigger>
                <AccordionContent>
                  {actor.description
                    ? actor.description
                    : t("errors.notProvided", {
                        ns: "constants",
                        instance: t("description.single", { ns: "constants" }),
                      })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TooltipProvider>
      </div>
      {plays.length > 0 && (
        <>
          <Separator className="bg-red-100 dark:bg-red-700/15  my-10" />
          <section className="space-y-3 w-full">
            <h3 className="font-bold text-2xl capitalize">
              {t("play.plural", { ns: "constants" })} ({plays.length})
            </h3>

            <PlayCarousel plays={plays} />
          </section>
        </>
      )}
    </div>
  );
};

export default ActorClient;

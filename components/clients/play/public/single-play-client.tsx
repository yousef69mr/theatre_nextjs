"use client";

import { Locale } from "@/next-i18next.config";
import { FC, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AudioLines,
  Award,
  // CalendarDays,
  Pencil,
  Ticket,
  Trash,
  Watch,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { PlayFestivalType, PlayType } from "@/types";
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
import { usePlayStore } from "@/hooks/stores/use-play-store";

import { useCurrentRole } from "@/hooks/use-current-role";
import { isAdmin, isMainPlayExecutors } from "@/lib/auth";
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
import ActorCarousel from "@/components/carousels/actor-carousel";
import ExecutorCarousel from "@/components/carousels/executor-carousel";
import { isPlayLive } from "@/lib/helpers/play-validations";
import {
  removeArrayDuplicates,
  removePlayActorDuplicates,
  removePlayExecutorDuplicates,
} from "@/lib/helpers/list-fomratters";

interface PlayClientProps {
  play: PlayType;
}

const PlayClient: FC<PlayClientProps> = (props) => {
  const { play } = props;
  const role = useCurrentRole();
  const { t } = useTranslation();
  // const { isBelowMd, isAboveMd } = useBreakpoint("md");
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updatePlay = usePlayStore((state) => state.updatePlay);
  const updatePlay = usePlayStore((state) => state.updatePlay);

  const handleDelete = () => {
    onOpen("deletePlay", { play });
  };

  const handleEdit = () => {
    router.push(`/${locale}/admin/plays/${play.id}`);
  };

  useEffect(() => {
    updatePlay(play);
  }, [play]);

  useEffect(() => {
    router.prefetch(`/${locale}/admin/plays/${play.id}`);
    router.prefetch(`${play.id}/book-tickets`);
    router.prefetch(`${play.id}/watch`);
  }, [router]);

  const executors = removePlayExecutorDuplicates(play);

  const festivals = play.festivals.map((festivalLink) => ({
    // showTimes: festivalLink.showTimes,
    position: festivalLink.position,
    ...festivalLink.festival,
    ...festivalLink,
  }));

  const actors = removePlayActorDuplicates(play);

  const isLive = isPlayLive(festivals);

  return (
    <div className="px-10">
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
            src={
              play.posterImgUrl
                ? play.posterImgUrl
                : "/play-poster-template.png"
            }
            fill
            className="object-contain rounded-lg !relative"
            alt={`${play.name} ${t("poster.single", { ns: "constants" })}`}
          />
          {/* </AspectRatio> */}
        </div>
        <TooltipProvider>
          <div className="w-full relative space-y-4 sm:flex-1 sm:h-full flex flex-col items-start justify-center">
            <div className="w-full flex flex-wrap items-center justify-between">
              <div className="flex gap-x-2 items-center">
                <h1 className="text-2xl font-semibold capitalize">
                  {play.name}
                </h1>
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
              {isAdmin(role as UserRole) && (
                <div className="flex items-center gap-x-2">
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
                          instance: t("play.single", { ns: "constants" }),
                        })}
                      </span>
                    </TooltipContent>
                  </Tooltip>
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
                          instance: t("play.single", { ns: "constants" }),
                        })}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {executors.map((executor) => {
                const roles = removeArrayDuplicates(executor.roles);
                // console.log(executor.roles)
                // console.log(roles)
                return (
                  <>
                    {roles.map((role) => (
                      <>
                        {isMainPlayExecutors(role as ExecutorRole) && (
                          <HoverCard key={executor.id}>
                            <HoverCardTrigger asChild>
                              <Link
                                href={`/${locale}/executors/${executor.id}`}
                              >
                                <Badge
                                  variant={"secondary"}
                                  className="flex items-center justify-between gap-x-2 px-3 py-2"
                                >
                                  <span className="capitalize">
                                    {t(`ExecutorRole.${role}`, {
                                      ns: "common",
                                    })}{" "}
                                    :
                                  </span>{" "}
                                  <span className="text-medium font-semibold ">
                                    {executor.name}
                                  </span>
                                </Badge>
                              </Link>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80" align="start">
                              <div className="flex justify-start gap-x-4 items-center space-x-4">
                                <Avatar>
                                  <AvatarImage
                                    src={executor.imgUrl}
                                    className="w-11 h-11 object-cover"
                                  />
                                  <AvatarFallback className="bg-primary text-xl">
                                    {executor.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                  <h4 className="text-sm font-semibold">
                                    {executor.name}{" "}
                                    {executor.nickname
                                      ? `(${executor.nickname})`
                                      : ""}
                                  </h4>
                                  {/* <p className="text-sm">
                                The React Framework – created and maintained by
                                @vercel.
                              </p> */}
                                  {/* <div className="flex items-center pt-2">
                                <CalendarDays className="ltr:mr-2 rtl:ml-2 h-4 w-4 opacity-70" />{" "}
                                <span className="text-xs text-muted-foreground">
                                  Joined December 2021
                                </span>
                              </div> */}
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </>
                    ))}
                  </>
                );
              })}
            </div>
            {festivals.filter((festivalLink) => festivalLink.position).length >
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
            )}
            {(isLive || play.videoUrl) && (
              <div className="flex gap-4 items-center justify-start my-1">
                {play.videoUrl && (
                  <Button
                    onClick={() => router.push(`${play.id}/watch`)}
                    size={"lg"}
                    variant="outline"
                    className="text-emerald-300 hover:text-emerald-300 hover:border-emerald-300"
                  >
                    <Watch className="w-5 h-5 rtl:ml-2 ltr:mr-2 text-emerald-300 transition-all animate-pulse" />
                    {t("actions.watch", {
                      ns: "common",
                      instance: t("play.single", { ns: "constants" }),
                    })}
                  </Button>
                )}
                {isLive && (
                  <Button
                    onClick={() => router.push(`${play.id}/book-tickets`)}
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
            )}
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
        </TooltipProvider>
      </div>
      {actors.length > 0 && (
        <>
          <Separator className="bg-red-100 dark:bg-red-700/15  my-10" />
          <section className="space-y-3 w-full">
            <h3 className="font-bold text-2xl capitalize">
              {t("actor.plural", { ns: "constants" })} ({actors.length})
            </h3>

            <ActorCarousel actors={actors} />
          </section>
        </>
      )}
      {executors.length > 0 && (
        <>
          <Separator className="bg-red-100 dark:bg-red-700/15 my-10" />
          <section className="space-y-3 w-full">
            <h3 className="font-bold text-2xl capitalize">
              {t("executor.plural", { ns: "constants" })} ({executors.length})
            </h3>

            <ExecutorCarousel executors={executors} />
          </section>
        </>
      )}
    </div>
  );
};

export default PlayClient;

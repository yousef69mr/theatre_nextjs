"use client";

import { Locale } from "@/next-i18next.config";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AudioLines,
  Award,
  BadgeAlert,
  Check,
  CheckSquare,
  Copy,
  Drama,
  Edit,
  HelpCircle,
  Link2,
  LucideTicket,
  MailIcon,
  MoreHorizontal,
  // CalendarDays,
  Pencil,
  PrinterIcon,
  Speech,
  Ticket,
  Trash,
  XSquare,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { UserType } from "@/types";
import { cn } from "@/lib/utils";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useModal } from "@/hooks/stores/use-modal-store";
// import { useUserStore } from "@/hooks/stores/use-user-store";

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
import toast from "react-hot-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import TicketCarousel from "@/components/carousels/ticket-carousel";
import TicketList from "@/components/cards/tickets/ticket-list";
// import { removeUserPlayDuplicates } from "@/lib/helpers/list-fomratters";

// import {
//   removeUserUserDuplicates,
//   removeUserExecutorDuplicates,
// } from "@/lib/helpers/list-fomratters";

interface UserClientProps {
  user: UserType;
}

const UserClient: FC<UserClientProps> = (props) => {
  const { user } = props;
  const activeUser = useCurrentUser();
  const { t } = useTranslation();
  const [isCopy, setIsCopy] = useState(false);

  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updateUser = useUserStore((state) => state.updateUser);
  const handleUserDelete = () => {
    onOpen("deleteUser", { user });
  };

  // useEffect(() => {
  //   updateUser(user);
  // }, [user]);

  // const plays = removeUserPlayDuplicates(user);

  const handleCopy = async () => {
    setIsCopy(true);

    await window.navigator.clipboard
      .writeText(user.id)
      .then(() => {
        console.log("copied");
      })
      .catch((err) => {
        console.error("Error in copying text", err);
        setIsCopy(false);
      });

    const timeoutId = setTimeout(() => setIsCopy(false), 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  };

  const isMyProfile = user.id === activeUser?.id;

  const executorProfile = user.executor?.executor;
  const actorProfile = user.actor?.actor;

  const handleUserExecutorLink = () => {
    onOpen("linkUserExecutor", {
      user,
    });
  };

  const handleUserActorLink = () => {
    onOpen("linkUserActor", {
      user,
    });
  };

  const handleExecutorLinkDelete = () => {
    onOpen("deleteUserExecutorLink", {
      userExecutorLink: user.executor ?? undefined,
    });
  };

  const handleActorLinkDelete = () => {
    onOpen("deleteUserActorLink", {
      userActorLink: user.actor ?? undefined,
    });
  };

  const handleUserRoleEdit = () => {
    onOpen("editUserRole", {
      user,
    });
    // toast.custom(
    //   <div className="bg-blue-500 rounded-full flex items-center gap-x-2 py-2 px-3">
    //     <HelpCircle className="w-5 h-5" />
    //     {t("messages.soon", { ns: "constants" })}
    //   </div>
    // );
  };

  const handleUserEdit = () => {
    // router.push(editUrl);
    
   toast.custom(
      <div className="bg-blue-500 rounded-full flex items-center gap-x-2 py-2 px-3">
        <HelpCircle className="w-5 h-5" />
        {t("messages.soon", { ns: "constants" })}
      </div>
    );
  };

  const isAdminUser = isAdmin(activeUser?.role as UserRole);
  const isEditable = isAdminUser || isMyProfile;
  const editUrl = isMyProfile
    ? `/${locale}/settings`
    : `/${locale}/admin/users/${user.id}`;

  useEffect(() => {
    isMyProfile
      ? router.prefetch(`/${locale}/settings`)
      : router.prefetch(`/${locale}/admin/users/${user.id}`);
  }, [isMyProfile, user.id]);
  return (
    <div className="px-10">
      <div
        className={cn(
          "w-full flex flex-wrap items-start justify-between gap-6 relative"
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
            src={user.image ?? "/default-profile.png"}
            fill
            className="object-contain rounded-lg !relative"
            alt={`${user.name} ${t("profile.single", { ns: "constants" })}`}
          />
          {/* </AspectRatio> */}
        </div>
        <TooltipProvider>
          <div className="w-full relative space-y-4 sm:flex-1 sm:h-full flex flex-col items-start justify-center">
            <div className="w-full flex flex-wrap items-center justify-between">
              <div className="flex gap-y-2 mb-2 items-start flex-wrap flex-col">
                <h1 className="text-2xl font-semibold capitalize">
                  {user.name}
                </h1>
                <p className="font-medium text-sm text-muted-foreground">
                  {user.id}{" "}
                  <Button
                    onClick={handleCopy}
                    size={"icon"}
                    variant={"outline"}
                    className="w-6 h-6 p-1"
                  >
                    {isCopy ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </p>
                <Link href={`mailto:${user.email}`}>
                  <div className="flex flex-nowrap hover:text-red-500 items-center font-medium text-sm text-muted-foreground">
                    <MailIcon className="h-5 w-5 ltr:mr-2 text-primary rtl:ml-2" />
                    {user.email}
                  </div>
                </Link>

                <div className="flex items-center text-lg">
                  <Badge variant={"secondary"}>
                    <BadgeAlert className="h-5 w-5 ltr:mr-2 text-primary rtl:ml-2" />
                    {t(`UserRole.${user.role}`, { ns: "common" })}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Badge variant={"secondary"}>
                    <LucideTicket className="h-5 w-5 ltr:mr-2 text-orange-300 rtl:ml-2" />
                    {user.tickets?.length}
                  </Badge>
                </div>
                {isMyProfile && (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center">
                        {user.isTwoFactorEnabled ? (
                          <CheckSquare className="h-5 w-5 ltr:mr-2 text-emerald-500 rtl:ml-2" />
                        ) : (
                          <XSquare className="h-5 w-5 ltr:mr-2 text-red-500 rtl:ml-2" />
                        )}
                        2fa
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      2fa{" "}
                      {user.isTwoFactorEnabled
                        ? t("status.enabled", { ns: "common" })
                        : t("status.disabled", { ns: "common" })}
                    </TooltipContent>
                  </Tooltip>
                )}

                {executorProfile && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Link
                        href={`/${locale}/executors/${executorProfile?.id}`}
                      >
                        <div className="flex items-center justify-start gap-x-2">
                          <Speech className="w-5 h-5 text-primary" />
                          <p className="text-medium font-semibold ">
                            {executorProfile?.name}{" "}
                            {executorProfile?.nickname
                              ? `(${executorProfile?.nickname})`
                              : ""}
                          </p>
                        </div>
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" align="start">
                      <div className="flex justify-start gap-x-4 items-center space-x-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage
                            src={executorProfile?.imgUrl}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary text-xl">
                            {executorProfile?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Link
                          href={`/${locale}/executors/${executorProfile.id}`}
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {executorProfile.name}{" "}
                              {executorProfile.nickname
                                ? `(${executorProfile.nickname})`
                                : ""}
                            </h4>
                          </div>
                        </Link>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
                {actorProfile && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Link href={`/${locale}/actors/${actorProfile.id}`}>
                        <div className="flex items-center justify-start gap-x-2">
                          <Drama className="w-5 h-5 text-primary" />
                          <p className="text-medium font-semibold ">
                            {actorProfile.name}{" "}
                            {actorProfile.nickname
                              ? `(${actorProfile?.nickname})`
                              : ""}
                          </p>
                        </div>
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" align="start">
                      <div className="flex justify-start gap-x-4 items-center space-x-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage
                            src={actorProfile.imgUrl}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary text-xl">
                            {actorProfile.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Link href={`/${locale}/actors/${actorProfile.id}`}>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {actorProfile.name}{" "}
                              {actorProfile.nickname
                                ? `(${actorProfile.nickname})`
                                : ""}
                            </h4>
                          </div>
                        </Link>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>

              {isEditable && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className="self-start"
                    >
                      <MoreHorizontal className="w-5 h-5 text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className="flex rtl:flex-row-reverse">
                      {t("action.plural", { ns: "constants" })}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {isAdminUser && (
                      <>
                        {actorProfile ? (
                          <DropdownMenuItem
                            className="flex justify-start rtl:flex-row-reverse px-0"
                            onClick={handleActorLinkDelete}
                          >
                            <Trash className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                            {t("actions.unlink", {
                              ns: "common",
                              instance: t("actor.single", { ns: "constants" }),
                            })}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="flex justify-start rtl:flex-row-reverse px-0"
                            onClick={handleUserActorLink}
                          >
                            <Link2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                            {t("actions.link", {
                              ns: "common",
                              instance: t("actor.single", { ns: "constants" }),
                            })}
                          </DropdownMenuItem>
                        )}
                        {executorProfile ? (
                          <DropdownMenuItem
                            className="flex justify-start rtl:flex-row-reverse px-0"
                            onClick={handleExecutorLinkDelete}
                          >
                            <Trash className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                            {t("actions.unlink", {
                              ns: "common",
                              instance: t("executor.single", {
                                ns: "constants",
                              }),
                            })}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="flex justify-start rtl:flex-row-reverse px-0"
                            onClick={handleUserExecutorLink}
                          >
                            <Link2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                            {t("actions.link", {
                              ns: "common",
                              instance: t("executor.single", {
                                ns: "constants",
                              }),
                            })}
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    <DropdownMenuItem
                      className="flex justify-start rtl:flex-row-reverse px-0"
                      onClick={handleUserEdit}
                    >
                      <Pencil className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                      {t("actions.edit", {
                        ns: "common",
                        instance: t("user.single", { ns: "constants" }),
                      })}
                    </DropdownMenuItem>
                    {isAdminUser && (
                      <DropdownMenuItem
                        className="flex justify-start rtl:flex-row-reverse px-0"
                        onClick={handleUserRoleEdit}
                      >
                        <Pencil className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                        {t("actions.edit", {
                          ns: "common",
                          instance: t("role.single", { ns: "constants" }),
                        })}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex justify-start rtl:flex-row-reverse px-0 text-primary"
                      onClick={handleUserDelete}
                    >
                      <Trash className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                      {t("actions.delete", {
                        ns: "common",
                        instance: t("user.single", { ns: "constants" }),
                      })}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </TooltipProvider>
      </div>

      <>
        <Separator className="bg-red-100 dark:bg-red-700/15  my-10" />
        <section className="space-y-3 w-full">
          <h3 className="font-bold text-2xl capitalize">
            {t("ticket.plural", { ns: "constants" })} ({user.tickets?.length})
          </h3>

          {user.tickets?.length > 0 ? (
            <TicketList tickets={user?.tickets} />
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-muted-foreground text-lg">
                {t("messages.no-previous-tickets", { ns: "constants" })}
              </p>
            </div>
          )}
        </section>
      </>
    </div>
  );
};

export default UserClient;

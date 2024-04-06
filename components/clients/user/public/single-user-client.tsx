"use client";

import { Locale } from "@/next-i18next.config";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AudioLines,
  Award,
  Check,
  CheckSquare,
  Copy,
  LucideTicket,
  MailIcon,
  // CalendarDays,
  Pencil,
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

  // const router = useRouter();
  const params = useParams();

  // const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updateUser = useUserStore((state) => state.updateUser);
  const handleDelete = () => {
    onOpen("deleteUser", { user });
  };

  const handleEdit = () => {
    // router.push(`/${locale}/admin/users/${user.id}`);
    toast.custom("soon not supported");
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
                <div className="flex items-center">
                  <Badge variant={"secondary"}>
                    <LucideTicket className="h-5 w-5 ltr:mr-2 text-orange-300 rtl:ml-2" />
                    {user.tickets?.length}
                  </Badge>
                </div>
              </div>
              {isAdmin(activeUser?.role as UserRole) && (
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
                          instance: t("user.single", { ns: "constants" }),
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
                          instance: t("user.single", { ns: "constants" }),
                        })}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* <div className="flex item-center justify-start gap-2">
              <Badge
                variant={"secondary"}
                className="flex items-center justify-center rtl:flex-row-reverse gap-x-1 px-3 py-2"
              >
                <span>
                  {t(`FacultyCast.${user.}`, { ns: "common" })}
                </span>
                <span>{t(`cast.single`, { ns: "constants" })}</span>
              </Badge>
            </div> */}
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
                    onClick={() => router.push(`${user.id}/book-tickets`)}
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
            <TicketList tickets={user.tickets} />
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

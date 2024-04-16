"use client";

import { FC, HTMLAttributes } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBigInt } from "@/lib/helpers/bigInt-converter";
import { TicketCardType } from "@/types";
import {
  Eye,
  PartyPopper,
  Tag,
  Contact,
  Theater,
  Calendar,
  Scan,
  Clock,
  Trash,
  MoreHorizontal,
  Share,
  Share2,
  Edit,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { removeArrayDuplicates } from "@/lib/helpers/list-fomratters";
import { Badge } from "@/components/ui/badge";
import { FacultyCast, UserRole } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "date-fns";
import { useModal } from "@/hooks/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { isAdmin } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { isAdmin } from "@/lib/auth";
// import { useCurrentRole } from "@/hooks/use-current-role";
// import { UserRole } from "@prisma/client";
interface TicketCardProps extends HTMLAttributes<HTMLElement> {
  ticket: TicketCardType;
  mode?: "details" | "abstract";
}
const TicketCard: FC<TicketCardProps> = (props) => {
  const { ticket, className, mode = "details" } = props;
  const { t } = useTranslation();

  const params = useParams();
  const onOpen = useModal((state) => state.onOpen);
  // const router = useRouter();
  const loggedUser = useCurrentUser();

  const locale = params.locale as string;
  const userId = params.userId as string;
  // const handleEdit = () => {
  //   router.push(`/${locale}/admin/tickets/${ticket.id}`);
  // };

  const handleScan = () => {
    onOpen("scanTicket", { ticket });
  };

  const handleTicketDelete = () => {
    onOpen("deleteTicket", { ticket });
  };

  const handleTicketShare = () => {
    onOpen("shareTicket", { ticket });
  };

  const handleTicketEdit = () => {
    onOpen("editTicket", { ticket });
  };

  const isMyTicket = loggedUser?.id === userId;
  const isEditable = isMyTicket || isAdmin(loggedUser?.role as UserRole);
  return (
    <TooltipProvider>
      <Card className="relative">
        <CardHeader className="flex items-center justify-between flex-row w-full flex-wrap">
          <div className="flex-1">
            <CardTitle className="text-wrap text-md break-words text-orange-300">
              {ticket.id}
            </CardTitle>
            {mode === "details" && !ticket.isScanned && isEditable && (
              <div className="flex items-center justify-between">
                <Button onClick={handleScan} size={"sm"}>
                  <Scan className="rtl:ml-2 ltr:mr-2 w-5 h-5" />
                  {`${t("scan.default", {
                    ns: "constants",
                  })} ${t("ticket.single", { ns: "constants" })}`}
                </Button>
              </div>
            )}
          </div>
          {isEditable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="self-start min-w-10"
                >
                  <MoreHorizontal className="w-5 h-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="px-2">
                <DropdownMenuLabel className="flex rtl:flex-row-reverse">
                  {t("action.plural", { ns: "constants" })}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex justify-start rtl:flex-row-reverse"
                  onClick={handleTicketShare}
                >
                  <Share2 className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                  {t("actions.share", {
                    ns: "common",
                    instance: t("ticket.single", { ns: "constants" }),
                  })}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex justify-start rtl:flex-row-reverse"
                  onClick={handleTicketEdit}
                >
                  <Edit className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                  {t("actions.edit", {
                    ns: "common",
                    instance: t("ticket.single", { ns: "constants" }),
                  })}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex justify-start rtl:flex-row-reverse px-0 text-primary"
                  onClick={handleTicketDelete}
                >
                  <Trash className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
                  {t("actions.delete", {
                    ns: "common",
                    instance: t("ticket.single", { ns: "constants" }),
                  })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 text-xs font-medium">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center md:text-lg truncate">
                  <Contact className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  {ticket.guestName}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("forms.labels.guestName", { ns: "constants" })}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* <p className=" text-gray-600">Date: May 15, 2023</p>
          <p className="mt-2 text-gray-600">Time: 7:00 PM</p>
          <p className="mt-2 text-gray-600">Location: Venue Name, City</p>
          <p className="mt-2 text-gray-600">Seat Number: A12</p> */}
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center md:text-lg truncate">
                  <Theater className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  {ticket.play.name}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("forms.labels.playName", { ns: "constants" })}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 w-full text-xs font-medium">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center md:text-lg w-full">
                  <PartyPopper className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />
                  <p className="truncate text-ellipsis hover:text-pretty flex-1">
                    {ticket.festival.name}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("forms.labels.festivalName", { ns: "constants" })}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-3 text-xs font-medium justify-between">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center">
                  <Calendar className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  <span>{formatDate(ticket.showTime, "dd-MMM-yyyy")}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("showTime.single", { ns: "constants" })}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center">
                  <Clock className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  <span>{formatDate(ticket.showTime, "HH:mm")}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("showTime.single", { ns: "constants" })}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center justify-center">
                  <Tag className="rtl:ml-2 ltr:mr-2 w-5 h-5 text-primary" />{" "}
                  {ticket.price > 0
                    ? `${ticket.price}$`
                    : t("status.free", { ns: "common" })}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {" "}
                  {ticket.price > 0
                    ? `${ticket.price}$`
                    : t("status.free", { ns: "common" })}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
        {mode === "details" && (
          <Tooltip>
            <TooltipTrigger
              className={cn(
                "z-10 w-5 h-5 rounded-full absolute ltr:right-2 rtl:left-2 bottom-2",
                ticket.isScanned && "bg-emerald-500",
                !ticket.isScanned && "bg-gray-300"
              )}
            >
              <div />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {ticket.isScanned
                  ? t("status.scanned")
                  : t("status.notScanned")}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default TicketCard;

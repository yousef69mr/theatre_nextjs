"use client";

import { Locale } from "@/next-i18next.config";
import { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  // CalendarDays,
  Pencil,
  Trash,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { TicketType } from "@/types";
import { cn } from "@/lib/utils";

import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useModal } from "@/hooks/stores/use-modal-store";
import { useTicketStore } from "@/hooks/stores/use-ticket-store";

import { useCurrentRole } from "@/hooks/use-current-role";
import { isAdmin } from "@/lib/auth";
import { UserRole } from "@prisma/client";

import QRCode from "react-qr-code";
import { useCurrentUser } from "@/hooks/use-current-user";
import toast from "react-hot-toast";

interface TicketClientProps {
  ticket: TicketType;
}

const TicketClient: FC<TicketClientProps> = (props) => {
  const { ticket } = props;
  // const role = useCurrentRole();
  const loggedUser = useCurrentUser();
  const { t } = useTranslation();
  // const { isBelowMd, isAboveMd } = useBreakpoint("md");
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updateTicket = useTicketStore((state) => state.updateTicket);
  const updateTicket = useTicketStore((state) => state.updateTicket);

  const handleDelete = () => {
    onOpen("deleteTicket", { ticket });
  };

  const handleEdit = () => {
    // router.push(`/${locale}/admin/tickets/${ticket.id}`);
    toast.custom(
      <div className="bg-blue-500 rounded-full flex items-center gap-x-2 py-2 px-3">
        <HelpCircle className="w-5 h-5" />
        {t("messages.soon", { ns: "constants" })}
      </div>
    );
  };

  useEffect(() => {
    updateTicket(ticket);
  }, [ticket]);

  const ticketScanUrlValue = `${process.env.NEXT_PUBLIC_DOMAIN}/api/tickets/${ticket?.id}/scan`;

  const isMyTicket = loggedUser?.id === ticket.userId;
  const isEditable = isMyTicket || isAdmin(loggedUser?.role as UserRole);
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
            "w-full min-h-80 sm:max-w-56 md:max-w-64 lg:max-w-80 flex items-center justify-center  md:top-28 md:sticky dark:bg-zinc-400 dark:p-3 rounded-lg"
          )}
        >
          <QRCode
            size={256}
            className="w-full h-full max-w-full object-contain rounded-lg !relative"
            value={ticketScanUrlValue}
            viewBox={`0 0 256 256`}
          />
        </div>
        <TooltipProvider>
          <div className="w-full relative space-y-4 sm:flex-1 sm:h-full flex flex-col items-start justify-center">
            <div className="w-full flex flex-wrap items-center justify-between">
              <div className="flex gap-x-2 items-center">
                <h1 className="text-2xl font-semibold capitalize">
                  {ticket.id}
                </h1>
              </div>
              {isEditable && (
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
                          instance: t("ticket.single", { ns: "constants" }),
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
                          instance: t("ticket.single", { ns: "constants" }),
                        })}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TicketClient;

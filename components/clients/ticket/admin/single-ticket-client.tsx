"use client";
import { Locale } from "@/next-i18next.config";
import React, { FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, Trash } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { TicketType } from "@/types";
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
// import TicketForm from "@/components/forms/models/ticket-form";
// import { updateTicketRequest } from "@/lib/api-calls/models/ticket";
import { useModal } from "@/hooks/stores/use-modal-store";
import { useTicketStore } from "@/hooks/stores/use-ticket-store";
// import toast from "react-hot-toast";
import PermissionBox from "@/components/helpers/permission-box";

import Link from "next/link";

interface TicketClientProps {
  ticket: TicketType | null;
}
const TicketClient: FC<TicketClientProps> = (props) => {
  const { ticket } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updateTicket = useTicketStore((state) => state.updateTicket);
  const updateTicket = useTicketStore((state) => state.updateTicket);

  const headingTitle = ticket
    ? `${t("ticket.single", { ns: "constants" })} ${ticket.id}`
    : `${t("actions.add", {
        instance: t("ticket.single", { ns: "constants" }),
      })}`;

  const handleDelete = () => {
    onOpen("deleteTicket", { ticket: ticket || undefined });
  };
  const handleBookTicket = () => {
    router.push(`/${locale}/tickets/${ticket?.id}/book-tickets`);
  };
  // const handlePublished = (isPublished: boolean) => {
  //   // onOpen("deleteActor", { actor: actor });
  //   if (ticket) {
  //     updateTicketRequest(
  //       {
  //         guestName: ticket.guestName,
  //         showTime: ticket.showTime.toString(),
  //         executorId: ticket.director?.id as string,
  //         showTime: new Date(),
  //         festivalId: "__",
  //         isPublished,
  //       },
  //       ticket.id
  //     )
  //       .then((response) => response.json())
  //       .then(async (data) => {
  //         // console.log("api success");
  //         data.isPublished
  //           ? toast.success(
  //               t("messages.published", {
  //                 ns: "constants",
  //                 instance: t("ticket.single", { ns: "constants" }),
  //               })
  //             )
  //           : toast.success(
  //               t("messages.unpublished", {
  //                 ns: "constants",
  //                 instance: t("ticket.single", { ns: "constants" }),
  //               })
  //             );

  //         updateTicket(data);
  //         router.refresh();
  //       })
  //       .catch((error) => toast.error("something went wrong"));
  //   }
  // };

  useEffect(() => {
    ticket && updateTicket(ticket);
  }, [ticket]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {ticket && (
          <>
            <Link href={`/${locale}/tickets/${ticket.id}`}>
              <Heading title={headingTitle} />
            </Link>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleDelete} variant={"destructive"}>
                      <Trash
                        className={cn("md:ltr:mr-2 md:rtl:ml-2 h-4 w-4")}
                      />
                      <span className="hidden md:block">
                        {t("actions.delete", {
                          ns: "common",
                          instance: t("ticket.single", { ns: "constants" }),
                        })}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="md:hidden flex">
                    <span>
                      {t("actions.delete", {
                        ns: "common",
                        instance: t("ticket.single", { ns: "constants" }),
                      })}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>
      <Separator />
      {/* <TicketForm initialData={ticket} /> */}
      {/* {ticket && (
        <>
          <Separator className="bg-red-100 dark:bg-red-700/15" />
          <PermissionBox
            handleDelete={handleDelete}
            type={"ticket"}
            // isPublished={ticket.isPublished}
            // handleIsPublished={handlePublished}
          />
        </>
      )} */}
    </div>
  );
};

export default TicketClient;

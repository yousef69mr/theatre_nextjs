"use client";

import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/stores/use-modal-store";

import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { CheckSquare } from "lucide-react";
import TicketList from "@/components/cards/tickets/ticket-list";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// import { useTicketStore } from "@/hooks/stores/use-ticket-store";

export const ShowBookedTicketsModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const loggedUser = useCurrentUser();
  // const removeTicket = useTicketStore((state) => state.removeTicket);
  const params = useParams();

  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "showBookedTickets";
  const { tickets = [] } = data;

  const locale = params.locale;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="pb-3">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            {t("greetings.congratulations", {
              ns: "constants",
            })}
          </DialogTitle>
          <div className="flex items-center justify-center gap-x-2 flex-nowrap">
            <CheckSquare className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 font-semibold">
              {t("messages.booked", {
                ns: "constants",
                instance: t("ticket.plural", { ns: "constants" }),
              })}
            </span>
          </div>
        </DialogHeader>
        <section className="w-full p-4 rounded-lg">
          <TicketList tickets={tickets} mode="modal" />
        </section>
        {/* <DialogDescription className="text-zinc-500 px-4 pb-2 md:text-lg">
          <span className="text-red-500">**</span>{" "}
          {t("messages.ticket-scanned-once", { ns: "constants" })}
        </DialogDescription> */}
        <Separator className="bg-red-100 dark:bg-red-700/15" />
        <DialogFooter>
          <Link href={`/${locale}/users/${loggedUser?.id}`}>
            <Button variant={"outline"} size="sm" onClick={onClose}>
              {t("actions.navigateTo", {
                ns: "common",
                instance: t("userMenu.profile", { ns: "common" }),
              })}
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

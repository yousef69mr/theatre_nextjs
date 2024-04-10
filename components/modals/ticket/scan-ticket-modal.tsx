"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/stores/use-modal-store";

import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

// import { useTicketStore } from "@/hooks/stores/use-ticket-store";

export const ScanTicketModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  // const removeTicket = useTicketStore((state) => state.removeTicket);
  // const params = useParams();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "scanTicket";
  const { ticket } = data;

  // const locale = params.locale;

  const ticketScanUrlValue = `${process.env.NEXT_PUBLIC_DOMAIN}/api/tickets/${ticket?.id}/scan`;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="pb-2">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {t("actions.scan", {
              ns: "common",
              instance: t("ticket.single", { ns: "constants" }),
            })}
          </DialogTitle>
          <span className="text-primary font-semibold">#{ticket?.id}</span>
        </DialogHeader>
        <div className="w-full p-10 dark:bg-zinc-800 rounded-lg">
          <QRCode
            size={256}
            className="w-full mx-auto max-w-full h-auto"
            value={ticketScanUrlValue}
            viewBox={`0 0 256 256`}
          />
        </div>
        <DialogDescription className="text-zinc-500 px-4 pb-2 md:text-lg">
          <span className="text-red-500">**</span>{" "}
          {t("messages.ticket-scanned-once", { ns: "constants" })}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

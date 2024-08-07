"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
import ScanPlayTickeForm from "@/components/forms/actions/scan-play-ticket-form";

// import { useTicketStore } from "@/hooks/stores/use-ticket-store";

export const ScanTicketModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  // const removeTicket = useTicketStore((state) => state.removeTicket);
  // const params = useParams();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "scanTicket";
  const { play } = data;

  const searchParams = useSearchParams();

  const playId = searchParams.get("playId");
  const festivalId = searchParams.get("festivalId");

  // const locale = params.locale;
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="pb-2">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold capitalize">
            {t("actions.scan", {
              ns: "common",
              instance: t("ticket.single", { ns: "constants" }),
            })}
          </DialogTitle>
          {play && (
            <span className="text-primary font-semibold">#{play.name}</span>
          )}
        </DialogHeader>
        <ScanPlayTickeForm
          initialData={{
            festivalId,
            playId,
          }}
          mode="modal"
        />
        {/* <DialogDescription className="text-zinc-500 px-4 pb-2 md:!text-lg">
          <span className="text-red-500">**</span>{" "}
          {t("messages.ticket-scanned-once", { ns: "constants" })}
        </DialogDescription> */}
      </DialogContent>
    </Dialog>
  );
};

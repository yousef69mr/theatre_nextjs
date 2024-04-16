"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
import { useModal } from "@/hooks/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import TicketForm from "@/components/forms/models/ticket-form";
// import { useBreakpoint } from "@/hooks/use-break-point";
// import { useTicketStore } from "@/hooks/stores/use-ticket-store";

export const EditTicketModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  // const removeTicket = useTicketStore((state) => state.removeTicket);
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as string;
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "editTicket";
  const { ticket = null } = data;

  // const { isAboveMd } = useBreakpoint("md");
  const [copied, setCopied] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [inviteLink, setInviteLink] = useState<string | null>(null);

  // const locale = params.locale;

  const title = t("actions.edit", {
    ns: "constants",
    instance: t("ticket.single", {
      ns: "constants",
    }),
  });
  // if (isAboveMd) {
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">{title}</DialogTitle>
          <p className="text-sm text-primary truncate">#{ticket?.id}</p>
        </DialogHeader>
        <div className="p-4">
          <TicketForm
            initialData={ticket}
            className="flex flex-col justify-center w-full"
            mode="modal"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
  // }
};

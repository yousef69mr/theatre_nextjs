"use client";

import { Locale } from "@/next-i18next.config";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  Download,
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
  const [isCopy, setIsCopy] = useState(false);
  // const { isBelowMd, isAboveMd } = useBreakpoint("md");
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as Locale;

  const onOpen = useModal((state) => state.onOpen);
  // const updateTicket = useTicketStore((state) => state.updateTicket);
  const updateTicket = useTicketStore((state) => state.updateTicket);

  const handleCopy = async () => {
    setIsCopy(true);

    await window.navigator.clipboard
      .writeText(ticket.id)
      .then(() => {
        toast.success(
          t("messages.copied", { ns: "constants", instance: `#${ticket.id}` })
        );
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

  const handleDelete = () => {
    onOpen("deleteTicket", { ticket });
  };

  const handleEdit = () => {
    onOpen("editTicket", { ticket });

    // toast.custom(
    //   <div className="bg-blue-500 rounded-full flex items-center gap-x-2 py-2 px-3">
    //     <HelpCircle className="w-5 h-5" />
    //     {t("messages.soon", { ns: "constants" })}
    //   </div>
    // );
  };

  useEffect(() => {
    updateTicket(ticket);
  }, [ticket]);

  const ticketScanUrlValue = `${process.env.NEXT_PUBLIC_DOMAIN}/api/tickets/${ticket?.id}/scan`;

  const isMyTicket = loggedUser?.id === ticket.userId;
  const isEditable = isMyTicket || isAdmin(loggedUser?.role as UserRole);

  const handleQRCodeDownload = () => {
    const svg = document.getElementById("QRCode");
    const svgData = new XMLSerializer().serializeToString(svg!);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${ticket.id}`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };
  return (
    <div className="md:px-10">
      <div
        className={cn(
          "w-full flex flex-row flex-wrap items-start justify-between gap-6 relative"
          // isBelowMd && "!flex-col"
        )}
      >
        <div
          className={cn(
            "w-full sm:max-w-56 md:max-w-64 lg:max-w-80 flex items-center justify-center dark:bg-primary dark:p-2 rounded-lg"
          )}
        >
          <QRCode
            size={256}
            className="w-full h-full max-w-full object-contain rounded-lg !relative"
            value={ticketScanUrlValue}
            viewBox={`0 0 256 256`}
            id="QRCode"
          />
        </div>
        <TooltipProvider>
          <div className="w-full relative space-y-4 sm:flex-1 sm:h-full flex flex-col items-start justify-center">
            <div className="w-full flex flex-wrap items-center justify-between">
              <div className="flex gap-x-2 items-center">
                <h1 className="text-lg md:text-2xl w-full font-semibold capitalize">
                  <span className="break-all text-wrap word">{ticket.id}</span>
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
                </h1>
              </div>

              <div className="flex items-center gap-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"secondary"}
                      onClick={handleQRCodeDownload}
                    >
                      <Download className={"h-4 w-4"} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      {t("actions.download", {
                        ns: "common",
                        instance: t("qr-code.single", { ns: "constants" }),
                      })}
                    </span>
                  </TooltipContent>
                </Tooltip>
                {isEditable && (
                  <>
                    {!ticket.isScanned && (
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
                    )}
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
                  </>
                )}
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TicketClient;

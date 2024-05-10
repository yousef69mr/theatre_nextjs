"use client";

import { useState, FC } from "react";
import QRScanner from "@/components/helpers/qr-scanner";
import { useTranslation } from "react-i18next";
// import { Button } from "@/components/ui/button";
import { scanTicketsRequest } from "@/lib/api-calls/actions/scan-tickets";
import toast from "react-hot-toast";
import { useTicketStore } from "@/hooks/stores/use-ticket-store";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useModal } from "@/hooks/stores/use-modal-store";
import { PlayType, TicketType } from "@/types";
import TicketCard from "../cards/tickets/ticket-card";

interface TicketQRScannerProps {
  play?: PlayType;
}
const TicketQRScanner: FC<TicketQRScannerProps> = (props) => {
  const { play } = props;
  const { t } = useTranslation();
  const [scannedData, setScannedData] = useState<TicketType | string>(
    t("errors.notFound", {
      ns: "constants",
      instance: t("ticket.plural", { ns: "constants" }),
    })
  );
  const updateTicket = useTicketStore((state) => state.updateTicket);
  const onOpen = useModal((state) => state.onOpen);

  const handleScan = async (data: string) => {
    setScannedData(data);
    // Perform additional actions based on scanned data if needed
    const url = new URL(data);
    // console.log(url.origin);
    if (url.origin !== process.env.NEXT_PUBLIC_DOMAIN) {
      toast.error("Invalid ticket link url: " + url.origin);
      return;
    }
    await scanTicketsRequest(data)
      .then((data) => {
        // console.log(localPlays);
        updateTicket(data);
        toast.success(
          t("messages.scanned", {
            ns: "constants",
            instance: t("ticket.single", { ns: "constants" }),
          })
        );
      })
      .catch((error: Error) => {
        toast.error(error.message);
        // console.error(error.message);
      });
  };

  const handleError = (error: Error) => {
    console.error("QR scanning error:", error);
  };

  const handleScanTicketWithSearch = () => {
    onOpen("scanTicket", { play });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Button onClick={handleScanTicketWithSearch}>
        {t("messages.scan-with-search", {
          ns: "constants",
          instance: t("ticket.single", { ns: "constants" }),
        })}
      </Button>
      <div className="flex gap-x-2 my-4 items-center mx-auto">
        <Separator className="w-36" />
        <span>{t("or", { ns: "constants" })}</span>
        <Separator className="w-36" />
      </div>
      <QRScanner onScan={handleScan} onError={handleError} />
      {/* </div> */}
      {/* <Button>{t("scan.defualt", { ns: "constants" })}</Button> */}
      {typeof scannedData === "string" ? (
        <p className=" text-black dark:text-white ">{scannedData}</p>
      ) : (
        <TicketCard ticket={scannedData} mode="abstract" />
      )}
    </div>
  );
};

export default TicketQRScanner;

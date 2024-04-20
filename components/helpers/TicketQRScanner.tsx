"use client";

import { useState } from "react";
import QRScanner from "@/components/helpers/qr-scanner";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { scanTicketsRequest } from "@/lib/api-calls/actions/scan-tickets";
import toast from "react-hot-toast";
import { useTicketStore } from "@/hooks/stores/use-ticket-store";

const TicketQRScanner = () => {
  const [scannedData, setScannedData] = useState<string | null>("no results");
  const { t } = useTranslation();
  const updateTicket = useTicketStore((state) => state.updateTicket);

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

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <QRScanner onScan={handleScan} onError={handleError} />
      {/* </div> */}
      {/* <Button>{t("scan.defualt", { ns: "constants" })}</Button> */}
      {scannedData && (
        <p className=" text-black dark:text-white ">
          Scanned data: {scannedData}
        </p>
      )}
    </div>
  );
};

export default TicketQRScanner;

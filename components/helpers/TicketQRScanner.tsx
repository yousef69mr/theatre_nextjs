"use client";

import { useState } from "react";
import QRScanner from "@/components/helpers/qr-scanner";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

const TicketQRScanner = () => {
  const [scannedData, setScannedData] = useState<string | null>("no results");
  const { t } = useTranslation();

  const handleScan = (data: string) => {
    setScannedData(data);
    // Perform additional actions based on scanned data if needed
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

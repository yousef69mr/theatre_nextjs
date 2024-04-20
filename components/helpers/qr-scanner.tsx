"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
  onScan: (data: string) => void; // Callback for scanned data
  onError: (error: Error) => void; // Callback for errors
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    // Check for camera permission and availability
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) =>
        setHasCamera(devices.some((device) => device.kind === "videoinput"))
      )
      .catch(onError);
  }, [onError]);

  const handleScanData = (data: string) => {
    if (data) {
      onScan(data); // Trigger callback with scanned data
    }
  };

  return (
    <>
      {hasCamera ? (
        <Scanner onError={onError} onResult={handleScanData} />
      ) : (
        <p>No camera found. Please check your device permissions.</p>
      )}
    </>
  );
};

export default QRScanner;

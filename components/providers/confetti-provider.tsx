"use client";

import ReactConfetti from "react-confetti";

import { useConfettiStore } from "@/hooks/use-confetti-store";

export const ConfettiProvider = () => {
  const confetti = useConfettiStore();

  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      className="pointer-events-none z-[100]"
      numberOfPieces={1000}
      recycle={false}
      gravity={0.35}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    />
  );
};

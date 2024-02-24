
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export type AlertType = "confirm" | "delete" | "save" | "edit";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  type: AlertType;
}

const AlertModal = (props: AlertModalProps) => {
  const { type, isOpen, onClose, onConfirm, isLoading } = props;

  return (
    <Modal
      title={
        type !== "confirm"
          ? `Are you sure you want to ${type}?`
          : `Are you sure?`
      }
      description="This action can't be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-2 space-x-2 flex items-center justify-end w-full">
        <Button disabled={isLoading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming...
            </>
          ) : (
            type
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;

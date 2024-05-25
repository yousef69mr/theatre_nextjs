"use client";


import {
  Dialog,
  DialogContent,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/stores/use-modal-store";
import ExecutorForm from "@/components/forms/models/executor-form";
import { useTranslation } from "react-i18next";

const EditExecutorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "editExecutor";
  const { executor = null } = data;


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {t("actions.edit", {
              ns: "common",
              instance: t("executor.single", { ns: "constants" }),
            })}
          </DialogTitle>
          <p className="text-lg truncate max-w-full">
            {executor?.name} {executor?.nickname ? `(${executor.nickname})` : ""}
          </p>
          <p className="text-sm text-primary truncate">#{executor?.id}</p>
        </DialogHeader>
        <div className="p-4">
          <ExecutorForm
            initialData={executor}
            className="flex flex-col justify-center w-full"
            mode="modal"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditExecutorModal;

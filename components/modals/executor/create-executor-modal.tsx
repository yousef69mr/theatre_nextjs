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

const CreateExecutorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "createExecutor";
  const { executor = null } = data;


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {t("actions.create", {
              ns: "common",
              instance: t("executor.single", { ns: "constants" }),
            })}
          </DialogTitle>
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

export default CreateExecutorModal;

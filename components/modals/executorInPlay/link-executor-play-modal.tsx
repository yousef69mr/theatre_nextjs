"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/stores/use-modal-store";
// import ExecutorForm from "@/components/forms/executor-form";
import { useTranslation } from "react-i18next";
import LinkExecutorPlayForm from "@/components/forms/actions/link-executor-play-form";

const LinkExecutorPlayModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "linkExecutorPlay";
  const { executorInPlay = null } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {executorInPlay
              ? t("actions.edit", {
                  ns: "common",
                  instance: t(`ExecutorRole.${executorInPlay.role}`, {
                    ns: "common",
                  }),
                })
              : t("actions.add", {
                  ns: "common",
                  instance: t("executor.single", { ns: "constants" }),
                })}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <LinkExecutorPlayForm
            initialData={executorInPlay}
            className="flex flex-col justify-center w-full"
            mode="modal"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkExecutorPlayModal;

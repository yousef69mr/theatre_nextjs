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
import LinkUserExecutorForm from "@/components/forms/actions/link-user-executor-form";

const LinkUserExecutorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "linkUserExecutor";
  const { executor = null, user = null } = data;
  const initialData = {
    userId: user?.id ?? undefined,
    executorId: executor?.id ?? undefined,
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {t("actions.linkTo", {
              ns: "common",
              instance: t("executor.single", { ns: "constants" }),
              to: t("user.single", { ns: "constants" }),
            })}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <LinkUserExecutorForm
            initialData={initialData}
            className="flex flex-col justify-center w-full"
            mode="modal"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkUserExecutorModal;

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
import LinkActorPlayForm from "@/components/forms/actions/link-actor-play-form";

const LinkActorPlayModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "linkActorPlay";
  const { actorInPlay = null } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {t("actions.linkTo", {
              ns: "common",
              instance: t("actor.single", { ns: "constants" }),
              to: t("play.single", { ns: "constants" }),
            })}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <LinkActorPlayForm
            initialData={actorInPlay}
            className="flex flex-col justify-center w-full"
            mode="modal"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkActorPlayModal;

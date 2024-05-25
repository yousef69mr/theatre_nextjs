"use client";

import {
  Dialog,
  DialogContent,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/stores/use-modal-store";
import { useTranslation } from "react-i18next";
import ActorForm from "@/components/forms/models/actor-form";

const EditActorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "editActor";
  const { actor = null } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {t("actions.edit", {
              ns: "common",
              instance: t("actor.single", { ns: "constants" }),
            })}
          </DialogTitle>
          <p className="text-lg truncate max-w-full">
            {actor?.name} {actor?.nickname ? `(${actor.nickname})` : ""}
          </p>
          <p className="text-sm text-primary truncate">#{actor?.id}</p>
        </DialogHeader>
        <div className="p-4">
          <ActorForm
            initialData={actor}
            className="flex flex-col justify-center w-full"
            mode="modal"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditActorModal;

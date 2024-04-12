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
import LinkUserActorForm from "@/components/forms/actions/link-user-actor-form";

const LinkUserActorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "linkUserActor";
  const { actor = null, user = null } = data;
  const initialData = {
    userId: user?.id ?? undefined,
    actorId: actor?.id ?? undefined,
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {t("actions.linkTo", {
              ns: "common",
              instance: t("actor.single", { ns: "constants" }),
              to: t("user.single", { ns: "constants" }),
            })}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <LinkUserActorForm
            initialData={initialData}
            className="flex flex-col justify-center w-full"
            mode="modal"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkUserActorModal;

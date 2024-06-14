"use client";

import CastMemberForm from "@/components/forms/models/cast-member-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/stores/use-modal-store";
// import ExecutorForm from "@/components/forms/executor-form";
import { useTranslation } from "react-i18next";

const LinkCastMemberModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "linkCastMember";
  const { castMember = null } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center capitalize truncate">
            {castMember ? (
              <div className="flex gap-x-2 items-center justify-center">
                <span>
                  {t("actions.edit", {
                    ns: "common",
                    instance: t(`UserRole.${castMember.role}`, {
                      ns: "common",
                    }),
                  })}
                </span>

                <span>{t("role.single", { ns: "constants" })}</span>
              </div>
            ) : (
              t("actions.add", {
                ns: "common",
                instance: t("role.single", { ns: "constants" }),
              })
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <CastMemberForm
            initialData={castMember}
            className="flex flex-col justify-center w-full"
            mode="modal"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkCastMemberModal;

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
import LinkFestivalPlayForm from "@/components/forms/actions/link-festival-play-form";
import UserForm from "@/components/forms/models/user-form";

const EditUserRoleModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "editUserRole";
  const { user = null } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {t("actions.edit", {
              ns: "common",
              instance: t("role.single", { ns: "constants" }),
            })}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <UserForm
            initialData={user}
            className="flex flex-col justify-center w-full"
            mode="modal"
            type="role"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserRoleModal;

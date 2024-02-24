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
import FestivalForm from "@/components/forms/models/festival-form";

const CreateFestivalModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { t } = useTranslation();


  const isModalOpen = isOpen && type === "createFestival";
  const { festival = null } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {t("actions.create", {
              ns: "common",
              instance: t("festival.single", { ns: "constants" }),
            })}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <FestivalForm
            initialData={festival}
            className="flex flex-col justify-center w-full"
            mode="modal"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFestivalModal;

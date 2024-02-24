"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useActorStore } from "@/hooks/stores/use-actor-store";
import { deleteFile } from "@/lib/uploadthing";

export const DeleteActorModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const removeActor = useActorStore((state) => state.removeActor);
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "deleteActor";
  const { actor } = data;

  const [isLoading, setIsLoading] = useState(false);

  const locale = params.locale;

  const onClick = async () => {
    try {
      setIsLoading(true);

      await fetch(`/api/actors/${actor?.id}`, { method: "DELETE" });
      actor?.imgUrl && (await deleteFile(actor.imgUrl as string));
      removeActor(actor?.id as string);

      onClose();

      router.refresh();
      toast.success(
        t("messages.deleted", {
          ns: "constants",
          instance: t("actor.single", { ns: "constants" }),
        })
      );
      router.push(`/${locale}/admin/actors`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {t("actions.delete", {
              ns: "common",
              instance: t("actor.single", { ns: "constants" }),
            })}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t("messages.confirm-message", { ns: "constants" })} <br />
            <span className="text-primary font-semibold">#{actor?.name}</span>
            <br />
            {t("messages.irreversible", { ns: "constants" })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className=" px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              {t("cancel.default", { ns: "constants" })}
            </Button>
            {!isLoading ? (
              <Button onClick={onClick} type="submit" variant={"destructive"}>
                {t("delete.default", { ns: "constants" })}
              </Button>
            ) : (
              <Button variant={"destructive"} disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("delete.loading", { ns: "constants" })}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

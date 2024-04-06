"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
// import { useUserStore } from "@/hooks/stores/use-user-store";
import { deleteFile } from "@/lib/uploadthing";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/lib/actions/logout";

export const DeleteUserModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const activeUser = useCurrentUser();
  // const removeUser = useUserStore((state) => state.removeUser);
  const router = useRouter();
  // const params = useParams();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "deleteUser";
  const { user } = data;

  const [isLoading, setIsLoading] = useState(false);

  // const locale = params.locale;

  const onClick = async () => {
    try {
      setIsLoading(true);

      await fetch(`/api/users/${user?.id}`, { method: "DELETE" });
      user?.image && (await deleteFile(user.image as string));
      // removeUser(user?.id as string);

      //delete my own user
      if (activeUser?.id === user?.id) {
        logout();
      }
      onClose();

      router.refresh();
      toast.success(
        t("messages.deleted", {
          ns: "constants",
          instance: t("user.single", { ns: "constants" }),
        })
      );
      // router.push(`/${locale}/admin/users`);
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {t("actions.delete", {
              ns: "common",
              instance: t("user.single", { ns: "constants" }),
            })}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t("messages.confirm-message", { ns: "constants" })} <br />
            <span className="text-primary font-semibold">#{user?.name}</span>
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

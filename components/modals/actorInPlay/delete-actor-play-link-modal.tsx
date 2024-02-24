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
import { useActorStore } from "@/hooks/stores/use-actor-store";
import { PUBLIC_DOMAIN } from "@/routes";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import { usePlayStore } from "@/hooks/stores/use-play-store";

export const DeleteActorPlayLinkModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const removeActorPlays = useActorStore((state) => state.removeActorPlays);
  const removeFestivalActors = useFestivalStore(
    (state) => state.removeFestivalActors
  );
  const removePlayActors = usePlayStore((state) => state.removePlayActors);
  const router = useRouter();
  // const params = useParams();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "deleteActorPlayLink";
  const { actorInPlay } = data;

  const [isLoading, setIsLoading] = useState(false);

  // const locale = params.locale;

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (!actorInPlay) {
        throw Error("link not found");
      }

      await fetch(PUBLIC_DOMAIN.concat(`/api/play-actors/${actorInPlay.id}`), {
        method: "DELETE",
      });

      removeActorPlays(actorInPlay.id, actorInPlay.actor.id);
      removeFestivalActors(actorInPlay.id, actorInPlay.festival.id);
      removePlayActors(actorInPlay.id, actorInPlay.play.id);

      onClose();

      toast.success(
        t("messages.deleted", {
          ns: "constants",
          instance: t("link.single", { ns: "constants" }),
        })
      );
      router.refresh();
      // router.push(`/${locale}/admin/actors`);
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
              instance: t("actions.link", {
                ns: "common",
                instance: t("play.single", { ns: "constants" }),
              }),
            })}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t("messages.confirm-message", { ns: "constants" })} <br />
            <span className="text-primary font-semibold">
              #
              {t("actions.linkTo", {
                ns: "common",
                instance: actorInPlay?.actor.name,
                to: actorInPlay?.play.name,
              })}
            </span>
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

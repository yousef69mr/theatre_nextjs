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
import { PUBLIC_DOMAIN } from "@/routes";
import { useFestivalStore } from "@/hooks/stores/use-festivals-store";
import { usePlayStore } from "@/hooks/stores/use-play-store";

export const DeleteFestivalPlayLinkModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const removePlayFestivals = usePlayStore(
    (state) => state.removePlayFestivals
  );
  const removeFestivalPlays = useFestivalStore(
    (state) => state.removeFestivalPlays
  );

  const router = useRouter();
  // const params = useParams();
  const { t } = useTranslation();

  const isModalOpen = isOpen && type === "deleteFestivalPlayLink";
  const { festivalPlay } = data;

  const [isLoading, setIsLoading] = useState(false);

  // const locale = params.locale;

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (!festivalPlay) {
        throw Error("link not found");
      }

      await fetch(
        PUBLIC_DOMAIN.concat(`/api/play-festivals/${festivalPlay.id}`),
        {
          method: "DELETE",
        }
      );

      removeFestivalPlays(festivalPlay.id, festivalPlay.festival.id);
      removePlayFestivals(festivalPlay.id, festivalPlay.play.id);

      onClose();

      toast.success(
        t("messages.deleted", {
          ns: "constants",
          instance: t("relation.single", { ns: "constants" }),
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
                instance: festivalPlay?.festival.name,
                to: festivalPlay?.play.name,
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

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
import { useModal } from "@/hooks/stores/use-modal-store";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useOrigin } from "@/hooks/use-origin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  EmailIcon,
  EmailShareButton,
  TelegramIcon,
  // FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { dir } from "i18next";
// import { useBreakpoint } from "@/hooks/use-break-point";
// import { useTicketStore } from "@/hooks/stores/use-ticket-store";

export const ShareTicketModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  // const removeTicket = useTicketStore((state) => state.removeTicket);
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as string;
  const { t } = useTranslation();

  const origin = useOrigin();

  const isModalOpen = isOpen && type === "shareTicket";
  const { ticket } = data;

  // const { isAboveMd } = useBreakpoint("md");
  const [copied, setCopied] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [inviteLink, setInviteLink] = useState<string | null>(null);

  const shareTicketUrl = `${origin}/${locale}/tickets/${ticket?.id}`;

  const onCopy = () => {
    navigator.clipboard.writeText(shareTicketUrl);
    setCopied(true);
    toast.success(
      t("messages.copied", {
        ns: "constants",
        instance: t("forms.labels.ticketLink", {
          ns: "constants",
        }),
      })
    );
    setTimeout(() => setCopied(false), 1500);
  };

  // const locale = params.locale;

  const title = `${ticket?.guestName} ${t("ticket.single", {
    ns: "constants",
  })} #${ticket?.id}`;
  // if (isAboveMd) {
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            {t("actions.share", {
              ns: "common",
              instance: t("ticket.single", { ns: "constants" }),
            })}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-sm font-bold">
            {t("forms.labels.ticketLink", {
              ns: "constants",
            })}
          </Label>
          <div className="flex items-center mt-2 gap-x-2 w-full">
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 w-full"
              value={shareTicketUrl}
              readOnly
              // disabled={isLoading}
            />
            <Button onClick={onCopy} size={"icon"}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Separator className="my-3" />
          <div className="flex items-center justify-center mt-2 gap-6">
            {/* social buttons */}
            <WhatsappShareButton
              url={shareTicketUrl}
              title={title}
              dir={dir(locale)}
            >
              <WhatsappIcon round size={46} />
            </WhatsappShareButton>
            <TelegramShareButton
              url={shareTicketUrl}
              title={title}
              dir={dir(locale)}
            >
              <TelegramIcon size={46} round />
            </TelegramShareButton>
            <EmailShareButton
              url={shareTicketUrl}
              title={title}
              dir={dir(locale)}
            >
              <EmailIcon size={46} round />
            </EmailShareButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  // }

  // return (
  //   <Drawer open={isModalOpen} onOpenChange={onClose}>
  //     <DrawerContent>
  //       <DrawerHeader className="text-left">
  //         <DrawerTitle>Edit profile</DrawerTitle>
  //         <DrawerDescription>
  //           Make changes to your profile here. Click save when you're done.
  //         </DrawerDescription>
  //       </DrawerHeader>
  //       {/* <ProfileForm className="px-4" /> */}
  //       <DrawerFooter className="pt-2">
  //         <DrawerClose asChild>
  //           <Button variant="outline">Cancel</Button>
  //         </DrawerClose>
  //       </DrawerFooter>
  //     </DrawerContent>
  //   </Drawer>
  // );
};

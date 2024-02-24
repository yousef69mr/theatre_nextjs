"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlayType } from "@/types";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";

import AlertModal from "@/components/modals/alert-modal";
import { Fragment, useState } from "react";
import axios from "axios";
// import { apiInstance } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { PUBLIC_DOMAIN } from "@/routes";
import { useTranslation } from "react-i18next";
import { dir } from "i18next";
import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/stores/use-modal-store";
// import { useEmployeeStore } from "@/hooks/use-employee-store";

interface Props {
  data: PlayType;
}

const CellAction = (props: Props) => {
  const { data } = props;
  const onOpen = useModal((state) => state.onOpen);
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();

  const locale = params.locale;

  // const [deleting, setDeleting] = useState(false);
  // const [openAlert, setOpenAlert] = useState(false);

  const actions = [
    {
      name: t("edit.default", { ns: "constants" }),
      action: "edit",
      icon: <Edit className="h-4 w-4 ltr:mr-2 rtl:ml-2" />,
    },
    {
      name: t("actions.copy", {
        ns: "constants",
        instance: t("id.single", { ns: "constants" }),
      }),
      action: "copy",
      icon: <Copy className="h-4 w-4 ltr:mr-2 rtl:ml-2" />,
    },
    {
      name: t("delete.default", { ns: "constants" }),
      action: "delete",
      icon: <Trash className="h-4 w-4 ltr:mr-2 rtl:ml-2" />,
    },
  ];

  const handleAction = (control: string) => {
    switch (control) {
      case "edit":
        handleEdit();
        return;
      case "copy":
        handleCopy();
        return;
      case "delete":
        handleDelete();
        return;
      default:
        return;
    }
  };

  const handleEdit = () => {
    router.push(`/${locale}/admin/plays/${data.id}`);
  };

  const handleCopy = () => {
    window.navigator.clipboard.writeText(String(data.id)).then(() =>
      toast.success(
        t("messages.copied", {
          ns: "constants",
          instance: `${t("id.single", { ns: "constants" })} (${data.name})`,
        })
      )
    );
  };
  const handleDelete = () => {
    onOpen("deletePlay", { play: data });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={dir(locale as Locale) === "ltr" ? "end" : "start"}
          className="flex flex-col justify-center text-sm leading-5 font-medium rtl:items-end"
        >
          <DropdownMenuLabel>
            {t("tables.actions", { ns: "constants" })}
          </DropdownMenuLabel>
          {actions.map((action) => (
             <Fragment key={action.action}>
              {action.action === "delete" && <Separator />}
              <DropdownMenuItem
                className={cn(
                  "cursor-pointer flex rtl:flex-row-reverse w-full",
                  action.action === "delete" && "text-destructive"
                )}
                key={action.name}
                onClick={() => handleAction(action.action)}
              >
                {action.icon}
                {action.name}
              </DropdownMenuItem>
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;

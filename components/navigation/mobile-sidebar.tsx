"use client"

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";
import { dir } from "i18next";
import { useNavigationStore } from "@/hooks/use-navigation-store";
// import { LanguageParamsProps } from "@/types";

interface Props {
  locale: Locale;
}

export const MobileSidebar = (props: Props) => {
  const { locale } = props;

  const { isOpen, onOpen, onClose } = useNavigationStore();

  const onChange = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={onChange}>
      <SheetTrigger
        className={cn(
          "md:hidden hover:opacity-75 transition relative",
          dir(locale) === "ltr" ? " pr-4" : "pl-4"
        )}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent
        side={dir(locale) === "ltr" ? "right" : "left"}
        className="p-0 bg-white"
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

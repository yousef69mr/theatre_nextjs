"use client";

import { cn } from "@/lib/utils";
import { FC, HtmlHTMLAttributes } from "react";
import AdminRoutes from "./admin-routes";
import { useNavigationStore } from "@/hooks/stores/use-navigation-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";

interface AdminSidebarProps extends HtmlHTMLAttributes<HTMLDivElement> {}
const AdminSidebar: FC<AdminSidebarProps> = (props) => {
  const { className } = props;
  const { t } = useTranslation();
  const { isAdminOpen, onAdminOpen, onAdminClose } = useNavigationStore();

  const onChange = () => {
    if (isAdminOpen) {
      onAdminClose();
    } else {
      onAdminOpen();
    }
  };
  return (
    <TooltipProvider>
      <section
        className={cn(
          "flex flex-col justify-center items-start w-[4rem] md:w-[12rem] shadow-sm fixed transition-all bottom-16",
          !isAdminOpen && "translate-y-96"
        )}
      >
        <AdminRoutes />
      </section>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "bg-red-100 dark:bg-red-700/15 p-5 rounded-full cursor-pointer transition-all fixed z-50",
              className,
              !isAdminOpen && "animate-bounce repeat-infinite"
            )}
            onClick={onChange}
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">
              {t("menu.single", { ns: "constants" })}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-sm font-medium">
            {t("menus.admin", { ns: "common" })}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AdminSidebar;

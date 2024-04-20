"use client";

import { FC, HtmlHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { adminRouteType } from "@/types";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Drama,
  LayoutDashboard,
  Menu,
  Scan,
  Speech,
  Theater,
  Ticket,
  User,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigationStore } from "@/hooks/stores/use-navigation-store";

const routes = [
  { id: 1, Icon: LayoutDashboard },
  { id: 2, Icon: Theater },
  { id: 3, Icon: Drama },
  { id: 4, Icon: Speech },
  { id: 5, Icon: User },
  { id: 6, Icon: Ticket },
  { id: 7, Icon: Scan },
];

interface AdminRoutesProps extends HtmlHTMLAttributes<HTMLDivElement> {}
const AdminRoutes: FC<AdminRoutesProps> = (props) => {
  const { className } = props;
  const { isAdminOpen, onAdminClose } = useNavigationStore();

  const { t, i18n } = useTranslation();
  const adminRoutes: adminRouteType[] =
    t("adminRoutes", {
      returnObjects: true,
      ns: "admin",
    }) || [];

  return (
    <nav
      className={cn(
        "flex flex-col  items-start justify-center gap-2 p-3",
        className
      )}
    >
      {adminRoutes?.map((adminRoute) => {
        const routeConstants = routes.find(
          (route) => route.id === adminRoute.id
        );

        return (
          <Tooltip key={adminRoute.href}>
            <TooltipTrigger
              className={cn(
                "transition-all duration-500",
                !isAdminOpen && `translate-y-96`
              )}
            >
              <div
                className={cn(
                  "bg-red-100 dark:bg-red-700/15 p-5 rounded-full relative "
                )}
                onClick={onAdminClose}
              >
                <Link
                  href={`/${i18n.language}${adminRoute.href}`}
                  className="flex md:gap-x-1 "
                >
                  {routeConstants ? (
                    <routeConstants.Icon />
                  ) : (
                    <span>{adminRoute.label}</span>
                  )}
                  <span className="hidden md:flex">{adminRoute.label}</span>
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-sm font-medium">{adminRoute.label}</span>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
};

export default AdminRoutes;
